import { useEffect, useState } from 'react';
import { API_BASE, authHeader } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import AdminModal from '../components/AdminModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Qualifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ _id: null, title: '', firstname: '', lastname: '', email: '', completion: '', description: '' });
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/qualifications`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load qualifications');
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/qualifications`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load qualifications');
      setItems(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ _id: null, title: '', firstname: '', lastname: '', email: '', completion: '', description: '' });
    setModalOpen(true);
  };
  const openEdit = (q) => {
    setForm({ _id: q._id, title: q.title || '', firstname: q.firstname || '', lastname: q.lastname || '', email: q.email || '', completion: q.completion ? q.completion.slice(0, 10) : '', description: q.description || '' });
    setModalOpen(true);
  };
  const submitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      const url = form._id ? `${API_BASE}/api/qualifications/${form._id}` : `${API_BASE}/api/qualifications`;
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
      addToast({ type: 'success', message: form._id ? 'Qualification updated.' : 'Qualification created.' });
      refresh();
    } catch (e) {
      addToast({ type: 'error', message: e.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (q) => {
    if (!confirm(`Delete qualification "${q.title}"?`)) return;
    const res = await fetch(`${API_BASE}/api/qualifications/${q._id}`, { method: 'DELETE', headers: { ...authHeader() }, credentials: 'include' });
    if (!res.ok) { const d = await res.json(); addToast({ type: 'error', message: d?.error || 'Delete failed' }); return; }
    addToast({ type: 'success', message: 'Qualification deleted.' });
    refresh();
  };

  return (
    <section>
      <h1>Qualifications</h1>
      {user?.isAdmin && (
        <div className="card-actions" style={{ justifyContent: 'flex-end', marginBottom: '.5rem' }}>
          <button className="btn small" onClick={openAdd}>Add Qualification</button>
        </div>
      )}
      {loading && <p>Loading qualifications…</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      <div className="grid cards">
        {items.map(q => (
          <article className="card" key={q._id || q.title}>
            <div className="service-header">
              <span className="service-icon amber">🎓</span>
              <h3>{q.title}</h3>
            </div>
            <p>{q.description}</p>
            <ul className="checklist">
              {q.firstname && q.lastname && <li>{q.firstname} {q.lastname}</li>}
              {q.email && <li>{q.email}</li>}
              {q.completion && <li>Completed: {new Date(q.completion).toLocaleDateString()}</li>}
            </ul>
            {user?.isAdmin && (
              <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
                <button className="btn small outline" onClick={() => openEdit(q)}>Edit</button>
                <button className="btn small" onClick={() => deleteItem(q)}>Delete</button>
              </div>
            )}
          </article>
        ))}
      </div>

      {user?.isAdmin && modalOpen && (
        <AdminModal title={form._id ? 'Edit Qualification' : 'Add Qualification'} onClose={() => setModalOpen(false)}>
          <form className="form" onSubmit={submitForm}>
            <div className="field">
              <label htmlFor="q-title">Title</label>
              <input id="q-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="q-first">First name</label>
              <input id="q-first" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="q-last">Last name</label>
              <input id="q-last" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="q-email">Email</label>
              <input id="q-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="q-date">Completion</label>
              <input id="q-date" type="date" value={form.completion} onChange={(e) => setForm({ ...form, completion: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="q-desc">Description</label>
              <textarea id="q-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
