import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../utils/store.jsx';
import EfirWizard from '../components/EfirWizard.jsx';
import { useAuth } from '../utils/auth.jsx';
import { recordAudit } from '../utils/audit.js';

function Toast({ show, onHide, children }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onHide, 1500);
    return () => clearTimeout(t);
  }, [show, onHide]);
  if (!show) return null;
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="rounded-xl bg-white shadow-soft border px-4 py-3 text-sm flex items-start gap-3 min-w-[280px]">
        <div className="text-teal">✅</div>
        <div className="flex-1">{children}</div>
        <button className="text-gray-400 hover:text-gray-600 text-xs leading-none" onClick={onHide} aria-label="Close">✕</button>
      </div>
    </div>
  );
}

export default function EfirFiling() {
  const { alertId } = useParams();
  const n = useNavigate();
  const { user } = useAuth();
  const { alerts, tourists, addFir } = useStore();
  const alert = alerts.find(a=>a.id===alertId);
  const tourist = tourists.find(t=>t.id===alert?.touristId);
  const [toast, setToast] = useState(false);

  const done = (fir) => {
    addFir(fir);
    recordAudit({ user: user.name, role: user.role, action:'Filed e-FIR', alertId, reason: 'Automation workflow' });
    setToast(true);
    setTimeout(() => n('/history'), 1200);
  };

  if (!alert || !tourist) return (
    <div className="glass p-6 rounded-2xl">
      <div className="text-lg font-semibold mb-1">Alert not found</div>
      <div className="text-sm text-slate">The selected alert could not be located. Return to Alerts and try again.</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Toast show={toast} onHide={()=>setToast(false)}>
        e‑FIR initiated for Tourist {tourist.id}.
      </Toast>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-ink">e‑FIR for {tourist.name}</div>
          <div className="text-xs text-slate">Alert {alert.id} • {alert.type} • {new Date(alert.ts).toLocaleString()}</div>
        </div>
      </div>
      <EfirWizard alert={alert} tourist={tourist} onDone={done} />
    </div>
  );
}

