import { useEffect, useState } from 'react';
import { API_BASE, authHeader } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import AdminModal from '../components/AdminModal.jsx';
import './About.css';

export default function About() {
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', headline: '', bio: '', avatarUrl: '', resumeUrl: '', skills: '' });
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/portfolioinfo`);
        if (!res.ok) return; // fall back to static
        const data = await res.json();
        setInfo(data);
      } catch {}
    })();
  }, []);

  const avatar = info?.avatarUrl || '/photo.jpeg';
  const name = info?.name || 'Islam Mubarak';
  const bio = info?.bio || 'I’m a self‑taught game developer and a web developer with 4 years of professional experience, holding a B.S. in Computer Science from Helwan University.';
  const resumeUrl = info?.resumeUrl || '/Resume.pdf';
  const skills = Array.isArray(info?.skills) && info.skills.length ? info.skills : [
    'Game Development','C++','Unreal Engine','Unity3D','Godot','Web Development','Task Automation','Web Scraping','Python','React','Node.js'
  ];

  return (
    <section className="centered section-narrow" style={{ position: 'relative' }}>
      {user?.isAdmin && (
        <div className="card-actions" style={{ justifyContent: 'flex-end', display: 'inline-flex', position: 'absolute', right: 0, top: 8 }}>
          <button className="btn small outline" onClick={() => {
            const base = info || {};
            setForm({
              name: base.name || '',
              headline: base.headline || '',
              bio: base.bio || '',
              avatarUrl: base.avatarUrl || '',
              resumeUrl: base.resumeUrl || '',
              skills: Array.isArray(base.skills) ? base.skills.join(', ') : ''
            });
            setModalOpen(true);
          }}>Edit About</button>
        </div>
      )}
      <img className="about-avatar" src={avatar} alt={`${name} portrait`} />
      <h1 style={{ marginTop: '0' }}>{name}</h1>
      {info?.headline && <p style={{ color: 'var(--muted)', marginTop: '-.5rem' }}>{info.headline}</p>}
      <p>{bio}</p>
      <div className="hero-cta" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
        <a className="btn" href={resumeUrl} target="_blank" rel="noopener noreferrer">Open Resume</a>
      </div>
      <h2>Skills</h2>
      <ul className="pill-list">
        {skills.map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      {user?.isAdmin && (
        <AboutAdminModal
          open={modalOpen}
          form={form}
          setForm={setForm}
          onClose={() => setModalOpen(false)}
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
              const payload = {
                name: form.name,
                headline: form.headline,
                bio: form.bio,
                avatarUrl: form.avatarUrl,
                resumeUrl: form.resumeUrl,
                skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
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
              setModalOpen(false);
            } catch (err) {
              alert(err.message || 'Update failed');
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
    </section>
  );
}

function AboutAdminModal({ open, form, setForm, onClose, onSubmit, saving }) {
  if (!open) return null;
  return (
    <AdminModal title="Edit About" onClose={onClose} size="wide">
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="about-name">Name</label>
          <input id="about-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="about-headline">Headline</label>
          <input id="about-headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="about-bio">Bio</label>
          <textarea id="about-bio" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="about-avatar">Avatar URL</label>
          <input id="about-avatar" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="about-resume">Resume URL</label>
          <input id="about-resume" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="about-skills">Skills (comma separated)</label>
          <input id="about-skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </div>
        <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </AdminModal>
  );
}