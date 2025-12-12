import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API_BASE, signin, signup, signout, getAuth, authHeader } from '../services/auth.js';

describe('services/auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults API_BASE to same-origin (empty string)', () => {
    expect(API_BASE).toBe('');
  });

  it('signin calls /auth/signin and persists auth', async () => {
    const fetchMock = vi.fn(async (url, options) => {
      expect(url).toBe('/auth/signin');
      expect(options).toMatchObject({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      return {
        ok: true,
        json: async () => ({ token: 't123', user: { _id: 'u1', name: 'Test' } }),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const data = await signin({ email: 'a@b.com', password: 'pw' });
    expect(data.token).toBe('t123');

    const stored = JSON.parse(localStorage.getItem('auth'));
    expect(stored).toMatchObject({ token: 't123', user: { _id: 'u1' } });
  });

  it('signin throws with server error message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      }))
    );

    await expect(signin({ email: 'a@b.com', password: 'bad' })).rejects.toThrow('Invalid credentials');
    expect(localStorage.getItem('auth')).toBeNull();
  });

  it('signup calls /api/users', async () => {
    const fetchMock = vi.fn(async (url, options) => {
      expect(url).toBe('/api/users');
      expect(options).toMatchObject({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return {
        ok: true,
        json: async () => ({ message: 'ok' }),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await signup({ name: 'N', email: 'e@e.com', password: 'p' });
    expect(res).toMatchObject({ message: 'ok' });
  });

  it('signout removes auth even if request fails', async () => {
    localStorage.setItem('auth', JSON.stringify({ token: 't', user: { _id: 'u' } }));

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network');
      })
    );

    await signout();
    expect(localStorage.getItem('auth')).toBeNull();
  });

  it('getAuth returns null for invalid JSON', () => {
    localStorage.setItem('auth', '{not-json');
    expect(getAuth()).toBeNull();
  });

  it('authHeader returns bearer token when authenticated', () => {
    localStorage.setItem('auth', JSON.stringify({ token: 'abc', user: { _id: 'u' } }));
    expect(authHeader()).toEqual({ Authorization: 'Bearer abc' });
  });
});
