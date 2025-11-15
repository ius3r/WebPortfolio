import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { user, signout } = useAuth();

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <>
      <button
        id="navToggle"
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
      <nav className={`site-nav ${open ? 'open' : ''}`} aria-label="Primary">
        <ul onClick={close}>
          <li><NavLink to="/" className={linkClass} end>Home</NavLink></li>
          <li><NavLink to="/about" className={linkClass}>About Me</NavLink></li>
          <li><NavLink to="/projects" className={linkClass}>Projects</NavLink></li>
          <li><NavLink to="/services" className={linkClass}>Services</NavLink></li>
          <li><NavLink to="/contact" className={linkClass}>Contact Me</NavLink></li>
        </ul>
      </nav>
      <div className="auth-actions">
        {!user ? (
          <>
            <NavLink to="/login" className="btn small outline">Sign In</NavLink>
            <NavLink to="/signup" className="btn small">Sign Up</NavLink>
          </>
        ) : (
          <>
            <span className="auth-name">{user.name}</span>
            <button className="btn small outline" onClick={signout}>Sign Out</button>
          </>
        )}
      </div>
    </>
  );
}
