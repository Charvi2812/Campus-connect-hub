import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    if (!containerRef.current) return;
    
    setIsLoading(true);
    
    try {
      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string, _result: Html5QrcodeResult) => {
          onScan(decodedText);
          stopScanner();
        },
        (errorMessage: string) => {
          // QR code not detected, this is normal during scanning
          console.debug("QR Scan:", errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      setHasPermission(false);
      const errorMessage = err instanceof Error ? err.message : "Camera access denied";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Scanner container */}
      <div 
        ref={containerRef}
        className="relative aspect-square bg-muted rounded-2xl overflow-hidden border-2 border-dashed border-border"
      >
        <div id="qr-reader" className="w-full h-full" />
        
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Corner decorations */}
            <div className="absolute inset-4 border-2 border-primary/30 rounded-xl" />
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
            
            <Camera className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center px-8">
              {hasPermission === false 
                ? "Camera access denied. Please enable camera permissions."
                : "Tap button below to start scanning"}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <Button
        variant="hero"
        size="lg"
        className="w-full"
        onClick={isScanning ? stopScanner : startScanner}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Starting Camera...
          </>
        ) : isScanning ? (
          <>
            <CameraOff className="w-5 h-5 mr-2" />
            Stop Scanner
          </>
        ) : (
          <>
            <Camera className="w-5 h-5 mr-2" />
            Start Scanner
          </>
        )}
      </Button>
    </div>
  );
}
