import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await signup(form);
      setMessage('Account created! Please sign in.');
    } catch (err) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-narrow centered">
      <h2>Sign Up</h2>
      <form className="form" onSubmit={onSubmit}>
        {error && <div className="card" style={{ borderColor: '#b33' }}>{error}</div>}
        {message && <div className="card" style={{ borderColor: '#2a6' }}>{message}</div>}
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={onChange} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={onChange} />
        </div>
        <div className="card-actions">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
        </div>
      </form>
    </section>
  );
}
