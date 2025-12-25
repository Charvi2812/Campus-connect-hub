import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Sparkles, Clock, CheckCircle2 } from "lucide-react";

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Sign in to view your events
              </h1>
              <p className="text-muted-foreground mb-8">
                Track your registered events, attendance status, and OD requests all in one place.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
                Sign In to Continue
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-campus-purple/5" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" /> My Dashboard
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              My <span className="text-gradient">Events</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Track your registrations, attendance, and OD status.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-background min-h-[40vh]">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="registered" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="registered">Registered</TabsTrigger>
              <TabsTrigger value="attended">Attended</TabsTrigger>
              <TabsTrigger value="od">OD Status</TabsTrigger>
            </TabsList>

            <TabsContent value="registered">
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No registrations yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Events you register for will appear here.
                </p>
                <Button variant="hero" onClick={() => navigate("/events")}>
                  Browse Events
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="attended">
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No attendance records
                </h3>
                <p className="text-muted-foreground mb-6">
                  Scan QR codes at events to mark your attendance.
                </p>
                <Button variant="hero" onClick={() => navigate("/scan")}>
                  Open Scanner
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="od">
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No OD requests
                </h3>
                <p className="text-muted-foreground">
                  OD entries will be auto-generated when you attend eligible events.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
