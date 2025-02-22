import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, Camera, Menu, X } from "lucide-react";
import Webcam from "react-webcam";
import "bootstrap/dist/css/bootstrap.min.css";

const Alert = ({ title, description, type }) => (
  <div
    className={`alert ${type === "error" ? "alert-danger" : "alert-info"} mt-3`}
    role="alert"
  >
    <div className="d-flex align-items-center">
      <AlertCircle className="me-2" />
      <strong>{title}</strong>
    </div>
    <p className="mb-0">{description}</p>
  </div>
);

const Dashboard = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stressLevel, setStressLevel] = useState(97);
  const [showTips, setShowTips] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 720,
    height: 480,
    facingMode: "user",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStressLevel((prev) =>
        Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 5))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const tips = [
    {
      id: 1,
      title: "Take deep breaths",
      description: "Breathe in for 4 counts, hold for 4, out for 4",
    },
    {
      id: 2,
      title: "Stretch for 5 minutes",
      description: "Focus on neck and shoulder stretches",
    },
    {
      id: 3,
      title: "Listen to calming music",
      description: "Nature sounds or instrumental music",
    },
    {
      id: 4,
      title: "Progressive relaxation",
      description: "Tense and relax each muscle group",
    },
  ];

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="row">
        {/* Left Panel */}
        <div className="col-md-4 p-4 bg-white shadow rounded border border-warning">
          <div className="position-relative">
            <div
              className={`w-100 rounded overflow-hidden border ${
                isRecording ? "border-danger" : "border-primary"
              }`}
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                className="w-100"
                mirrored={true}
              />
            </div>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className="btn btn-primary position-absolute top-0 end-0 m-2"
            >
              {isRecording ? <X size={20} /> : <Camera size={20} />}
            </button>
          </div>

          <div className="mt-4 position-relative pt-4">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${stressLevel}%`,
                  backgroundColor:
                    stressLevel > 80
                      ? "#dc3545"
                      : stressLevel > 60
                      ? "#ffc107"
                      : "#28a745",
                }}
              ></div>
            </div>
            <div className="position-absolute top-0 start-50 translate-middle-x fw-bold">
              Stress Level: {Math.round(stressLevel)}%
            </div>
          </div>

          {stressLevel > 80 && (
            <Alert
              title="High Stress Detected!"
              description="Try a relaxation technique."
              type="error"
            />
          )}
        </div>

        {/* Right Panel */}
        <div className="col-md-8 mt-4 mt-md-0 p-4 bg-white shadow rounded border border-warning">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-primary">Tips & Techniques</h2>
            <button
              onClick={() => setShowTips(!showTips)}
              className="btn btn-light"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="mt-4">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className={`card mb-2 p-3 ${
                  selectedTip === tip.id ? "bg-primary text-white" : "bg-light"
                }`}
                onClick={() =>
                  setSelectedTip(selectedTip === tip.id ? null : tip.id)
                }
                style={{ cursor: "pointer" }}
              >
                <h5 className="card-title">{tip.title}</h5>
                {selectedTip === tip.id && (
                  <p className="card-text">{tip.description}</p>
                )}
              </div>
            ))}
          </div>

          <button className="btn btn-warning w-100 mt-4">
            Access All Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
