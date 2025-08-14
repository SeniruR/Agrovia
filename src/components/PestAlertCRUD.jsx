import React, { useState, useEffect } from 'react';
import PestAlertCreateForm from './PestAlertCreateForm';

function PestAlertList({ onEdit, onView }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/v1/pest-alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load pest alerts');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading pest alerts...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!alerts.length) return <div>No pest alerts found.</div>;

  // Severity badge helpers
  const severityBadge = sev => {
    if (sev === 'high') return <span style={{background:'#ffebee',color:'#d32f2f',padding:'6px 18px',borderRadius:16,fontWeight:700,fontSize:16,marginLeft:8}}>High Priority</span>;
    if (sev === 'medium') return <span style={{background:'#fffde7',color:'#fbc02d',padding:'6px 18px',borderRadius:16,fontWeight:700,fontSize:16,marginLeft:8}}>Medium Priority</span>;
    return <span style={{background:'#e8f5e9',color:'#388e3c',padding:'6px 18px',borderRadius:16,fontWeight:700,fontSize:16,marginLeft:8}}>Low Priority</span>;
  };
  const severityIcon = sev => {
    if (sev === 'high') return <span style={{background:'#f44336',color:'#fff',borderRadius:'50%',padding:12,marginRight:18,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:28,boxShadow:'0 2px 8px #f4433622'}}><span role="img" aria-label="alert">⚠️</span></span>;
    if (sev === 'medium') return <span style={{background:'#ffeb3b',color:'#fff',borderRadius:'50%',padding:12,marginRight:18,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:28,boxShadow:'0 2px 8px #ffeb3b22'}}><span role="img" aria-label="bug">🐞</span></span>;
    return <span style={{background:'#66bb6a',color:'#fff',borderRadius:'50%',padding:12,marginRight:18,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:28,boxShadow:'0 2px 8px #66bb6a22'}}><span role="img" aria-label="leaf">🌱</span></span>;
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <h2 style={{color:'#2e7d32',fontWeight:800,marginBottom:32,letterSpacing:'-1px'}}>Pest Alerts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {alerts.map(alert => (
          <li key={alert.id} style={{
            border: `2px solid ${alert.severity==='high'?'#ffcdd2':alert.severity==='medium'?'#fff9c4':'#c8e6c9'}`,
            borderRadius: 28,
            marginBottom: 36,
            padding: '32px 36px',
            background: '#fff',
            boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.08)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <div style={{display:'flex',alignItems:'center'}}>
                {severityIcon(alert.severity)}
                <span style={{fontWeight:800,fontSize:26,color:'#222'}}>{alert.title}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <span style={{color:'#607d8b',fontSize:16,display:'flex',alignItems:'center',gap:6}}>
                  <span role="img" aria-label="location">📍</span> {alert.location || 'N/A'}
                </span>
                <span style={{color:'#607d8b',fontSize:16,display:'flex',alignItems:'center',gap:6}}>
                  <span role="img" aria-label="calendar">📅</span> {alert.created_at ? new Date(alert.created_at).toLocaleDateString() : ''}
                </span>
                <span style={{fontSize:14}}>{severityBadge(alert.severity)}</span>
              </div>
            </div>
            <div style={{fontSize:18,color:'#37474f',marginBottom:12}}>{alert.description}</div>
            <div style={{display:'flex',gap:24,marginTop:8}}>
              <div style={{flex:1,background:'#f8fafc',borderRadius:18,padding:'18px 20px',minWidth:220}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                  <span style={{fontSize:22,background:'#e8f5e9',borderRadius:'50%',padding:6}}>🌱</span>
                  <span style={{fontWeight:700}}>Crop:</span> <span>{alert.crop || 'N/A'}</span>
                </div>
                <div style={{marginLeft:32}}>
                  <span style={{fontWeight:700}}>Symptoms:</span> <span>{alert.symptoms || 'N/A'}</span>
                </div>
              </div>
              <div style={{flex:2,background:'#f8fafc',borderRadius:18,padding:'18px 20px',minWidth:220}}>
                <div style={{fontWeight:700,marginBottom:8}}>Recommendations:</div>
                <ul style={{margin:0,paddingLeft:24}}>
                  {alert.recommendations ? alert.recommendations.split('\n').map((rec,i)=>(
                      <li key={i} style={{marginBottom:4,display:'flex',alignItems:'center',gap:8}}>
                        <span style={{background:'#c8e6c9',color:'#2e7d32',borderRadius:'50%',width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{i+1}</span>
                      <span>{rec}</span>
                    </li>
                  )): <li>No recommendations</li>}
                </ul>
                <div style={{marginTop:12,display:'flex',gap:12,flexWrap:'wrap'}}>
                  {alert.estimated_loss && <span style={{background:'#fffde7',color:'#fbc02d',padding:'6px 14px',borderRadius:12,fontWeight:600,fontSize:15}}>Estimated Loss: {alert.estimated_loss}</span>}
                  {alert.affected_area && <span style={{background:'#e8f5e9',color:'#388e3c',padding:'6px 14px',borderRadius:12,fontWeight:600,fontSize:15}}>Affected Area: {alert.affected_area}</span>}
                </div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:18,gap:8}}>
              <button onClick={() => onView(alert)} style={{
                background:'#1976d2',color:'#fff',fontWeight:700,padding:'10px 28px',border:'none',borderRadius:12,fontSize:16,boxShadow:'0 2px 8px #1976d222',cursor:'pointer',transition:'all 0.2s'
              }}>View Details</button>
              <button onClick={() => onEdit(alert)} style={{
                background:'#43a047',color:'#fff',fontWeight:700,padding:'10px 28px',border:'none',borderRadius:12,fontSize:16,boxShadow:'0 2px 8px #43a04722',cursor:'pointer',transition:'all 0.2s',marginLeft:8
              }}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PestAlertEditForm({ alert, onCancel, onUpdated }) {
  const [form, setForm] = useState({ ...alert });
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
      const res = await fetch(`/api/v1/pest-alerts/${alert.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update pest alert');
      setSuccess('Pest alert updated!');
      if (onUpdated) onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this pest alert?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/pest-alerts/${alert.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete pest alert');
      if (onUpdated) onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Edit Pest Alert</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required style={{ width: '100%', marginBottom: 8 }} />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required style={{ width: '100%', marginBottom: 8 }} />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" style={{ width: '100%', marginBottom: 8 }} />
      <select name="severity" value={form.severity} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input name="reported_by" value={form.reported_by} onChange={handleChange} placeholder="Reporter User ID" required style={{ width: '100%', marginBottom: 8 }} />
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
      <button type="button" onClick={handleDelete} disabled={loading} style={{ width: '100%', marginTop: 8, background: '#e53935', color: '#fff' }}>
        Delete
      </button>
      <button type="button" onClick={onCancel} disabled={loading} style={{ width: '100%', marginTop: 8 }}>
        Cancel
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </form>
  );
}

export default function PestAlertCRUD() {
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [viewing, setViewing] = useState(null);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Floating Create Button */}
      {!editing && !showCreate && !viewing && (
        <button
          onClick={() => setShowCreate(true)}
          style={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            zIndex: 100,
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 4px 24px 0 rgba(56, 249, 215, 0.18)',
            width: 72,
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: 'none',
          }}
          title="Create Pest Alert"
        >
          <span style={{ fontSize: 36, lineHeight: 1 }}>＋</span>
        </button>
      )}

      {/* View Details Modal */}
      {viewing && !editing && !showCreate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ position: 'relative', zIndex: 301, background: '#fff', borderRadius: 24, padding: 40, minWidth: 400, maxWidth: 600, boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.18)' }}>
            <h2 style={{color:'#2e7d32',fontWeight:800,marginBottom:16,letterSpacing:'-1px'}}>Pest Alert Details</h2>
            <div style={{marginBottom:16}}><b>Title:</b> {viewing.title}</div>
            <div style={{marginBottom:16}}><b>Description:</b> {viewing.description}</div>
            <div style={{marginBottom:16}}><b>Location:</b> {viewing.location || 'N/A'}</div>
            <div style={{marginBottom:16}}><b>Severity:</b> {viewing.severity}</div>
            <div style={{marginBottom:16}}><b>Crop:</b> {viewing.crop || 'N/A'}</div>
            <div style={{marginBottom:16}}><b>Symptoms:</b> {viewing.symptoms || 'N/A'}</div>
            <div style={{marginBottom:16}}><b>Recommendations:</b><br/>{viewing.recommendations ? viewing.recommendations.split('\n').map((rec,i)=>(<div key={i}>- {rec}</div>)) : 'N/A'}</div>
            <div style={{marginBottom:16}}><b>Estimated Loss:</b> {viewing.estimated_loss || 'N/A'}</div>
            <div style={{marginBottom:16}}><b>Affected Area:</b> {viewing.affected_area || 'N/A'}</div>
            <div style={{marginBottom:16}}><b>Reported By (User ID):</b> {viewing.reported_by}</div>
            <div style={{marginBottom:16}}><b>Created At:</b> {viewing.created_at ? new Date(viewing.created_at).toLocaleString() : 'N/A'}</div>
            <button
              onClick={() => setViewing(null)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'rgba(255,255,255,0.7)',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                fontSize: 22,
                cursor: 'pointer',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* List and Edit Form */}
      {!editing && !viewing && <PestAlertList key={refresh} onEdit={setEditing} onView={setViewing} />}
      {editing && <PestAlertEditForm alert={editing} onCancel={() => setEditing(null)} onUpdated={() => { setEditing(null); setRefresh(r => r + 1); }} />}
      {/* Create Form Modal */}
      {showCreate && !editing && !viewing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ position: 'relative', zIndex: 301, background: '#fff', borderRadius: 24, padding: 40, minWidth: 400, maxWidth: 600, boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.18)' }}>
            <PestAlertCreateForm onCancel={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); setRefresh(r => r + 1); }} />
            <button
              onClick={() => setShowCreate(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'rgba(255,255,255,0.7)',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                fontSize: 22,
                cursor: 'pointer',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
