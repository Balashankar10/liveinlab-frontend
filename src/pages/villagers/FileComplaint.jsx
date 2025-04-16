import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './FileComplaint.css';

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

      // Check if the audio element is available
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      } else {
        console.error('Audio element is not available');
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

const FileComplaint = () => {
  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    address: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error('இடத்தை பெற முடியவில்லை', err);
      }
    );
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
  
    if (!location.lat || !location.lng) {
      setErrorMsg("📍 இடம் தயார் ஆகவில்லை");
      return;
    }
  
    const data = new FormData();
    data.append('subject', formData.subject);
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('description', formData.description);
    data.append('image', image);
    data.append('lat', location.lat);
    data.append('lng', location.lng);
    data.append('userEmail', localStorage.getItem('email'));
  
    try {
      const res = await axios.post(`${API}/complaint/file`, data);
      if (res.data.message === 'Complaint filed successfully') {
        setSuccessMsg('✅ புகார் சமர்ப்பிக்கப்பட்டது!');
        setFormData({ subject: '', name: '', address: '', description: '' });
        setImage(null);
  
        // ✅ Speak in Tamil
        const speechText = "புகார் சமர்ப்பிக்கப்பட்டது";
        await fetch(`${API}/tts/speak`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: speechText }),
        })
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);

          // ⛔ Stop other ongoing audios
          const existingAudios = document.querySelectorAll("audio");
          existingAudios.forEach((a) => {
            a.pause();
            a.currentTime = 0;
          });

          // ✅ Play success message
          const audio = new Audio(url);
          audio.play();
        })
        .catch((err) => console.error("Speech error:", err));
  
      } else {
        setErrorMsg('❌ புகாரை சமர்ப்பிக்க முடியவில்லை');
      }
    } catch (err) {
      console.error('Axios error:', err.response || err.message);
      setErrorMsg('❌ புகார் சமர்ப்பிக்க பிழை');
    }
  };

  return (
    <div className="file-complaint-container">
      <h2>
        <SpeakOnTouch text="புகார் சமர்ப்பி">📝 புகார் சமர்ப்பி</SpeakOnTouch>
      </h2>

      <form className="file-complaint-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <SpeakOnTouch text="தலைப்பு">
          <input type="text" name="subject" placeholder="தலைப்பு" value={formData.subject} onChange={handleChange} required />
        </SpeakOnTouch>

        <SpeakOnTouch text="பெயர்">
          <input type="text" name="name" placeholder="பெயர்" value={formData.name} onChange={handleChange} required />
        </SpeakOnTouch>

        <SpeakOnTouch text="முகவரி">
          <input type="text" name="address" placeholder="முகவரி" value={formData.address} onChange={handleChange} required />
        </SpeakOnTouch>

        <SpeakOnTouch text="விவரம்">
          <textarea name="description" placeholder="விவரம்" value={formData.description} onChange={handleChange} required></textarea>
        </SpeakOnTouch>

        <label>
          <SpeakOnTouch text="படம் கேமரா அல்லது கோப்பாக பதிவேற்று">📷 படம் (கேமரா/கோப்பு):</SpeakOnTouch>
        </label>
        <input type="file" accept="image/*" capture="environment" onChange={(e) => setImage(e.target.files[0])} required />

        {location.lat && location.lng && (
          <button type="button" onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, '_blank')}>
            <SpeakOnTouch text="Google Maps இல் உங்கள் இடத்தை காண">📍 Google Maps இல் இடத்தை காண்க</SpeakOnTouch>
          </button>
        )}

        <button type="submit">
          <SpeakOnTouch text="புகார் சமர்ப்பி">புகார் சமர்ப்பி</SpeakOnTouch>
        </button>
      </form>

      {successMsg && <p className="status-message success">{successMsg}</p>}
      {errorMsg && <p className="status-message error">{errorMsg}</p>}
    </div>
  );
};

export default FileComplaint;
