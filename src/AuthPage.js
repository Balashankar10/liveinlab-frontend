import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AuthPage.css'; // Import the CSS

const API = process.env.REACT_APP_API_BASE;

const AuthPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = `${process.env.REACT_APP_API_BASE}/${role}/${isRegister ? 'register' : 'login'}`;
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('email', email);
        navigate(`/${role}/dashboard`);
      } else {
        setError(data.message || 'அங்கீகாரம் தோல்வி');
      }
    } catch (err) {
      setError('சர்வர் பிழை');
    }
  };

  const speakText = async (text) => {
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
    <div className="auth-container">
      <h2>
        <span onTouchStart={() => speakText(isRegister ? 'புதிய கணக்கு உருவாக்குக' : 'உள்நுழைவு')}>
          {isRegister ? 'புதிய கணக்கு உருவாக்குக' : 'உள்நுழைவு'} as {role}
        </span>
      </h2>

      {error && (
        <p style={{ color: 'red' }}>
          <span onTouchStart={() => speakText(error)}>{error}</span>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <span onTouchStart={() => speakText('மின்னஞ்சல்')}>மின்னஞ்சல்</span>
          <input
            type="email"
            placeholder="மின்னஞ்சல்"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <span onTouchStart={() => speakText('கடவுச்சொல்')}>கடவுச்சொல்</span>
          <input
            type="password"
            placeholder="கடவுச்சொல்"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">
          <span onTouchStart={() => speakText(isRegister ? 'புதிய கணக்கு உருவாக்குக' : 'உள்நுழையவும்')}>
            {isRegister ? 'புதிய கணக்கு உருவாக்குக' : 'உள்நுழையவும்'}
          </span>
        </button>
      </form>

      <p>
        <span onTouchStart={() => speakText(isRegister ? 'முதலே கணக்கு உள்ளதா?' : 'கணக்கு இல்லை?')}>
          {isRegister ? 'முதலே கணக்கு உள்ளதா?' : 'கணக்கு இல்லை?'}
        </span>{' '}
        <button onClick={() => setIsRegister(!isRegister)}>
          <span onTouchStart={() => speakText(isRegister ? 'உள்நுழைவு' : 'புதிய கணக்கு உருவாக்குக')}>
            {isRegister ? 'உள்நுழைவு' : 'புதிய கணக்கு உருவாக்குக'}
          </span>
        </button>
      </p>

      <audio ref={audioRef} />
    </div>
  );
};

export default AuthPage;
