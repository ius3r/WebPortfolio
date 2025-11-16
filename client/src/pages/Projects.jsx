import { useState, useEffect, useRef } from 'react';
import './Projects.css';
import { API_BASE, authHeader } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import AdminModal from '../components/AdminModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ _id: null, title: '', summary: '', details: '', images: [] });
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load projects');
        if (!cancelled) setProjects(Array.isArray(data) ? data : []);
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
      const res = await fetch(`${API_BASE}/api/projects`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load projects');
      setProjects(Array.isArray(data) ? data : []);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ _id: null, title: '', summary: '', details: '', images: [] });
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setForm({ _id: p._id, title: p.title || '', summary: p.summary || '', details: p.details || '', images: p.images || [] });
    setModalOpen(true);
  };
  const submitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, images: form.images };
      const url = form._id ? `${API_BASE}/api/projects/${form._id}` : `${API_BASE}/api/projects`;
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
      addToast({ type: 'success', message: form._id ? 'Project updated.' : 'Project created.' });
      refresh();
    } catch (e) {
      addToast({ type: 'error', message: e.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (p) => {
    if (!confirm(`Delete project "${p.title}"?`)) return;
    const res = await fetch(`${API_BASE}/api/projects/${p._id}`, { method: 'DELETE', headers: { ...authHeader() }, credentials: 'include' });
    if (!res.ok) { const d = await res.json(); addToast({ type: 'error', message: d?.error || 'Delete failed' }); return; }
    addToast({ type: 'success', message: 'Project deleted.' });
    refresh();
  };

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [index, setIndex] = useState(0); // active image index

  const openModal = (p) => {
    setActive(p);
    setIndex(0); // start from first image
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setActive(null);
    setIndex(0);
  };

  // Keyboard: Esc, Left, Right
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, active, index]);

  const count = active?.images?.length ?? 0;
  const next = () => count && setIndex((i) => (i + 1) % count);
  const prev = () => count && setIndex((i) => (i - 1 + count) % count);

  // Touch swipe
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches?.[0]?.clientX ?? null; };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchStartX.current;
    const dx = endX - touchStartX.current;
    const threshold = 40; // px
    if (Math.abs(dx) > threshold) {
      if (dx < 0) next(); else prev();
    }
    touchStartX.current = null;
  };

  return (
    <section>
      <h1>Projects</h1>
      {user?.isAdmin && (
        <div className="card-actions" style={{ justifyContent: 'flex-end', marginBottom: '.5rem' }}>
          <button className="btn small" onClick={openAdd}>Add Project</button>
        </div>
      )}
      {loading && <p>Loading projects…</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      <div className="grid cards">
        {projects.map((p) => (
          <article className="card project-card" key={p.title}>
            {/* Thumbnail (first image) */}
            {p.images?.[0] && (
              <div
                className="project-card__thumb"
                role="button"
                tabIndex={0}
                aria-label={`Open ${p.title} details`}
                onClick={() => openModal(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(p); }
                }}
              >
                <img className="project-card__thumb-img" src={p.images[0]} alt={`${p.title} cover`} loading="lazy" />
              </div>
            )}

            <div className="project-card__body">
              <h3 style={{ margin: '0 0 .25rem' }}>{p.title}</h3>
              <p style={{ margin: 0 }}>{p.summary || p.description}</p>

              <div className="card-actions project-card__actions">
                <button className="btn outline small" onClick={() => openModal(p)}>Details</button>
                {user?.isAdmin && (
                  <>
                    <button className="btn outline small" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn small" onClick={() => deleteProject(p)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {open && active && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="project-title">{active.title}</h3>
              <button className="icon-btn" aria-label="Close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p>{active.details || active.description}</p>

              {active.images?.length > 0 && (
                <>
                  <div
                    className="project-modal__main"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                  >
                    <img
                      className="project-modal__img"
                      src={active.images[index]}
                      alt={`${active.title} screenshot ${index + 1}`}
                      loading="eager"
                    />
                    {active.images.length > 1 && (
                      <>
                        <button className="project-modal__nav-btn is-left" onClick={prev} aria-label="Previous">‹</button>
                        <button className="project-modal__nav-btn is-right" onClick={next} aria-label="Next">›</button>
                      </>
                    )}
                  </div>

                  {active.images.length > 1 && (
                    <div className="thumbs project-thumbs">
                      {active.images.map((src, i) => (
                        <button
                          key={src}
                          className={`project-thumb ${i === index ? 'is-active' : ''}`}
                          onClick={() => setIndex(i)}
                          aria-label={`Show image ${i + 1}`}
                          title={`Image ${i + 1}`}
                        >
                          <img className="project-thumb__img" src={src} alt={`${active.title} thumbnail ${i + 1}`} loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {user?.isAdmin && (
        <ProjectsAdminModal
          open={modalOpen}
          form={form}
          setForm={setForm}
          onClose={() => setModalOpen(false)}
          onSubmit={submitForm}
          saving={saving}
        />
      )}
    </section>
  );
}
// Modal rendering at bottom to avoid nesting issues
export function ProjectsAdminModal({ open, form, setForm, onClose, onSubmit, saving }) {
  if (!open) return null;
  return (
    <AdminModal title={form._id ? 'Edit Project' : 'Add Project'} onClose={onClose}>
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="prj-title">Title</label>
          <input id="prj-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="prj-summary">Summary</label>
          <textarea id="prj-summary" rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="prj-details">Details</label>
          <textarea id="prj-details" rows={5} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="prj-images">Image URLs (comma separated)</label>
          <input id="prj-images" value={(form.images || []).join(', ')} onChange={(e) => setForm({ ...form, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
        </div>
        <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </AdminModal>
  );
}