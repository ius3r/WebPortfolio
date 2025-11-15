import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signin as apiSignin, signup as apiSignup, signout as apiSignout } from '../services/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const existing = getAuth();
    if (existing) {
      setUser(existing.user);
      setToken(existing.token);
    }
    setLoading(false);
  }, []);

  const signin = async (values) => {
    const { token, user } = await apiSignin(values);
    setUser(user);
    setToken(token);
    const from = (location.state && location.state.from) || '/';
    navigate(from, { replace: true });
  };

  const signup = async (values) => {
    await apiSignup(values);
    // After successful signup, redirect to login
    navigate('/login');
  };

  const signout = async () => {
    await apiSignout();
    setUser(null);
    setToken(null);
    navigate('/');
  };

  const value = useMemo(() => ({ user, token, loading, signin, signup, signout }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
