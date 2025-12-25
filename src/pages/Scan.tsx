import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRScanner } from "@/components/scanner/QRScanner";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QrCode, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ScanResult {
  status: "idle" | "scanning" | "success" | "error";
  message?: string;
  eventTitle?: string;
}

export default function ScanPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult>({ status: "idle" });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to scan attendance QR codes.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setUserId(session.user.id);
  };

  const handleScan = async (data: string) => {
    if (isProcessing || !userId) return;
    
    setIsProcessing(true);
    setScanResult({ status: "scanning" });

    try {
      // Parse QR data - expected format: { event_id: string, timestamp: number }
      let qrData;
      try {
        qrData = JSON.parse(data);
      } catch {
        throw new Error("Invalid QR code format");
      }

      const { event_id, timestamp } = qrData;

      if (!event_id || !timestamp) {
        throw new Error("Invalid QR code data");
      }

      // Verify QR timestamp (valid for 5 minutes)
      const qrTime = new Date(timestamp).getTime();
      const now = Date.now();
      if (now - qrTime > 5 * 60 * 1000) {
        throw new Error("QR code has expired. Please scan the current QR code.");
      }

      // Fetch event details
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", event_id)
        .single();

      if (eventError || !event) {
        throw new Error("Event not found");
      }

      // Check if event is currently happening
      const now_date = new Date();
      const eventStart = new Date(`${event.start_date}T${event.event_start_time}`);
      const eventEnd = new Date(`${event.end_date}T${event.event_end_time}`);

      if (now_date < eventStart) {
        throw new Error("Event has not started yet");
      }

      if (now_date > eventEnd) {
        throw new Error("Event has already ended");
      }

      // Check for existing attendance record
      const { data: existingAttendance } = await supabase
        .from("event_attendance")
        .select("*")
        .eq("event_id", event_id)
        .eq("user_id", userId)
        .single();

      if (existingAttendance) {
        // Update exit time
        if (existingAttendance.entry_time && !existingAttendance.exit_time) {
          const entryTime = new Date(existingAttendance.entry_time);
          const totalMinutes = Math.floor((now_date.getTime() - entryTime.getTime()) / 60000);
          
          const { error: updateError } = await supabase
            .from("event_attendance")
            .update({
              exit_time: now_date.toISOString(),
              total_minutes: totalMinutes,
              qr_scan_count: existingAttendance.qr_scan_count + 1,
              attendance_status: totalMinutes >= event.minimum_attendance_minutes ? "verified" : "pending",
            })
            .eq("id", existingAttendance.id);

          if (updateError) throw updateError;

          setScanResult({
            status: "success",
            message: `Exit recorded! Total time: ${totalMinutes} minutes`,
            eventTitle: event.title,
          });

          // Create OD entry if eligible
          if (event.is_od_eligible && totalMinutes >= event.minimum_attendance_minutes) {
            await supabase.from("od_list").insert({
              user_id: userId,
              event_id: event_id,
              attendance_id: existingAttendance.id,
              class_date: event.start_date,
              status: "pending",
            });
          }
        } else {
          setScanResult({
            status: "error",
            message: "Attendance already recorded for this event",
          });
        }
      } else {
        // Create new attendance record (entry)
        const { error: insertError } = await supabase
          .from("event_attendance")
          .insert({
            event_id: event_id,
            user_id: userId,
            entry_time: now_date.toISOString(),
            qr_scan_count: 1,
            attendance_status: "pending",
          });

        if (insertError) throw insertError;

        setScanResult({
          status: "success",
          message: "Entry recorded! Remember to scan again when you leave.",
          eventTitle: event.title,
        });
      }

      toast({
        title: "Scan successful!",
        description: scanResult.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process QR code";
      setScanResult({
        status: "error",
        message,
      });
      toast({
        title: "Scan failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanError = (error: string) => {
    toast({
      title: "Camera error",
      description: error,
      variant: "destructive",
    });
  };

  const resetScan = () => {
    setScanResult({ status: "idle" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-campus-teal/5 via-background to-primary/5" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <QrCode className="w-3 h-3 mr-1" /> QR Attendance
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Scan <span className="text-gradient">QR Code</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Mark your attendance at events by scanning the QR code displayed at the venue.
            </p>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-border/50 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="font-display text-xl">
                  Event Attendance Scanner
                </CardTitle>
                <CardDescription>
                  Position the QR code within the frame to scan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Result Display */}
                {scanResult.status === "success" && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-emerald-700 dark:text-emerald-400">
                          {scanResult.eventTitle}
                        </p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-500">
                          {scanResult.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {scanResult.status === "error" && (
                  <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Scan Failed</p>
                        <p className="text-sm text-destructive/80">{scanResult.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <p className="text-primary font-medium">Processing attendance...</p>
                  </div>
                )}

                {/* QR Scanner */}
                {scanResult.status !== "success" && (
                  <QRScanner onScan={handleScan} onError={handleScanError} />
                )}

                {scanResult.status === "success" && (
                  <button
                    onClick={resetScan}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Scan Another QR
                  </button>
                )}

                {/* Info */}
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">How it works</p>
                    <p className="text-muted-foreground">
                      Scan at entry and exit to record your attendance. Minimum attendance time is required for OD eligibility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                    <QrCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    QR Not Scanned
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Verified
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
