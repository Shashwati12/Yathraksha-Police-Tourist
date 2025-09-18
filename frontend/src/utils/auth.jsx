import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AUTH_KEY = 'yatraksha_auth_v1';
const SESSION_TTL_MIN = 240; // 4 hours mock session

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {role:'police'|'tourism', name, state?, rank?, iat, exp}

  // Restore session
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.exp && Date.now() < parsed.exp) {
        setUser(parsed);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const login = async (payload) => {
    const now = Date.now();
    const exp = now + SESSION_TTL_MIN * 60 * 1000;
    setUser({ ...payload, iat: now, exp });
  };

  const logout = () => setUser(null);

  // Auto-expire
  useEffect(() => {
    if (!user?.exp) return;
    const ms = Math.max(0, user.exp - Date.now());
    const t = setTimeout(() => setUser(null), ms);
    return () => clearTimeout(t);
  }, [user]);

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

export function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/login" replace />;
  return children;
}
