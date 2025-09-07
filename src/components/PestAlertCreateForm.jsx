import React, { useState, useEffect } from 'react';

export default function PestAlertCreateForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'low',
    reported_by: ''
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users for the Reporter ID dropdown
    fetch('/api/v1/users/all')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) setUsers(data.data);
      })
      .catch(() => setUsers([]));
  }, []);

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e8f5e8',
    borderRadius: 12,
    fontSize: 17,
    marginBottom: 18,
    background: '#f9fff8',
    color: '#2e7d32',
    outline: 'none',
    transition: 'all 0.2s',
    fontWeight: 500,
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px 0 rgba(76, 175, 80, 0.04)',
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/v1/pest-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setForm({
          title: '',
          description: '',
          location: '',
          severity: 'low',
          reported_by: ''
        });
  if (onCreated) onCreated();
      } else {
        const errorText = await response.text();
  alert('Failed to create pest alert.\n' + errorText);
      }
    } catch (err) {
  alert('Error creating pest alert.\n' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#e8f5e8 0%,#f9fff8 100%)',
      padding: '48px 0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        minHeight: 520,
        margin: '48px auto 0',
        borderRadius: 32,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 16px 48px 0 rgba(76,175,80,0.18), 0 8px 32px 0 rgba(0,0,0,0.07)',
        border: '1px solid #e8f5e8',
        overflowY: 'auto',
        padding: 48,
        position: 'relative',
        zIndex: 2,
      }}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 36,
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#43e97b,#38f9d7)',
              margin: '0 auto 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              boxShadow: '0 2px 12px #43e97b44',
            }}>
              �
            </div>
            <h2 style={{
              margin: 0,
              color: '#2e7d32',
              fontWeight: 900,
              fontSize: 32,
              letterSpacing: '-1px',
              background:'linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
            }}>Create Pest Alert</h2>
            <p style={{
              margin: '10px 0 0',
              color: '#558b2f',
              fontSize: 17,
              opacity: 0.8,
            }}>Help protect our agricultural community</p>
          </div>

          {/* ...existing code for form fields, but you can copy the improved label/input styles from above... */}
          <label style={{ fontWeight: 700, color: '#2e7d32', marginBottom: 10, display: 'block', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alert Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Enter a descriptive title for the pest alert" required style={inputStyle} />

          <label style={{ fontWeight: 700, color: '#2e7d32', marginBottom: 10, display: 'block', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Provide detailed information about the pest issue" required rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }} />

          <label style={{ fontWeight: 700, color: '#2e7d32', marginBottom: 10, display: 'block', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Crop</label>
          <input name="crop" value={form.crop || ''} onChange={handleChange} placeholder="Crop (e.g. Rice, Wheat)" style={inputStyle} />

          <label style={{ fontWeight: 700, color: '#2e7d32', marginBottom: 10, display: 'block', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Symptoms</label>
          <input name="symptoms" value={form.symptoms || ''} onChange={handleChange} placeholder="Symptoms (e.g. Leaf spots, Wilting)" style={inputStyle} />

          <label style={{ fontWeight: 700, color: '#2e7d32', marginBottom: 10, display: 'block', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Specify the location where pest was observed" style={inputStyle} />

          <label style={{ fontWeight: 700, color: '#2e7d32', marginBottom: 10, display: 'block', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Severity Level</label>
          <select name="severity" value={form.severity} onChange={handleChange} style={{ ...inputStyle, background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 17, color: form.severity === 'high' ? '#d32f2f' : form.severity === 'medium' ? '#fbc02d' : '#388e3c' }}>
            <option value="low">🟢 Low - Minor concern</option>
            <option value="medium">🟡 Medium - Moderate threat</option>
            <option value="high">🔴 High - Immediate action needed</option>
          </select>

          <label style={{ fontWeight: 700, color: '#2e7d32', marginBottom: 10, display: 'block', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reporter ID</label>
          <select name="reported_by" value={form.reported_by} onChange={handleChange} required style={{ ...inputStyle, marginBottom: 36, background: '#fff', cursor: 'pointer' }}>
            <option value="">Select a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.full_name} (ID: {user.id})</option>
            ))}
          </select>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '20px 0', background: loading ? '#a5d6a7' : 'linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)', color: '#fff', fontWeight: 900, fontSize: 24, border: 'none', borderRadius: 18, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 32px 0 rgba(76,175,80,0.18)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 14, marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, position: 'sticky', bottom: 0, zIndex: 3 }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 22, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Creating Alert...
              </span>
            ) : (
              <>
                <span role="img" aria-label="party popper" style={{ fontSize: 28 }}>🎉</span>
                SUBMIT PEST ALERT
              </>
            )}
          </button>
          <button type="button" onClick={onCancel} disabled={loading} style={{ width: '100%', padding: '14px 0', background: '#bdbdbd', color: '#fff', fontWeight: 800, fontSize: 20, border: 'none', borderRadius: 18, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: 16, marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}