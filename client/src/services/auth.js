const API_BASE = (() => {
  const fromEnv = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  // Default to same-origin. In dev, Vite proxies /api and /auth.
  return '';
})();

export async function signin({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to sign in');
  // Persist token and user for client-side auth
  localStorage.setItem('auth', JSON.stringify({ token: data.token, user: data.user }));
  return data;
}

export async function signup({ name, email, password }) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to sign up');
  return data;
}

export async function signout() {
  try {
    await fetch(`${API_BASE}/auth/signout`, { method: 'GET', credentials: 'include' });
  } finally {
    localStorage.removeItem('auth');
  }
}

export function getAuth() {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function authHeader() {
  const auth = getAuth();
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
}

export { API_BASE };
