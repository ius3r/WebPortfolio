import { useState, useEffect, useRef } from 'react';
import './Projects.css';

export default function Projects() {
  const projects = [
    {
      title: 'Imitation Game',
      summary: 'A multiplayer social deduction game, was developed using Godot engine, and NodeJS for the server side.',
      details:
        'This project tackles problem X with a focus on performance and accessibility. Built using React, Vite, and CSS Modules. Key features include responsive layouts, client-side routing, and a11y-first components.',
      images: [
        '/projects/imitation1.png',
        '/projects/imitation2.png',
        '/projects/imitation3.png',
        '/projects/imitation4.png',
        '/projects/imitation5.png',
        '/projects/imitation6.png',
        '/projects/imitation7.png',
        '/projects/imitation8.png',
      ],
    },
    {
      title: 'Starvival',
      summary: 'A multiplayer survival game that takes place on alien worlds developed using Unity3D, networking was done using Mirror API.',
      details:
        'Implemented complex state management and data fetching with caching. Optimized bundle size and implemented code-splitting. Addressed real-time updates and optimistic UI for better UX.',
      images: [
        '/projects/starvival1.jpg',
        '/projects/starvival2.jpg',
        '/projects/starvival3.jpg',
        '/projects/starvival4.jpg',
        '/projects/starvival5.jpg',
        '/projects/starvival6.png',
        '/projects/starvival7.png'
      ],
    },
    {
      title: 'Custom Netcode',
      summary: 'An attempt at creating a custom netcode with MMO capabilities in Unreal Engine.',
      details:
        'An attempt at creating a custom netcode with MMO capabilities in Unreal Engine using ENET.',
      images: [
        '/projects/netcode1.png'
      ],
    },
  ];

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
              <p style={{ margin: 0 }}>{p.summary}</p>

              <div className="card-actions project-card__actions">
                <button className="btn outline small" onClick={() => openModal(p)}>Details</button>
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
              <p>{active.details}</p>

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
    </section>
  );
}