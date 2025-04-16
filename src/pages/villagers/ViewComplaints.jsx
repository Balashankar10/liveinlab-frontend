import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './ViewComplaints.css';

const API = process.env.REACT_APP_API_BASE;

const SpeakOnTouch = ({ text, children, excludeFromSpeech = false }) => {
  const audioRef = useRef(null);

  const speakText = async () => {
    if (excludeFromSpeech) return;

    try {
      const res = await fetch(`${API}/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to get audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current.src = url;
      audioRef.current.play();
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

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const hasSpokenRef = useRef(false); // Prevent double speaking

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${API}/complaint/all`);
        setComplaints(res.data);

        if (!hasSpokenRef.current) {
          if (res.data.length === 0) {
            speakTextOnce('புகார்கள் எதுவும் இல்லை');
          } else {
            speakTextOnce(`மொத்தம் ${res.data.length} புகார்கள் கிடைத்துள்ளன`);
          }
          hasSpokenRef.current = true;
        }
      } catch (err) {
        console.error('புகார்களை பெறுவதில் பிழை:', err);
        setError('புகார்களை பெற முடியவில்லை');

        if (!hasSpokenRef.current) {
          speakTextOnce('புகார்களை பெற முடியவில்லை');
          hasSpokenRef.current = true;
        }
      }
    };

    fetchComplaints();
  }, []);

  const speakTextOnce = async (text) => {
    try {
      const res = await fetch(`${API}/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to get audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Speech error:", error);
    }
  };

  const getStatusBadgeClass = (status) => {
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'status-badge pending';
    if (lower === 'completed') return 'status-badge completed';
    if (lower === 'rejected') return 'status-badge rejected';
    return 'status-badge';
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'நிலுவையில் உள்ளது';
      case 'completed':
        return 'நிறைவு பெற்றது';
      case 'rejected':
        return 'தள்ளுபடி செய்யப்பட்டது';
      default:
        return status;
    }
  };

  return (
    <div className="container">
      <h2>
        <SpeakOnTouch text="அனைத்து புகார்களும்" excludeFromSpeech={true}>
          அனைத்து புகார்களும்
        </SpeakOnTouch>
      </h2>

      <div className="status-container">
        <div className="status-label completed">
          <SpeakOnTouch text="பச்சை: முடிக்கப்பட்டது">
            பச்சை: முடிக்கப்பட்டது
          </SpeakOnTouch>
        </div>
        <div className="status-label pending">
          <SpeakOnTouch text="மஞ்சள்: நிலுவையில் உள்ளது">
            மஞ்சள்: நிலுவையில் உள்ளது
          </SpeakOnTouch>
        </div>
        <div className="status-label rejected">
          <SpeakOnTouch text="சிவப்பு: நிராகரிக்கப்பட்டது">
            சிவப்பு: நிராகரிக்கப்பட்டது
          </SpeakOnTouch>
        </div>
      </div>

      {error && (
        <p className="error-message">
          <SpeakOnTouch text={error}>{error}</SpeakOnTouch>
        </p>
      )}

      {complaints.length === 0 ? (
        <p>
          <SpeakOnTouch text="புகார்கள் எதுவும் இல்லை" excludeFromSpeech={true}>
            புகார்கள் எதுவும் இல்லை.
          </SpeakOnTouch>
        </p>
      ) : (
        complaints.map((c) => (
          <div key={c._id} className="complaint-card">
            <p>
              <strong>
                <SpeakOnTouch text="தலைப்பு:" excludeFromSpeech={true}>தலைப்பு:</SpeakOnTouch>
              </strong>{' '}
              <SpeakOnTouch text={c.subject}>{c.subject}</SpeakOnTouch>
            </p>
            <p>
              <strong>
                <SpeakOnTouch text="பெயர்:" excludeFromSpeech={true}>பெயர்:</SpeakOnTouch>
              </strong>{' '}
              <SpeakOnTouch text={c.name}>{c.name}</SpeakOnTouch>
            </p>
            <p>
              <strong>
                <SpeakOnTouch text="முகவரி:" excludeFromSpeech={true}>முகவரி:</SpeakOnTouch>
              </strong>{' '}
              <SpeakOnTouch text={c.address}>{c.address}</SpeakOnTouch>
            </p>
            <p>
              <strong>
                <SpeakOnTouch text="விவரம்:" excludeFromSpeech={true}>விவரம்:</SpeakOnTouch>
              </strong>{' '}
              <SpeakOnTouch text={c.description}>{c.description}</SpeakOnTouch>
            </p>
            <p>
              <strong>
                <SpeakOnTouch text="நிலை:" excludeFromSpeech={true}>நிலை:</SpeakOnTouch>
              </strong>{' '}
              <SpeakOnTouch text={getStatusText(c.status)}>
                <span className={getStatusBadgeClass(c.status)}>
                  {getStatusText(c.status)}
                </span>
              </SpeakOnTouch>
            </p>

            {c.imageUrl && (
              <img
                src={c.imageUrl}  // Use the imageUrl directly
                alt="புகார்"
              />
            )}

            <p>
              <strong>
                <SpeakOnTouch text="இடம்:" excludeFromSpeech={true}>இடம்:</SpeakOnTouch>
              </strong>{' '}
              <a href={c.location?.gmapUrl} target="_blank" rel="noopener noreferrer">
                <SpeakOnTouch text="வரைபடத்தில் காண்க" excludeFromSpeech={true}>
                  வரைபடத்தில் காண்க
                </SpeakOnTouch>
              </a>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewComplaints;
