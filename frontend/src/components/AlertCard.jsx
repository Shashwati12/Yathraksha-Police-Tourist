import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth.jsx';
import { useStore } from '../utils/store.jsx';
import * as api from '../services/api.js';
import { recordAudit } from '../utils/audit.js';

function ToastHost({ toasts, onClose }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-6 right-6 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className="bg-white border rounded-xl shadow-soft px-4 py-3 text-sm flex items-start gap-3 min-w-[280px]">
          <div className="text-teal">{t.icon}</div>
          <div className="flex-1">{t.msg}</div>
          <button
            className="text-gray-400 hover:text-gray-600 text-xs leading-none"
            onClick={()=>onClose(t.id)}
            aria-label="Close"
          >✕</button>
        </div>
      ))}
    </div>
  );
}

export default function AlertCard({ alert, tourist }) {
  const { user } = useAuth();
  const { addDispatch, updateAlert, notifyPolice } = useStore();
  const n = useNavigate();
  const isPolice = user?.role === 'police';
  const [toasts, setToasts] = useState([]);

  const pushToast = (msg, icon='ℹ️') => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 6000);
  };
  const closeToast = (id) => setToasts(prev => prev.filter(x => x.id !== id));

  const contact = () => {
    const num = (tourist?.phone || '').replace(/\s+/g,'');
    const dummy = num || '+91-00000-00000';
    pushToast(`Contact initiated to ${dummy} (Tourist ${alert.touristId}).`);
  };

  const dispatchAmb = async () => {
    const d = await api.dispatchAmbulance({
      alertId: alert.id, unit: 'AMB-01', state: alert.state, district: alert.district, etaMins: 10
    });
    addDispatch(d);
    recordAudit({ type:'ambulance-dispatch', by:user?.role || 'unknown', alertId:alert.id });
    pushToast(`108 dispatch requested for Alert ${alert.id}.`);
  };

  const informPolice = () => {
    notifyPolice({ type:'inform', alertId:alert.id, message:`Tourism informed Police for ${alert.id}` });
    pushToast(`PCR notified for Alert ${alert.id}.`);
  };

  const fileEfir = () => {
    if (!isPolice) return pushToast('Only Police can file e‑FIR.');
    n('/efir/' + alert.id);
  };

  const changeStatus = (val) => {
    updateAlert(alert.id, { status: val });
    pushToast(`Alert ${alert.id} → ${val}.`);
  };

  return (
    <div className="rounded-2xl p-4 bg-white shadow-soft border border-skyblue/40">
      <ToastHost toasts={toasts} onClose={closeToast} />

      <div className="flex items-center justify-between">
        <div className="font-semibold">{alert.type} • {alert.severity.toUpperCase()} • {alert.state}</div>
        <span className={`badge text-white ${alert.severity==='high'?'bg-rojo':'bg-orange'}`}>{alert.status}</span>
      </div>

      <div className="text-sm text-slate mt-1">{alert.reason}</div>
      <div className="text-sm mt-2">
        {isPolice ? `Tourist: ${tourist?.name || 'N/A'} (${tourist?.state || '—'})` : `Tourist ID: ${alert.touristId}`}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <label className="text-xs text-slate">Status</label>
        <select className="px-2 py-1 rounded border text-sm" value={alert.status} onChange={(e)=>changeStatus(e.target.value)}>
          <option value="active">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
        <button className="text-teal underline text-xs ml-auto" onClick={()=>n('/alerts?open='+alert.id)}>Open details</button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button className="btn-primary" onClick={contact}>📞 Contact Tourist</button>
        <button className="btn-warn" onClick={dispatchAmb}>🚑 Dispatch Ambulance</button>
        {isPolice ? (
          <>
            <button className="btn-primary" onClick={()=>n('/map?alert='+alert.id)}>Track on Map</button>
            <button className="btn-primary" onClick={fileEfir}>e‑FIR Filing</button>
          </>
        ) : (
          <button className="btn-primary" onClick={informPolice}>🚔 Inform Police</button>
        )}
      </div>
    </div>
  );
}




