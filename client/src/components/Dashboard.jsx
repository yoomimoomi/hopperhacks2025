import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Camera,
  Menu,
  X,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const getStressColor = (level) => {
  if (level > 80) return "danger";
  if (level > 60) return "warning";
  return "success";
};

const StressAlert = ({ level }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div
      className="alert alert-danger d-flex align-items-center mt-4"
      role="alert"
    >
      <AlertCircle className="me-2" />
      <div>
        <strong className="d-block">High Stress Detected!</strong>
        <span>
          Your stress level is at {level}%. Try a relaxation technique.
        </span>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stressLevel, setStressLevel] = useState(97);
  const [showTips, setShowTips] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [musicTrack, setMusicTrack] = useState(null);
  const webcamRef = useRef(null);
  const audioRef = useRef(null);

  const tips = [
    {
      id: 1,
      title: "Deep Breathing",
      description: "Breathe in for 4 counts, hold for 4, out for 4",
      icon: "🫁",
    },
    {
      id: 2,
      title: "Quick Stretches",
      description: "Focus on neck and shoulder stretches",
      icon: "🧘‍♂️",
    },
    {
      id: 3,
      title: "Calming Music",
      description: "Nature sounds or instrumental music",
      icon: "🎵",
    },
    {
      id: 4,
      title: "Muscle Relaxation",
      description: "Tense and relax each muscle group",
      icon: "💪",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStressLevel((prev) =>
        Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 5))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMusicToggle = () => {
    if (musicTrack === "lofi") {
      audioRef.current.src = "/nature.mp3"; // Change to nature music
      audioRef.current.play(); // Play nature sounds
      setMusicTrack("nature"); // Set current music track to nature
    } else if (musicTrack === "nature") {
      audioRef.current.src = "/lofi.mp3"; // Change to lo-fi music
      audioRef.current.play(); // Play lo-fi music
      setMusicTrack("lofi"); // Set current music track to lo-fi
    } else {
      // Start with lo-fi music if no track is playing
      audioRef.current.src = "/lofi.mp3";
      audioRef.current.play();
      setMusicTrack("lofi");
    }
  };

  const stopMusic = () => {
    audioRef.current.pause(); // Pause the audio
    audioRef.current.currentTime = 0; // Reset to the beginning
    setMusicTrack(null); // Reset music track state
  };

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/524384758/photo/light-sky-and-clouds.jpg?s=612x612&w=0&k=20&c=IoDnbDptHMvmSoEMVPysmVUF-574Kh5BRdS2f0OxJPY=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="row g-4">
          {/* Left Panel */}
          <motion.div
            className="col-md-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card shadow-lg">
              <div className="card-body">
                {/* Camera Section */}
                <div
                  className="position-relative rounded overflow-hidden bg-light"
                  style={{ aspectRatio: "16/9" }}
                >
                  {isRecording && (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      mirrored
                      className="w-100 h-100 object-fit-cover"
                    />
                  )}
                  <motion.button
                    className={`btn btn-${
                      isRecording ? "danger" : "primary"
                    } position-absolute top-0 end-0 m-3 rounded-circle`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRecording(!isRecording)}
                    style={{ width: "40px", height: "40px", padding: "0" }}
                  >
                    {isRecording ? <X /> : <Camera />}
                  </motion.button>
                </div>

                {/* Stress Level Indicator */}
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <motion.span
                      className="fw-medium"
                      animate={{ x: stressLevel > 70 ? [0, 10, -10, 0] : 0 }}
                      transition={{
                        repeat: stressLevel > 70 ? Infinity : 0,
                        duration: 0.5,
                      }}
                    >
                      Stress Level
                    </motion.span>
                    <span className="fw-bold">{Math.round(stressLevel)}%</span>
                  </div>
                  <div className="progress" style={{ height: "10px" }}>
                    <div
                      className={`progress-bar bg-${getStressColor(
                        stressLevel
                      )}`}
                      role="progressbar"
                      style={{ width: `${stressLevel}%` }}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {stressLevel > 80 && (
                    <StressAlert level={Math.round(stressLevel)} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            className="col-md-7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card shadow-lg">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 mb-0">Wellness Tips</h2>
                  <motion.button
                    className="btn btn-light rounded-circle"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTips(!showTips)}
                  >
                    <Menu />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showTips && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      {tips.map((tip) => (
                        <motion.div
                          key={tip.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mb-3"
                        >
                          <div
                            className={`card cursor-pointer ${
                              selectedTip === tip.id ? "bg-light" : ""
                            }`}
                            onClick={() =>
                              setSelectedTip(
                                selectedTip === tip.id ? null : tip.id
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <div className="card-body py-3">
                              <div className="d-flex align-items-center gap-3">
                                <span className="fs-4">{tip.icon}</span>
                                <div>
                                  <h3 className="h6 mb-0">{tip.title}</h3>
                                  {selectedTip === tip.id && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="small text-muted mb-0 mt-1"
                                    >
                                      {tip.description}
                                    </motion.p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="d-grid gap-3">
                  <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMusicToggle}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      {musicTrack === null && <VolumeX />}
                      {musicTrack === "lofi" && <Volume1 />}
                      {musicTrack === "nature" && <Volume2 />}
                      <span>
                        {musicTrack === null && "Play Music"}
                        {musicTrack === "lofi" && "Playing Lo-fi"}
                        {musicTrack === "nature" && "Playing Nature Sounds"}
                      </span>
                    </div>
                  </motion.button>

                  <motion.button
                    className="btn btn-danger"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopMusic}
                  >
                    Stop Music
                  </motion.button>

                  <motion.button
                    className="btn btn-warning"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      window.open(
                        "https://www.cdc.gov/mental-health/living-with/index.html",
                        "_blank"
                      )
                    }
                  >
                    Access Resources
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <audio ref={audioRef} loop>
        {musicTrack === "lofi" && <source src="/lofi.mp3" type="audio/mp3" />}
        {musicTrack === "nature" && (
          <source src="/nature.mp3" type="audio/mp3" />
        )}
      </audio>
    </div>
  );
};

export default Dashboard;
