import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EmotionDisplay = ({ emotionData }) => {
  const [stressLevel, setStressLevel] = useState("low");

  // Calculate stress level based on detected emotions
  useEffect(() => {
    if (!emotionData) return;

    const { angry, sad, frustrated } = emotionData;
    const stressIndicators = angry + sad + frustrated;

    if (stressIndicators > 0.7) setStressLevel("high");
    else if (stressIndicators > 0.4) setStressLevel("medium");
    else setStressLevel("low");
  }, [emotionData]);

  const getStressColor = () => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[stressLevel];
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Current Stress Level</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg ${getStressColor()}`}>
          <div className="flex items-center gap-2">
            {stressLevel === "high" && <AlertTriangle className="w-5 h-5" />}
            <span className="font-medium capitalize">{stressLevel}</span>
          </div>

          {emotionData && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Anger Level:</span>
                <span>{(emotionData.angry * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Sadness Level:</span>
                <span>{(emotionData.sad * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Frustration Level:</span>
                <span>{(emotionData.frustrated * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>

        {stressLevel === "high" && (
          <Alert className="mt-4">
            <AlertDescription>
              Your stress levels appear elevated. Consider taking a short break
              or trying a breathing exercise.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
