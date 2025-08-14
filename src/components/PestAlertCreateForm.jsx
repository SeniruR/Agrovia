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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Pest alert created successfully!');
      setForm({ title: '', description: '', location: '', severity: 'low', reported_by: '' });
      if (onSuccess) onSuccess({ id: Date.now(), ...form });
    } catch (err) {
      setError(err.message || 'Failed to create pest alert');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    marginBottom: 20,
    padding: '14px 16px',
    borderRadius: 12,
    border: '2px solid #e8f5e8',
    fontSize: 16,
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    color: '#2d5016',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 50%, #c8e6c9 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: 40,
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px 0 rgba(76, 175, 80, 0.15), 0 8px 32px 0 rgba(0,0,0,0.05)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
      >
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
          onFocus={e => {
            e.target.style.border = '2px solid #4caf50';
            e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onBlur={e => {
            e.target.style.border = '2px solid #e8f5e8';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'translateY(0)';
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
          onFocus={e => {
            e.target.style.border = '2px solid #4caf50';
            e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onBlur={e => {
            e.target.style.border = '2px solid #e8f5e8';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'translateY(0)';
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
          onFocus={e => {
            e.target.style.border = '2px solid #4caf50';
            e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onBlur={e => {
            e.target.style.border = '2px solid #e8f5e8';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'translateY(0)';
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
        }}>Severity Level</label>
        <select
          name="severity"
          value={form.severity}
          onChange={handleChange}
          style={{
            ...inputStyle,
            background: '#ffffff',
            cursor: 'pointer',
          }}
          onFocus={e => {
            e.target.style.border = '2px solid #4caf50';
            e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onBlur={e => {
            e.target.style.border = '2px solid #e8f5e8';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <option value="low" style={{color: '#2d5016'}}>🟢 Low - Minor concern</option>
          <option value="medium" style={{color: '#2d5016'}}>🟡 Medium - Moderate threat</option>
          <option value="high" style={{color: '#2d5016'}}>🔴 High - Immediate action needed</option>
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
          onFocus={e => {
            e.target.style.border = '2px solid #4caf50';
            e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onBlur={e => {
            e.target.style.border = '2px solid #e8f5e8';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'translateY(0)';
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 0',
            background: loading ? 
              'linear-gradient(135deg, #a5d6a7, #c8e6c9)' : 
              'linear-gradient(135deg, #4caf50, #66bb6a)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 18,
            border: 'none',
            borderRadius: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 6px 20px 0 rgba(76, 175, 80, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          onMouseOver={e => { 
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px 0 rgba(76, 175, 80, 0.4)';
            }
          }}
          onMouseOut={e => { 
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 20px 0 rgba(76, 175, 80, 0.3)';
            }
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
            '🚨 Submit Pest Alert'
          )}
        </button>

        {error && (
          <div style={{ 
            color: '#d32f2f', 
            marginTop: 20, 
            padding: 12,
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: 8,
            textAlign: 'center', 
            fontWeight: 500,
          }}>
            ⚠️ {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            color: '#2e7d32', 
            marginTop: 20, 
            padding: 12,
            backgroundColor: '#e8f5e8',
            border: '1px solid #c8e6c9',
            borderRadius: 8,
            textAlign: 'center', 
            fontWeight: 500,
          }}>
            ✅ {success}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}