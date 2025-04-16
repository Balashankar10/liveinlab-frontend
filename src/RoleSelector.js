import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelector.css';

const API = process.env.REACT_APP_API_BASE;

// Reuse SpeakOnTouch Component
const SpeakOnTouch = ({ text }) => {
  const audioRef = React.useRef(null);

  const speakText = async () => {
    try {
      // If audio is already playing, don't try to pause it and play again.
      if (audioRef.current && !audioRef.current.paused) {
        // If audio is playing, do nothing.
        return;
      }

      const res = await fetch(`${API}/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to get audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current.src = url;

      // Ensure the play() is called within a valid user interaction
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Speech error:", error);
    }
  };

  return (
    <span onTouchStart={speakText}>
      {text}
      <audio ref={audioRef} />
    </span>
  );
};

const RoleSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/auth/${role}`);
  };

  return (
    <div className="role-selector-container">
      <h2>
        <SpeakOnTouch text="உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்" />
      </h2>
      <button onClick={() => handleSelect('villager')}>
        <SpeakOnTouch text="கிராமவாசி" />
      </button>
      <button onClick={() => handleSelect('admin')}>
        <SpeakOnTouch text="நிர்வாகி" />
      </button>
    </div>
  );
};

export default RoleSelector;
