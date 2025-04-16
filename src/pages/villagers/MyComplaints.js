import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MyComplaints.css';

const API = process.env.REACT_APP_API_BASE;

// 🔊 Reusable Speech Component (Updated for Touch Only)
const SpeakOnTouch = ({ text, children }) => {
  const audioRef = useRef(null);

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
      audioRef.current.src = url;
      audioRef.current.play();
    } catch (err) {
      console.error("Speech Error:", err);
    }
  };

  return (
    <span onTouchStart={speakText}>
      {children}
      <audio ref={audioRef} />
    </span>
  );
};

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyComplaints = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        setError('பயனர் மின்னஞ்சல் இல்லை');
        return;
      }

      try {
        const res = await axios.get(`${API}/complaint/my-complaints?email=${email}`);
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
        setError('புகார்கள் பெறுவதில் பிழை');
      }
    };

    fetchMyComplaints();
  }, []);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'complaint-status pending';
      case 'completed':
        return 'complaint-status completed';
      case 'rejected':
        return 'complaint-status rejected';
      default:
        return 'complaint-status';
    }
  };

  const getTamilStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'நிலுவை';
      case 'completed':
        return 'முடிக்கப்பட்டது';
      case 'rejected':
        return 'நிராகரிக்கப்பட்டது';
      default:
        return status;
    }
  };

  const getStatusSpeech = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'நிலை நிலுவை';
      case 'completed':
        return 'நிலை முடிக்கப்பட்டது';
      case 'rejected':
        return 'நிலை நிராகரிக்கப்பட்டது';
      default:
        return status;
    }
  };

  return (
    <div className="container">
      <h2><SpeakOnTouch text="என் புகார்கள்">என் புகார்கள்</SpeakOnTouch></h2>

      <div className="status-labels">
        <SpeakOnTouch text="பச்சை என்பது நிர்வாகி புகாரை முடித்துவிட்டதாக பொருள்">
          <span className="status-label completed">முடிக்கப்பட்டது</span>
        </SpeakOnTouch>
        <SpeakOnTouch text="மஞ்சள் என்பது புகார் நிலுவையில் உள்ளது என்பதைக் குறிக்கும்">
          <span className="status-label pending">நிலுவை</span>
        </SpeakOnTouch>
        <SpeakOnTouch text="சிவப்பு என்பது நிர்வாகி புகாரை நிராகரித்துவிட்டதாக பொருள்">
          <span className="status-label rejected">நிராகரிக்கப்பட்டது</span>
        </SpeakOnTouch>
      </div>

      {error && (
        <p className="error-message">
          <SpeakOnTouch text={error}>{error}</SpeakOnTouch>
        </p>
      )}

      {complaints.length === 0 ? (
        <p><SpeakOnTouch text="புகார்கள் எதுவும் இல்லை.">புகார்கள் எதுவும் இல்லை.</SpeakOnTouch></p>
      ) : (
        complaints.map((c) => (
          <div key={c._id} className="complaint-card">
            <p>
              <strong><SpeakOnTouch text="தலைப்பு">தலைப்பு:</SpeakOnTouch></strong>{' '}
              <SpeakOnTouch text={c.subject}>{c.subject}</SpeakOnTouch>
            </p>
            <p>
              <strong><SpeakOnTouch text="முகவரி">முகவரி:</SpeakOnTouch></strong>{' '}
              <SpeakOnTouch text={c.address}>{c.address}</SpeakOnTouch>
            </p>
            <p>
              <strong><SpeakOnTouch text="விவரம்">விவரம்:</SpeakOnTouch></strong>{' '}
              <SpeakOnTouch text={c.description}>{c.description}</SpeakOnTouch>
            </p>
            <p>
              <strong><SpeakOnTouch text="நிலை">நிலை:</SpeakOnTouch></strong>{' '}
              <SpeakOnTouch text={getStatusSpeech(c.status)}>
                <span className={getStatusClass(c.status)}>
                  {getTamilStatus(c.status)}
                </span>
              </SpeakOnTouch>
            </p>
            {c.imageUrl && (
              <img
                src={c.imageUrl}  // Cloudinary URL is used directly
                alt="புகார்"
              />
            )}
            <p>
              <strong><SpeakOnTouch text="இடம்">இடம்:</SpeakOnTouch></strong>{' '}
              <a href={c.location?.gmapUrl} target="_blank" rel="noopener noreferrer">
                <SpeakOnTouch text="வரைபடத்தில் காண்க">வரைபடத்தில் காண்க</SpeakOnTouch>
              </a>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyComplaints;
