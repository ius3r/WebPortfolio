import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE, authHeader } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import AdminModal from '../components/AdminModal.jsx';
import './Contact.css';

export default function Contact() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [entryError, setEntryError] = useState('');
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [entrySaving, setEntrySaving] = useState(false);
  const [entryForm, setEntryForm] = useState({ _id: null, firstname: '', lastname: '', email: '', contactNumber: '', message: '' });
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoForm, setInfoForm] = useState({ email: '', phone: '', location: '', github: '', linkedin: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/portfolioinfo`);
        if (res.status === 404) { setInfo(null); return; }
        const data = await res.json();
        setInfo(data);
      } catch (e) {
        // Non-blocking: keep hardcoded fallback if fetch fails
        setInfo(null);
      }
    })();
  }, []);

  // Admin: load contact entries
  useEffect(() => {
    if (!user?.isAdmin) return;
    let cancelled = false;
    (async () => {
      setLoadingEntries(true);
      try {
        const res = await fetch(`${API_BASE}/api/contacts`, { headers: { ...authHeader() }, credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load contacts');
        if (!cancelled) setEntries(data);
      } catch (e) {
        if (!cancelled) setEntryError(e.message || 'Failed to load contacts');
      } finally {
        if (!cancelled) setLoadingEntries(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.isAdmin]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const data = {
      firstname: raw.firstName,
      lastname: raw.lastName,
      email: raw.email,
      contactNumber: raw.contactNumber,
      message: raw.message,
    };
    try {
      const res = await fetch(`${API_BASE}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out?.error || 'Failed to send');
      form.reset();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to send');
    } finally {
      setSubmitting(false);
    }
  };

  // Admin CRUD handlers
  const openEditInfo = () => {
    const base = info || {};
    setInfoForm({
      email: base.email || '',
      phone: base.phone || '',
      location: base.location || '',
      github: base.github || '',
      linkedin: base.linkedin || '',
    });
    setInfoModalOpen(true);
  };

  const submitInfoForm = async (e) => {
    e.preventDefault();
    setInfoSaving(true);
    try {
      const payload = {
        email: infoForm.email,
        phone: infoForm.phone,
        location: infoForm.location,
        github: infoForm.github,
        linkedin: infoForm.linkedin,
      };
      const res = await fetch(`${API_BASE}/api/portfolioinfo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update failed');
      setInfo(data);
      setInfoModalOpen(false);
    } catch (e) {
      alert(e.message || 'Update failed');
    } finally {
      setInfoSaving(false);
    }
  };

  const refreshEntries = async () => {
    if (!user?.isAdmin) return;
    setLoadingEntries(true);
    try {
      const res = await fetch(`${API_BASE}/api/contacts`, { headers: { ...authHeader() }, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load contacts');
      setEntries(data);
      setEntryError('');
    } catch (e) {
      setEntryError(e.message || 'Failed to load contacts');
    } finally {
      setLoadingEntries(false);
    }
  };

  const openEditEntry = (entry) => {
    setEntryForm({ _id: entry._id, firstname: entry.firstname || '', lastname: entry.lastname || '', email: entry.email || '', contactNumber: entry.contactNumber || '', message: entry.message || '' });
    setEntryModalOpen(true);
  };
  const submitEntryForm = async (e) => {
    e.preventDefault();
    setEntrySaving(true);
    try {
      const url = `${API_BASE}/api/contacts/${entryForm._id}`;
      const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, credentials: 'include', body: JSON.stringify(entryForm) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Update failed');
      setEntryModalOpen(false);
      refreshEntries();
    } catch (e) {
      alert(e.message || 'Update failed');
    } finally {
      setEntrySaving(false);
    }
  };
  const deleteEntry = async (entry) => {
    if (!confirm(`Delete contact entry from ${entry.firstname} ${entry.lastname}?`)) return;
    const res = await fetch(`${API_BASE}/api/contacts/${entry._id}`, { method: 'DELETE', headers: { ...authHeader() }, credentials: 'include' });
    if (!res.ok) { const d = await res.json().catch(() => ({})); alert(d?.error || 'Delete failed'); return; }
    refreshEntries();
  };
  const clearAllEntries = async () => {
    if (!confirm('Delete ALL contact entries? This cannot be undone.')) return;
    const res = await fetch(`${API_BASE}/api/contacts`, { method: 'DELETE', headers: { ...authHeader() }, credentials: 'include' });
    if (!res.ok) { const d = await res.json().catch(() => ({})); alert(d?.error || 'Delete all failed'); return; }
    refreshEntries();
  };

  return (
    <section className="centered section-narrow">
      <h1>Contact Me</h1>

      {/* Contact info panel */}
      <aside className="card contact-panel">
      {user?.isAdmin && (
        <div className="card-actions" style={{ justifyContent: 'flex-end', marginTop: '.25rem', display: 'inline-flex', float: 'right' }}>
          <button className="btn small outline" onClick={openEditInfo}>Edit Contact Info</button>
        </div>
      )}
        <h3 style={{ marginTop: 0 }}>Get in touch</h3>
        {info?.email && (
          <p style={{ margin: '.25rem 0' }}>
            Email: <a className="text-link" href={`mailto:${info.email}`}>{info.email}</a>
          </p>
        )}
        {info?.phone && (
          <p style={{ margin: '.25rem 0' }}>
            Contact Number: <a className="text-link" href={`tel:${(info.phone || '').replaceAll(' ', '')}`}>{info.phone}</a>
          </p>
        )}
        {info?.location && (
          <p style={{ margin: '.25rem 0' }}>Location: {info.location}</p>
        )}
        {(info?.github || info?.linkedin) && (
          <p style={{ margin: '.25rem 0' }}>
            Links: {info?.github && (
              <a className="text-link" href={info.github} target="_blank" rel="noreferrer">GitHub</a>
            )}
            {info?.github && info?.linkedin ? ' · ' : ''}
            {info?.linkedin && (
              <a className="text-link" href={info.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            )}
          </p>
        )}
      </aside>

      {user?.isAdmin && (
        <InfoAdminModal
          open={infoModalOpen}
          form={infoForm}
          setForm={setInfoForm}
          onClose={() => setInfoModalOpen(false)}
          onSubmit={submitInfoForm}
          saving={infoSaving}
        />
      )}

      {/* Short interactive form */}
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" autoComplete="given-name" required />
        </div>
        <div className="field">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" autoComplete="family-name" required />
        </div>
        <div className="field">
          <label htmlFor="contactNumber">Contact Number</label>
          <input id="contactNumber" name="contactNumber" type="tel" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required />
        </div>
        {error && <p style={{ color: '#ff8080', margin: '.5rem 0' }}>{error}</p>}
        <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send'}</button>
      </form>

      {user?.isAdmin && (
        <section style={{ marginTop: '2rem' }}>
          <h2>Contact Entries</h2>
          <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
            <button className="btn small outline" onClick={refreshEntries} disabled={loadingEntries}>Refresh</button>
            <button className="btn small" onClick={clearAllEntries} disabled={loadingEntries}>Delete All</button>
          </div>
          {entryError && <p style={{ color: '#ff6b6b' }}>{entryError}</p>}
          {loadingEntries ? <p>Loading contact entries…</p> : (
            <div className="grid cards">
              {entries.map(en => (
                <article className="card" key={en._id}>
                  <h3 style={{ marginTop: 0 }}>{en.firstname} {en.lastname}</h3>
                  <p style={{ margin: '.25rem 0' }}>
                    <a className="text-link" href={`mailto:${en.email}`}>{en.email}</a>
                    {en.contactNumber ? <> · {en.contactNumber}</> : null}
                  </p>
                  {en.message && <p style={{ whiteSpace: 'pre-wrap' }}>{en.message}</p>}
                  <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn small outline" onClick={() => openEditEntry(en)}>Edit</button>
                    <button className="btn small" onClick={() => deleteEntry(en)}>Delete</button>
                  </div>
                </article>
              ))}
              {entries.length === 0 && <p style={{ color: 'var(--muted)' }}>No contact entries yet.</p>}
            </div>
          )}

          <EntryAdminModal
            open={entryModalOpen}
            form={entryForm}
            setForm={setEntryForm}
            onClose={() => setEntryModalOpen(false)}
            onSubmit={submitEntryForm}
            saving={entrySaving}
          />
        </section>
      )}
    </section>
  );
}

function EntryAdminModal({ open, form, setForm, onClose, onSubmit, saving }) {
  if (!open) return null;
  return (
    <AdminModal title={`Edit Contact Entry: ${form.firstname} ${form.lastname}`} onClose={onClose} size="narrow">
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="entry-firstname">First Name</label>
          <input id="entry-firstname" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="entry-lastname">Last Name</label>
          <input id="entry-lastname" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="entry-email">Email</label>
          <input id="entry-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="entry-number">Contact Number</label>
          <input id="entry-number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="entry-message">Message</label>
          <textarea id="entry-message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </AdminModal>
  );
}

function InfoAdminModal({ open, form, setForm, onClose, onSubmit, saving }) {
  if (!open) return null;
  return (
    <AdminModal title="Edit Contact Info" onClose={onClose} size="narrow">
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="info-email">Email</label>
          <input id="info-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="info-phone">Phone</label>
          <input id="info-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="info-location">Location</label>
          <input id="info-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="info-github">GitHub URL</label>
          <input id="info-github" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="info-linkedin">LinkedIn URL</label>
          <input id="info-linkedin" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        </div>
        <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </AdminModal>
  );
}
