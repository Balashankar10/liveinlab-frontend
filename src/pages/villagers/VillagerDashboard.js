import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VillagerDashboard.css';

const API = process.env.REACT_APP_API_BASE;

// SpeakOnTouch Component
const SpeakOnTouch = ({ text, children }) => {
  const audioRef = React.useRef(null);

  const speakText = async () => {
    try {
      const res = await fetch(`${API}/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to get audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Check if audioRef is valid
      if (audioRef.current) {
        // Stop the current audio if it's playing
        if (!audioRef.current.paused) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Speech error:", error);
    }
  };

  return (
    <span onTouchStart={speakText}>
      {children}
      <audio ref={audioRef} />
    </span>
  );
};

const VillagerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const speakWelcomeMessage = async () => {
      const res = await fetch(`${API}/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: 'வணக்கம்! கிராமவாசி டாஷ்போர்டுக்கு வரவேற்கின்றோம். தயவுசெய்து ஒரு  தேர்ந்தெடுக்கவும்.',
        }),
      });
      if (!res.ok) {
        console.error("Failed to speak welcome message");
      }
    };

    speakWelcomeMessage();
  }, []);

  const handleClick = (text, path) => {
    navigate(path);
    const speakText = async () => {
      const res = await fetch(`${API}/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        console.error("Failed to speak on click");
      }
    };
    speakText();
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        <SpeakOnTouch text="புகார் கொடுக்கும் இடம்">
          புகார் கொடுக்கும் இடம்
        </SpeakOnTouch>
      </h2>

      <div className="dashboard-buttons">
        <button
          onClick={() => handleClick('புகார் கொடு என்பதனை தேர்ந்தெடுத்தீர்கள்', '/villager/file-complaint')}
        >
          <SpeakOnTouch text="புகார் கொடு">புகார் கொடு</SpeakOnTouch>
        </button>

        <button
          onClick={() => handleClick('புகார்கள் பார் என்பதனை தேர்ந்தெடுத்தீர்கள்', '/villager/view-complaints')}
        >
          <SpeakOnTouch text="புகார்கள் பார்">புகார்கள் பார்</SpeakOnTouch>
        </button>

        <button
          onClick={() => handleClick('என் புகார்கள் என்பதனை தேர்ந்தெடுத்தீர்கள்', '/villager/my-complaints')}
        >
          <SpeakOnTouch text="என் புகார்கள்">என் புகார்கள்</SpeakOnTouch>
        </button>
      </div>
    </div>
  );
};

export default VillagerDashboard;
