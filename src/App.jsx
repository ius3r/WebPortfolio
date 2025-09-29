import { Routes, Route, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css'
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';

function App() {
  useEffect(() => {
    const href = '/logo.png';

    // Set icon for tab
    let icon = document.querySelector('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.type = 'image/png';
    icon.href = href;
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <NavLink className="brand" to="/" end aria-label="Home">
            <img src="/logo.png" alt="Home" className="brand-logo" />
          </NavLink>
          <NavBar />
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">
          <small>© 2025 Portfolio</small>
        </div>
      </footer>
    </>
  )
}

export default App
