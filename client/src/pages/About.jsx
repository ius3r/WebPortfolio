import './About.css';

export default function About() {
  return (
    <section className="centered section-narrow">
      <img
        className="about-avatar"
        src="/photo.jpeg"
        alt="Islam Mubarak portrait"
      />
      <h1 style={{ marginTop: '0' }}>Islam Mubarak</h1>
      <p>
        I’m a self‑taught game developer and a web developer with 4 years of professional experience,
        holding a B.S. in Computer Science from Helwan University.
      </p>
      <div className="hero-cta" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
        <a className="btn" href="/Resume.pdf" target="_blank" rel="noopener noreferrer">Open Resume</a>
      </div>
      <h2>Skills</h2>
      <ul className="pill-list">
        <li>Game Development</li><li>C++</li><li>Unreal Engine</li><li>Unity3D</li><li>Godot</li>
      </ul>
      <ul className="pill-list">
        <li>Web Development</li><li>Task Automation</li><li>Web Scraping</li><li>Python</li><li>React</li><li>Node.js</li>
      </ul>
      <h2>Experience</h2>
      <p>Worked as a Web Developer for 4 years as a freelancer on Upwork.</p>
    </section>
  );
}