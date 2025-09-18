import { useState, useEffect } from 'react';

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

export default function NotificationsForm({ role, initial, onSave }) {
  const [model, setModel] = useState(initial);
  const [saved, setSaved] = useState(initial);

  useEffect(()=>{ setModel(initial); setSaved(initial); }, [initial]);

  const save = () => { setSaved(model); onSave?.(model); };
  const reset = () => setModel(saved);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="font-semibold mb-3">Notification Preferences</div>
      <div className="max-w-xl">
        {role==='police' ? (
          <>
            <Toggle label="New Tourist Alert" checked={model.newTourist} onChange={v=>setModel({...model, newTourist:v})} />
            <Toggle label="Ambulance Dispatch Confirmation" checked={model.ambDispatch} onChange={v=>setModel({...model, ambDispatch:v})} />
            <Toggle label="Escalation from Tourism Department" checked={model.tourismEscalation} onChange={v=>setModel({...model, tourismEscalation:v})} />
            <Toggle label="E‑FIR Filing Updates" checked={model.efirUpdates} onChange={v=>setModel({...model, efirUpdates:v})} />
          </>
        ) : (
          <>
            <Toggle label="Notify me when Ambulance is Dispatched" checked={model.ambDispatch} onChange={v=>setModel({...model, ambDispatch:v})} />
            <Toggle label="Notify me when Police Acknowledges an Escalation" checked={model.policeAck} onChange={v=>setModel({...model, policeAck:v})} />
          </>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 rounded-xl bg-green-600 text-white hover:brightness-110" onClick={save}>Save</button>
        <button className="px-4 py-2 rounded-xl bg-rojo text-white hover:brightness-110" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
