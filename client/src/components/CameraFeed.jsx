import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Camera, CameraOff, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadModels, detectFaces, drawResults } from "@/utils/faceDetection";
import React from "react";

const CameraFeed = ({ onEmotionDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
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
        video: { width: 320, height: 240, facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      await loadModels(); // Load AI models
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

  const analyzeFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const faces = await detectFaces(videoRef.current);
    drawResults(videoRef.current, canvasRef.current, faces, "boxLandmarks");

    if (faces.length > 0) {
      const expressions = faces[0].expressions;
      const emotionData = {
        angry: expressions.angry || 0,
        sad: expressions.sad || 0,
        frustrated: expressions.disgusted || 0,
      };
      onEmotionDetected(emotionData);
    }
  };

  useEffect(() => {
    if (isLoading || !videoRef.current) return;

    const intervalId = setInterval(analyzeFrame, 1000);
    return () => clearInterval(intervalId);
  }, [isLoading, onEmotionDetected]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Facial Emotion Detection
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
            />
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              className="absolute top-0 left-0"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
CameraFeed.propTypes = {
  onEmotionDetected: PropTypes.func.isRequired,
};

export default CameraFeed;
