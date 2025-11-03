import { useNavigate } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log('Contact form submission:', data);
    form.reset();
    navigate('/', { replace: true });
  };

  return (
    <section className="centered section-narrow">
      <h1>Contact Me</h1>

      {/* Contact info panel */}
      <aside className="card contact-panel">
        <h3 style={{ marginTop: 0 }}>Get in touch</h3>
        <p style={{ margin: '.25rem 0' }}>
          Email: <a className="text-link" href="mailto:dev.islam.tarek@gmail.com">dev.islam.tarek@gmail.com</a>
        </p>
        {/* <p style={{ margin: '.25rem 0' }}>
          Contact Number: <a href="tel:+10000000000">+1 (000) 000-0000</a>
        </p> */}
        <p style={{ margin: '.25rem 0' }}>Location: Toronto, Canada</p>
        <p style={{ margin: '.25rem 0' }}>
          Links: <a className="text-link" href="https://github.com/ius3r" target="_blank" rel="noreferrer">GitHub</a> ·{' '}
          <a className="text-link" href="https://www.linkedin.com/in/ius3r" target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
      </aside>

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
        <button className="btn" type="submit">Send</button>
      </form>
    </section>
  );
}
