// src/pages/admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminComplaints.css'; // Reusing the same CSS file

const AdminDashboard = () => {
  const navigate = useNavigate();

  const goToComplaints = () => {
    navigate('/admin/complaints');
  };

  return (
    <div className="admin-dashboard">
      <h2> நிர்வாகக் கட்டுப்பாட்டு பலகை</h2>
      <p>நீங்கள் புகார்களை நிர்வகிக்கலாம்</p>
      <button onClick={goToComplaints}>
        📋 புகார்களை காண்க
      </button>
    </div>
  );
};

export default AdminDashboard;
