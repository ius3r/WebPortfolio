import { useEffect, useState } from 'react';
import { API_BASE, authHeader } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import AdminModal from '../components/AdminModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

const icons = {
  gamepad: (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 8h12a4 4 0 0 1 3.87 5.02l-1 3.5A3.5 3.5 0 0 1 17.5 20a3.5 3.5 0 0 1-3.35-2.4l-.26-.8h-4.8l-.26.8A3.5 3.5 0 0 1 5.5 20a3.5 3.5 0 0 1-3.37-3.48l-1-3.5A4 4 0 0 1 6 8Zm2.25 2.75h-1.5v1.5h-1.5v1.5h1.5v1.5h1.5v-1.5h1.5v-1.5h-1.5v-1.5Zm8.5 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-2.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>),
  code: (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.4 16.6 5.8 13l3.6-3.6 1.4 1.4L8.6 13l2.2 2.2-1.4 1.4Zm5.2 0-1.4-1.4L15.4 13l-2.2-2.2 1.4-1.4L18.2 13l-3.6 3.6Z"/></svg>),
  robot: (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 2h2v2h3a2 2 0 0 1 2 2v2h2v2h-2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8H4V8h2V6a2 2 0 0 1 2-2h3V2Zm5 6V6H8v2h8Zm-8 3v7h10v-7H8Zm2 2h2v2h-2v-2Zm4 0h2v2h-2v-2Z"/></svg>),
  compass: (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm4.2 6.2-2.7 6.8-6.8 2.7 2.7-6.8 6.8-2.7Zm-7.32 7.32 3.26-1.3 1.3-3.26-3.26 1.3-1.3 3.26Z"/></svg>)
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ _id: null, title: '', description: '', checklist: [], icon: 'compass', color: 'blue' });
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/services`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load services');
        if (!cancelled) setServices(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Admin CRUD helpers (minimal UI)
  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load services');
      setServices(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ _id: null, title: '', description: '', checklist: [], icon: 'compass', color: 'blue' });
    setModalOpen(true);
  };
  const openEdit = (s) => {
    setForm({ _id: s._id, title: s.title || '', description: s.description || '', checklist: s.checklist || [], icon: s.icon || 'compass', color: s.color || 'blue' });
    setModalOpen(true);
  };
  const submitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, checklist: form.checklist };
      const url = form._id ? `${API_BASE}/api/services/${form._id}` : `${API_BASE}/api/services`;
      const method = form._id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || (form._id ? 'Update failed' : 'Create failed'));
      setModalOpen(false);
      addToast({ type: 'success', message: form._id ? 'Service updated.' : 'Service created.' });
      refresh();
    } catch (e) {
      addToast({ type: 'error', message: e.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (s) => {
    if (!confirm(`Delete service "${s.title}"?`)) return;
    const res = await fetch(`${API_BASE}/api/services/${s._id}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
      credentials: 'include',
    });
    if (!res.ok) { const d = await res.json(); addToast({ type: 'error', message: d?.error || 'Delete failed' }); return; }
    addToast({ type: 'success', message: 'Service deleted.' });
    refresh();
  };

  return (
    <section>
      <h1>Services</h1>
      {user?.isAdmin && (
        <div className="card-actions" style={{ justifyContent: 'flex-end', marginBottom: '.5rem' }}>
          <button className="btn small" onClick={openAdd}>Add Service</button>
        </div>
      )}
      {loading && <p>Loading services…</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      <div className="grid cards">
        {services.map(s => (
          <article className="card" key={s._id || s.title}>
            <div className="service-header">
              <span className={`service-icon ${s.color || 'blue'}`}>{icons[s.icon] || icons['compass']}</span>
              <h3>{s.title}</h3>
            </div>
            <p>{s.description}</p>
            {Array.isArray(s.checklist) && s.checklist.length > 0 && (
              <ul className="checklist">
                {s.checklist.map(item => <li key={item}>{item}</li>)}
              </ul>
            )}
            {user?.isAdmin && (
              <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
                <button className="btn small outline" onClick={() => openEdit(s)}>Edit</button>
                <button className="btn small" onClick={() => deleteService(s)}>Delete</button>
              </div>
            )}
          </article>
        ))}
      </div>

      {user?.isAdmin && modalOpen && (
        <AdminModal title={form._id ? 'Edit Service' : 'Add Service'} onClose={() => setModalOpen(false)}>
          <form className="form" onSubmit={submitForm}>
            <div className="field">
              <label htmlFor="svc-title">Title</label>
              <input id="svc-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="svc-desc">Description</label>
              <textarea id="svc-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="svc-checklist">Checklist (comma separated)</label>
              <input id="svc-checklist" value={(form.checklist || []).join(', ')} onChange={(e) => setForm({ ...form, checklist: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
            </div>
            <div className="field">
              <label htmlFor="svc-icon">Icon</label>
              <select id="svc-icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                <option value="gamepad">gamepad</option>
                <option value="code">code</option>
                <option value="robot">robot</option>
                <option value="compass">compass</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="svc-color">Color</label>
              <select id="svc-color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
                <option value="amber">amber</option>
                <option value="blue">blue</option>
                <option value="green">green</option>
              </select>
            </div>
            <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </AdminModal>
      )}
    </section>
  );
}
