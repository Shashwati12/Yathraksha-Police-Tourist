import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as api from '../services/api.js';

// Named exports only; no default export.
const StoreCtx = createContext(undefined);
const BUS = 'yatraksha_bus_v1';

export function StoreProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [firs, setFirs] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [policeNotices, setPoliceNotices] = useState([]);

  // Initial load
  useEffect(() => {
    let alive = true;
    (async () => {
      const [a, t, f, d] = await Promise.all([
        api.getAlerts(),
        api.getTourists(),
        api.getFirs(),
        api.getDispatchLogs()
      ]);
      if (!alive) return;
      setAlerts(a);
      setTourists(t);
      setFirs(f);
      setDispatches(d);
    })();
    return () => { alive = false; };
  }, []);

  // Stable callbacks
  const updateAlert = useCallback((id, patch) => {
    setAlerts(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...patch } : a);
      broadcast({ type: 'alerts:update', id, patch });
      return next;
    });
  }, []);

  const addFir = useCallback((fir) => {
    setFirs(prev => {
      const next = [fir, ...prev];
      broadcast({ type: 'firs:add', fir });
      return next;
    });
  }, []);

  const addDispatch = useCallback((d) => {
    setDispatches(prev => {
      const next = [d, ...prev];
      broadcast({ type: 'dispatch:add', dispatch: d });
      return next;
    });
  }, []);

  const notifyPolice = useCallback((notice) => {
    const item = { id: String(Date.now()), ...notice };
    setPoliceNotices(prev => [item, ...prev]);
    broadcast({ type: 'police:notice', notice: item });
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== BUS || !e.newValue) return;
      try {
        const evt = JSON.parse(e.newValue);
        if (evt.type === 'alerts:update') {
          setAlerts(prev => prev.map(a => a.id === evt.id ? { ...a, ...evt.patch } : a));
        } else if (evt.type === 'firs:add') {
          setFirs(prev => [evt.fir, ...prev]);
        } else if (evt.type === 'dispatch:add') {
          setDispatches(prev => [evt.dispatch, ...prev]);
        } else if (evt.type === 'police:notice') {
          setPoliceNotices(prev => [evt.notice, ...prev]);
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const value = useMemo(() => ({
    alerts,
    tourists,
    firs,
    dispatches,
    policeNotices,
    updateAlert,
    addFir,
    addDispatch,
    notifyPolice
  }), [alerts, tourists, firs, dispatches, policeNotices, updateAlert, addFir, addDispatch, notifyPolice]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// Internal helper only
function broadcast(payload) {
  try {
    localStorage.setItem(BUS, JSON.stringify({ ...payload, ts: Date.now() }));
    setTimeout(() => localStorage.removeItem(BUS), 0);
  } catch {}
}




