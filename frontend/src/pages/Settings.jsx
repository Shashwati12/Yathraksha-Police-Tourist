import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../utils/auth.jsx';

function Toast({ show, onHide, children }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onHide, 1800);
    return () => clearTimeout(t);
  }, [show, onHide]);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="rounded-xl bg-white shadow-soft border px-4 py-3 text-sm">
        {children}
      </div>
    </div>
  );
}

// Simple toggle UI
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between py-2">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        className={`w-11 h-6 rounded-full transition ${checked ? 'bg-teal' : 'bg-gray-300'}`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${checked ? 'translate-x-5' : 'translate-x-1'} mt-0.5`} />
      </button>
    </label>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const role = user?.role || 'tourism';
  const isPolice = role === 'police';

  // Tabs
  const tabs = useMemo(() => (isPolice
    ? ['Profile','Notifications','Advanced']
    : ['Profile','Notifications']
  ), [isPolice]);
  const [tab, setTab] = useState(tabs[0]);

  // Profile state
  const [profile, setProfile] = useState(() => ({
    department: isPolice ? 'Police Department' : 'Tourism Department',
    officerName: user?.name || '',
    officerId: isPolice ? (user?.rank || 'POL-0001') : (user?.state || 'TRM-NE-001'),
    email: '',
    phone: '',
    rank: isPolice ? (user?.rank || '') : '',
  }));
  const [savedProfile, setSavedProfile] = useState(profile);

  // Notifications state
  const [notifs, setNotifs] = useState(() => (isPolice
    ? { newTourist:true, ambDispatch:true, tourismEscalation:true, efirUpdates:true }
    : { ambDispatch:true, policeAck:true }
  ));
  const [savedNotifs, setSavedNotifs] = useState(notifs);

  // EFIR advanced (police only)
  const [efir, setEfir] = useState({
    escalation: 'Direct Inspector Approval',
    autoPrefill: true,
    notesTemplate: 'Resolved with assistance from local unit.'
  });
  const [savedEfir, setSavedEfir] = useState(efir);

  // Toast
  const [toast, setToast] = useState(false);

  useEffect(() => {
    // When role changes at runtime, re-seed defaults
    setProfile(prev => ({
      department: isPolice ? 'Police Department' : 'Tourism Department',
      officerName: user?.name || prev.officerName,
      officerId: isPolice ? (user?.rank || 'POL-0001') : (user?.state || 'TRM-NE-001'),
      email: prev.email,
      phone: prev.phone,
      rank: isPolice ? (user?.rank || prev.rank) : '',
    }));
    setNotifs(isPolice
      ? { newTourist:true, ambDispatch:true, tourismEscalation:true, efirUpdates:true }
      : { ambDispatch:true, policeAck:true }
    );
    setEfir({ escalation: 'Direct Inspector Approval', autoPrefill: true, notesTemplate: 'Resolved with assistance from local unit.' });
  }, [isPolice, user?.name, user?.rank, user?.state]);

  const onSaveProfile = () => {
    setSavedProfile(profile);
    setToast(true);
  };
  const onResetProfile = () => setProfile(savedProfile);

  const onSaveNotifs = () => {
    setSavedNotifs(notifs);
    setToast(true);
  };
  const onResetNotifs = () => setNotifs(savedNotifs);

  const onSaveEfir = () => {
    setSavedEfir(efir);
    setToast(true);
  };
  const onResetEfir = () => setEfir(savedEfir);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-ink">Settings</div>
          <div className="text-xs text-slate">{isPolice ? 'Police Department' : 'Tourism Department'} • Role-based configuration</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(t => (
          <button
            key={t}
            onClick={()=>setTab(t)}
            className={`px-4 py-2 -mb-px rounded-t-xl ${tab===t ? 'bg-white text-teal shadow border border-b-white' : 'text-slate hover:text-ink'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab==='Profile' && (
        <div className="glass rounded-2xl p-5">
          <div className="font-semibold mb-3">Profile Settings</div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate">Department Name</label>
              <input className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-50 border" value={profile.department} readOnly />
            </div>
            <div>
              <label className="text-sm text-slate">Assigned Officer Name</label>
              <input className="w-full mt-1 px-3 py-2 rounded-xl bg-white border" placeholder="Enter officer name…" value={profile.officerName} onChange={e=>setProfile({...profile, officerName:e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate">{isPolice ? 'Badge / Officer ID' : 'Officer ID / State code'}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-50 border" value={profile.officerId} readOnly />
            </div>
            <div>
              <label className="text-sm text-slate">Contact Email</label>
              <input className="w-full mt-1 px-3 py-2 rounded-xl bg-white border" placeholder="Enter contact email…" value={profile.email} onChange={e=>setProfile({...profile, email:e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate">Contact Phone</label>
              <input className="w-full mt-1 px-3 py-2 rounded-xl bg-white border" placeholder="Enter phone…" value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} />
            </div>
            {isPolice && (
              <div>
                <label className="text-sm text-slate">Officer Rank</label>
                <input className="w-full mt-1 px-3 py-2 rounded-xl bg-white border" placeholder="Enter rank…" value={profile.rank} onChange={e=>setProfile({...profile, rank:e.target.value})} />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-xl bg-green-600 text-white hover:brightness-110" onClick={onSaveProfile}>Save Changes</button>
            <button className="px-4 py-2 rounded-xl bg-rojo text-white hover:brightness-110" onClick={onResetProfile}>Reset</button>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {tab==='Notifications' && (
        <div className="glass rounded-2xl p-5">
          <div className="font-semibold mb-3">Notification Preferences</div>
          <div className="max-w-xl">
            {isPolice ? (
              <>
                <Toggle label="New Tourist Alert" checked={notifs.newTourist} onChange={v=>setNotifs({...notifs, newTourist:v})} />
                <Toggle label="Ambulance Dispatch Confirmation" checked={notifs.ambDispatch} onChange={v=>setNotifs({...notifs, ambDispatch:v})} />
                <Toggle label="Escalation from Tourism Department" checked={notifs.tourismEscalation} onChange={v=>setNotifs({...notifs, tourismEscalation:v})} />
                <Toggle label="E‑FIR Filing Updates" checked={notifs.efirUpdates} onChange={v=>setNotifs({...notifs, efirUpdates:v})} />
              </>
            ) : (
              <>
                <Toggle label="Notify me when Ambulance is Dispatched" checked={notifs.ambDispatch} onChange={v=>setNotifs({...notifs, ambDispatch:v})} />
                <Toggle label="Notify me when Police Acknowledges an Escalation" checked={notifs.policeAck} onChange={v=>setNotifs({...notifs, policeAck:v})} />
              </>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-xl bg-green-600 text-white hover:brightness-110" onClick={onSaveNotifs}>Save</button>
            <button className="px-4 py-2 rounded-xl bg-rojo text-white hover:brightness-110" onClick={onResetNotifs}>Reset</button>
          </div>
        </div>
      )}

      {/* Advanced tab (Police only) */}
      {tab==='Advanced' && isPolice && (
        <div className="glass rounded-2xl p-5">
          <div className="font-semibold mb-3">E‑FIR Settings</div>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <label className="text-sm text-slate">Escalation Workflow</label>
              <select className="w-full mt-1 px-3 py-2 rounded-xl bg-white border" value={efir.escalation} onChange={e=>setEfir({...efir, escalation:e.target.value})}>
                <option>Direct Inspector Approval</option>
                <option>Auto-forward to Control Room</option>
                <option>Manual Review</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" checked={efir.autoPrefill} onChange={e=>setEfir({...efir, autoPrefill:e.target.checked})} />
                <span className="text-sm text-ink">Enable Auto‑Prefill from Alerts</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate">Default Resolution Notes Template</label>
              <textarea className="w-full mt-1 px-3 py-2 rounded-xl bg-white border" rows={4} value={efir.notesTemplate} onChange={e=>setEfir({...efir, notesTemplate:e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-xl bg-green-600 text-white hover:brightness-110" onClick={onSaveEfir}>Save</button>
            <button className="px-4 py-2 rounded-xl bg-rojo text-white hover:brightness-110" onClick={onResetEfir}>Reset</button>
          </div>
        </div>
      )}

      <Toast show={toast} onHide={()=>setToast(false)}>✅ Settings saved successfully</Toast>
    </div>
  );
}
