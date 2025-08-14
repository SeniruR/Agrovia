import React, { useState, useEffect } from 'react';

function PestAlertCreateForm({ onSuccess }) {
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
      const res = await fetch('/api/v1/pest-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create pest alert');
      setSuccess('Pest alert created!');
      setForm({ title: '', description: '', location: '', severity: 'low', reported_by: '' });
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Create Pest Alert</h2>
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
        {loading ? 'Creating...' : 'Create Pest Alert'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </form>
  );
}

function PestAlertList({ onEdit }) {
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

  return (
    <div style={{ maxWidth: 600, margin: '24px auto' }}>
      <h2>Pest Alerts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {alerts.map(alert => (
          <li key={alert.id} style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 12, padding: 12 }}>
            <strong>{alert.title}</strong> <span style={{ color: '#888' }}>({alert.severity})</span>
            <div>{alert.description}</div>
            <div style={{ fontSize: 12, color: '#666' }}>Location: {alert.location || 'N/A'}</div>
            <div style={{ fontSize: 12, color: '#666' }}>Reported by: {alert.reported_by}</div>
            <button onClick={() => onEdit(alert)} style={{ marginTop: 8 }}>Edit</button>
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

  return (
    <div>
      {!editing && <PestAlertCreateForm onSuccess={() => setRefresh(r => r + 1)} />}
      {!editing && <PestAlertList key={refresh} onEdit={setEditing} />}
      {editing && <PestAlertEditForm alert={editing} onCancel={() => setEditing(null)} onUpdated={() => { setEditing(null); setRefresh(r => r + 1); }} />}
    </div>
  );
}
