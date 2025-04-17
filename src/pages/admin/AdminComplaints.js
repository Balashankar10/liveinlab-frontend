import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminComplaints.css';

const API = process.env.REACT_APP_API_BASE;

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${API}/complaint/all`);
        setComplaints(res.data);
      } catch (err) {
        console.error('❌ புகார்களை பெறும் போது பிழை:', err);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API}/complaint/update-status/${id}`, { status: newStatus });
      const res = await axios.get(`${API}/complaint/all`);
      setComplaints(res.data);
    } catch (err) {
      alert('❌ நிலையை புதுப்பிக்க முடியவில்லை');
    }
  };

  return (
    <div className="admin-complaints-container">
      <h2>📋 அனைத்து புகார்கள்</h2>
      {complaints.length === 0 ? (
        <p>புகார்கள் எதுவும் இல்லை.</p>
      ) : (
        complaints.map((comp) => (
          <div key={comp._id} className="complaint-card">
            <p><strong>தலைப்பு:</strong> {comp.subject}</p>
            <p><strong>பெயர்:</strong> {comp.name}</p>
            <p><strong>முகவரி:</strong> {comp.address}</p>
            <p><strong>விவரம்:</strong> {comp.description}</p>
            <p>
              <strong>நிலை:</strong>{' '}
              <select
                value={comp.status}
                onChange={(e) => handleStatusChange(comp._id, e.target.value)}
              >
                <option value="Pending">நிலுவையில்</option>
                <option value="Working">பணியில்</option>
                <option value="Completed">முடிக்கப்பட்டது</option>
                <option value="Rejected">நிராகரிக்கப்பட்டது</option> {/* ✅ Added */}
              </select>
            </p>
            {comp.imageUrl && (
              <div>
                <img
                  src={comp.imageUrl}
                  alt="புகார் படம்"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '10px' }}
                />
              </div>
            )}
            {comp.location && comp.location.gmapUrl && (
              <p>
                <strong>இருப்பிடம்:</strong>{' '}
                <a href={comp.location.gmapUrl} target="_blank" rel="noreferrer">
                  வரைபடத்தில் பார்க்க
                </a>
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminComplaints;
