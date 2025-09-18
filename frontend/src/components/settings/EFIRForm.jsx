import { useState, useEffect } from 'react';

export default function EFIRForm({ initial, onSave }) {
  const [model, setModel] = useState(initial);
  const [saved, setSaved] = useState(initial);

  useEffect(()=>{ setModel(initial); setSaved(initial); }, [initial]);

  const save = () => { setSaved(model); onSave?.(model); };
  const reset = () => setModel(saved);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="font-semibold mb-3">E‑FIR Settings</div>
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
        <div>
          <label className="text-sm text-slate">Escalation Workflow</label>
          <select className="w-full mt-1 px-3 py-2 rounded-xl bg-white border" value={model.escalation} onChange={e=>setModel({...model, escalation:e.target.value})}>
            <option>Direct Inspector Approval</option>
            <option>Auto-forward to Control Room</option>
            <option>Manual Review</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" checked={model.autoPrefill} onChange={e=>setModel({...model, autoPrefill:e.target.checked})} />
            <span className="text-sm text-ink">Enable Auto‑Prefill from Alerts</span>
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate">Default Resolution Notes Template</label>
          <textarea className="w-full mt-1 px-3 py-2 rounded-xl bg-white border" rows={4} value={model.notesTemplate} onChange={e=>setModel({...model, notesTemplate:e.target.value})} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 rounded-xl bg-green-600 text-white hover:brightness-110" onClick={save}>Save</button>
        <button className="px-4 py-2 rounded-xl bg-rojo text-white hover:brightness-110" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
