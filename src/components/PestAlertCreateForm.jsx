import React, { useState } from 'react';

export default function PestAlertCreateForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'low',
    reported_by: ''
  });
  const [loading, setLoading] = useState(false);

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
      // Replace with your API endpoint
      const response = await fetch('/api/pest-alerts', {
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
        if (onSuccess) onSuccess();
      } else {
        alert('Failed to create pest alert.');
      }
    } catch (err) {
      alert('Error creating pest alert.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 50%, #c8e6c9 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        height: '80vh',
        margin: '40px auto 0',
        borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px 0 rgba(76, 175, 80, 0.15), 0 8px 32px 0 rgba(0,0,0,0.05)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        overflowY: 'auto',
        padding: 40,
        position: 'relative',
        zIndex: 2,
      }}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 32,
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}>
              🌱
            </div>
            <h2 style={{
              margin: 0,
              color: '#2e7d32',
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: '-0.5px',
            }}>Create Pest Alert</h2>
            <p style={{
              margin: '8px 0 0',
              color: '#558b2f',
              fontSize: 16,
              opacity: 0.8,
            }}>Help protect our agricultural community</p>
          </div>

          <label style={{
            fontWeight: 600,
            color: '#2e7d32',
            marginBottom: 8,
            display: 'block',
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Alert Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title for the pest alert"
            required
            style={inputStyle}
          />

          <label style={{
            fontWeight: 600,
            color: '#2e7d32',
            marginBottom: 8,
            display: 'block',
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Provide detailed information about the pest issue"
            required
            rows={4}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: 100,
            }}
          />

          <label style={{
            fontWeight: 600,
            color: '#2e7d32',
            marginBottom: 8,
            display: 'block',
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Specify the location where pest was observed"
            style={inputStyle}
          />

          <label style={{
            fontWeight: 600,
            color: '#2e7d32',
            marginBottom: 8,
            display: 'block',
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Severity Level</label>
          <select
            name="severity"
            value={form.severity}
            onChange={handleChange}
            style={{
              ...inputStyle,
              background: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: 17,
              color: form.severity === 'high' ? '#d32f2f' : form.severity === 'medium' ? '#fbc02d' : '#388e3c',
            }}
          >
            <option value="low">🟢 Low - Minor concern</option>
            <option value="medium">🟡 Medium - Moderate threat</option>
            <option value="high">🔴 High - Immediate action needed</option>
          </select>

          <label style={{
            fontWeight: 600,
            color: '#2e7d32',
            marginBottom: 8,
            display: 'block',
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Reporter ID</label>
          <input
            name="reported_by"
            value={form.reported_by}
            onChange={handleChange}
            placeholder="Your user identification"
            required
            style={{
              ...inputStyle,
              marginBottom: 32,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px 0',
              background: loading ? '#a5d6a7' : '#5ec16e',
              color: '#fff',
              fontWeight: 800,
              fontSize: 22,
              border: 'none',
              borderRadius: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.18)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: 10,
              marginBottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              position: 'sticky',
              bottom: 0,
              zIndex: 3,
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{
                  width: 20,
                  height: 20,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                Creating Alert...
              </span>
            ) : (
              <>
                <span role="img" aria-label="party popper" style={{ fontSize: 26 }}>🎉</span>
                SUBMIT PEST ALERT
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}