import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero centered section-narrow">
      <h1>Welcome</h1>
      <p>I build games and web experiences that are fast, fun, and polished.</p>
      <div className="hero-cta">
        <Link className="btn" to="/projects">View Projects</Link>
        <Link className="btn outline" to="/contact">Contact Me</Link>
      </div>
    </section>
  );
}
