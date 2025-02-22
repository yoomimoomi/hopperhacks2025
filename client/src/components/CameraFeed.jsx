import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CameraFeed = ({ onMotionDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const previousImageData = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError(
        err.name === "NotAllowedError"
          ? "Camera access denied. Please grant permission."
          : "Failed to initialize camera."
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const detectMotion = (currentImageData, previousImageData) => {
    const currentData = currentImageData.data;
    const previousData = previousImageData.data;
    let motionPixels = 0;
    let totalPixels = currentData.length / 4;

    for (let i = 0; i < currentData.length; i += 4) {
      const rDiff = Math.abs(currentData[i] - previousData[i]);
      const gDiff = Math.abs(currentData[i + 1] - previousData[i + 1]);
      const bDiff = Math.abs(currentData[i + 2] - previousData[i + 2]);

      if (rDiff > 30 || gDiff > 30 || bDiff > 30) {
        motionPixels++;
      }
    }

    return (motionPixels / totalPixels) * 100;
  };

  const analyzeFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 320, 240);

    const currentImageData = context.getImageData(0, 0, 320, 240);

    if (previousImageData.current) {
      const motionPercentage = detectMotion(
        currentImageData,
        previousImageData.current
      );

      const motionData = {
        timestamp: new Date().getTime(),
        motionLevel: motionPercentage,
        estimatedStress: Math.min(100, motionPercentage * 2),
      };

      onMotionDetected(motionData);
    }

    previousImageData.current = currentImageData;
  };

  useEffect(() => {
    if (isLoading || !videoRef.current) return;

    const intervalId = setInterval(analyzeFrame, 1000);
    return () => clearInterval(intervalId);
  }, [isLoading]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Motion Detection Camera
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription className="flex items-center gap-2">
                <CameraOff className="w-4 h-4" />
                {error}
              </AlertDescription>
            </Alert>
            <Button className="w-full" onClick={initializeCamera}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Camera Access
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-[240px] bg-slate-100 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 animate-spin text-slate-500" />
              <p className="text-sm text-slate-500">Initializing camera...</p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden bg-slate-100">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
              onLoadedMetadata={(e) => e.target.play()}
            />
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              className="absolute top-0 left-0 w-full h-full opacity-0"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
