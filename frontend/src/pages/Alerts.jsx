import { useMemo, useState } from 'react';
import { useStore } from '../utils/store.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth.jsx';
import { recordAudit } from '../utils/audit.js';

// Toast host
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

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Alerts() {
  const { alerts, tourists, updateAlert, notifyPolice } = useStore();
  const { user } = useAuth();
  const isTourism = user?.role === 'tourism';
  const isPolice = user?.role === 'police';
  const q = useQuery();
  const openId = q.get('open');
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  const pushToast = (msg, icon='ℹ️') => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 7000);
  };
  const closeToast = (id) => setToasts(prev => prev.filter(x => x.id !== id));

  const list = useMemo(() => alerts.slice().sort((a,b)=> new Date(b.ts)-new Date(a.ts)), [alerts]);
  const getTourist = (a) => tourists.find(t => t.id === a.touristId);

  const contactTourist = (t, a) => {
    const num = (t?.phone || '').replace(/\s+/g,'');
    const dummy = num || '+91-00000-00000';
    pushToast(`Contact initiated to ${dummy} (Tourist ${a?.touristId || 'N/A'}).`);
  };

  const dispatchAmbulance = (a) => {
    recordAudit({ type:'ambulance-dispatch', by:user?.role || 'unknown', alertId:a.id });
    pushToast(`108 dispatch requested for Alert ${a.id}.`);
  };

  const informPolice = (a) => {
    notifyPolice({ type:'inform', alertId:a.id, message:`Tourism informed Police for ${a.id}` });
    pushToast(`PCR notified for Alert ${a.id}.`);
  };

  const fileEFIR = (a) => {
    if (!isPolice) return;
    navigate('/efir/'+a.id);
  };

  const onStatusChange = (a, status) => {
    updateAlert(a.id, { status });
    pushToast(`Alert ${a.id} → ${status}.`);
  };

  return (
    <div className="space-y-4">
      <ToastHost toasts={toasts} onClose={closeToast} />
      <h1 className="text-xl font-semibold text-ink">Alerts</h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {list.map(a => {
          const isOpen = a.id === openId;
          const t = getTourist(a);
          return (
            <div key={a.id} className={`rounded-2xl p-4 border bg-white transition ${isOpen ? 'ring-2 ring-teal shadow-soft' : 'hover:shadow-md'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`badge text-white ${a.type==='SOS' ? 'bg-rojo' : 'bg-orange'}`}>{a.type}</span>
                <span className="text-xs text-slate">{new Date(a.ts).toLocaleString()}</span>
              </div>

              <div className="text-sm font-semibold">{t?.name || a.touristId} • {a.state} • {a.district}</div>
              <div className="text-xs text-slate mt-1">Contact: {t?.phone || 'N/A'}</div>

              <div className="mt-2">
                <label className="text-xs text-slate mr-2">Status</label>
                <select className="px-2 py-1 rounded border text-sm" value={a.status} onChange={(e)=>onStatusChange(a, e.target.value)}>
                  <option value="active">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-primary" onClick={()=>contactTourist(t, a)}>📞 Contact Tourist</button>
                <button className="btn-warn" onClick={()=>dispatchAmbulance(a)}>🚑 Dispatch Ambulance</button>
                {isTourism ? (
                  <button className="btn-primary" onClick={()=>informPolice(a)}>🚔 Inform Police</button>
                ) : (
                  <button className="btn-primary" onClick={()=>fileEFIR(a)}>e‑FIR Filing</button>
                )}
                <button className="text-teal underline text-xs ml-auto" onClick={()=>navigate('/map?alert='+a.id)}>Track on Map</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




