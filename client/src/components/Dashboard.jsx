import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, Camera, Menu, X } from "lucide-react";
import Webcam from "react-webcam";
import "bootstrap/dist/css/bootstrap.min.css";

// Function to generate a random bright warm color
const getRandomWarmColor = () => {
  const colors = [
    "#FFAD60",
    "#FFB347",
    "#FF6F61",
    "#FF8C00",
    "#FF6347",
    "#FF4500",
    "#FFD700",
    "#FFDDC1",
    "#FFB6C1",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

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
  const [leftPanelColor, setLeftPanelColor] = useState("#fff");
  const [rightPanelColor, setRightPanelColor] = useState("#fff");
  const [musicTrack, setMusicTrack] = useState(null); // Track selected: "lofi", "nature", or null
  const audioRef = useRef(null);
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

  useEffect(() => {
    if (musicTrack) {
      audioRef.current.play(); // Play selected track
    } else {
      audioRef.current.pause(); // Pause if no track is selected
    }
  }, [musicTrack]);

  useEffect(() => {
    if (stressLevel > 70) {
      setLeftPanelColor("#FF0000"); // Red for stress > 70%
      setRightPanelColor("#FF0000");
    } else if (stressLevel < 25) {
      setLeftPanelColor("#90EE90"); // Light green for stress < 25%
      setRightPanelColor("#90EE90");
    }
  }, [stressLevel]);

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

  const handleMouseEnterLeftPanel = () => {
    if (stressLevel <= 70) {
      setLeftPanelColor(getRandomWarmColor()); // Change to random warm color
    }
  };

  const handleMouseEnterRightPanel = () => {
    if (stressLevel <= 70) {
      setRightPanelColor(getRandomWarmColor()); // Change to random warm color
    }
  };

  const handleMusicToggle = (e) => {
    if (e.button === 0) {
      // Left-click: Play lofi music
      setMusicTrack("lofi");
    } else if (e.button === 1) {
      // Right-click: Play nature music
      setMusicTrack("nature");
    }
  };

  const handleTipClick = (tipId) => {
    setSelectedTip(selectedTip === tipId ? null : tipId);
    if (tipId !== 3) {
      setMusicTrack(null); // Stop music when any other tip is selected
    }
  };

  const handleAccessResources = () => {
    window.location.href =
      "https://www.cdc.gov/mental-health/living-with/index.html"; // Replace with actual URL
  };

  return (
    <div
      className="container-fluid p-4 min-vh-100"
      style={{ backgroundColor: "skyblue" }}
    >
      <div className="row">
        {/* Left Panel */}
        <div
          className="col-md-4 p-4 bg-white shadow rounded border border-warning"
          style={{
            backgroundColor: leftPanelColor,
            transition: "background-color 0.5s ease",
          }}
          onMouseEnter={handleMouseEnterLeftPanel}
        >
          <div className="position-relative">
            <div
              className={`w-100 rounded overflow-hidden border ${
                isRecording ? "border-danger" : "border-primary"
              }`}
            >
              {isRecording && (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  videoConstraints={videoConstraints}
                  className="w-100"
                  mirrored={true}
                />
              )}
            </div>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`btn btn-${
                isRecording ? "danger" : "primary"
              } position-absolute top-0 end-0 m-2 ${
                isRecording
                  ? "animate__animated animate__pulse animate__infinite"
                  : ""
              }`}
              style={{ transition: "transform 0.2s" }}
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
        <div
          className="col-md-8 mt-4 mt-md-0 p-4 bg-white shadow rounded border border-warning"
          style={{
            backgroundColor: rightPanelColor,
            transition: "background-color 0.5s ease",
          }}
          onMouseEnter={handleMouseEnterRightPanel}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-primary">Tips & Techniques</h2>
            <button
              onClick={() => setShowTips(!showTips)}
              className="btn btn-light"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Menu Toggle */}
          {showTips && (
            <div className="mt-4">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  className={`card mb-2 p-3 ${
                    selectedTip === tip.id
                      ? "bg-primary text-white"
                      : "bg-light"
                  }`}
                  onClick={() => handleTipClick(tip.id)}
                  style={{ cursor: "pointer" }}
                >
                  <h5 className="card-title">{tip.title}</h5>
                  {selectedTip === tip.id && (
                    <p className="card-text">{tip.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-warning w-100 mt-4"
            onClick={handleAccessResources}
          >
            Access All Resources
          </button>
        </div>
      </div>

      {/* Audio player */}
      <audio ref={audioRef} loop>
        {musicTrack === "lofi" && <source src="/lofi.mp3" type="audio/mp3" />}
        {musicTrack === "nature" && (
          <source src="/nature.mp3" type="audio/mp3" />
        )}
      </audio>

      {/* Music control button */}
      <button
        onMouseDown={handleMusicToggle}
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
        className="btn btn-primary mt-3"
      >
        Toggle Music (Left-click for Lofi, Right-click for Nature)
      </button>
    </div>
  );
};

export default Dashboard;
