import { useMemo, useState, useEffect } from 'react';
import * as api from '../services/api.js';

function Row({ label, children, readOnly=false }) {
  return (
    <div className="grid md:grid-cols-3 gap-3 items-start">
      <div className="text-sm text-slate pt-2">{label}</div>
      <div className={`md:col-span-2 ${readOnly ? 'opacity-80' : ''}`}>{children}</div>
    </div>
  );
}

function Card({ title, children, muted=false }) {
  return (
    <div className={`rounded-2xl p-4 border ${muted ? 'bg-columbia/30' : 'bg-white'} shadow-sm`}>
      <div className="font-semibold text-ink mb-2">{title}</div>
      {children}
    </div>
  );
}

export default function EfirWizard({ alert, tourist, onDone }) {
  const [step, setStep] = useState(1);
  const [cause, setCause] = useState('Missing');

  const [preview, setPreview] = useState({
    template: 'CCTNS-EFIR-v1',
    alertId: alert.id,
    touristId: tourist.id,
    cause: 'Missing',
    meta: {
      location: { lat: tourist.lat, lng: tourist.lng, pincode: tourist.pincode },
      time: alert.ts,
    },
    statement: `Incident related to ${tourist.name}.`,
    sections: ['IPC 363'],
    officerNotes: '',
  });

  const [payload, setPayload] = useState(null);
  const [addl, setAddl] = useState({ statement: '', sections: '', officerNotes: '' });
  const [otp, setOtp] = useState('');

  const steps = useMemo(() => ([
    { id: 1, name: 'Verify details' },
    { id: 2, name: 'Edit preview' },
    { id: 3, name: 'Review payload' },
    { id: 4, name: 'Authenticate & submit' },
  ]), []);

  const pct = (step - 1) / (steps.length - 1) * 100;

  useEffect(() => { setPreview(prev => ({ ...prev, cause })); }, [cause]);

  useEffect(() => {
    const merged = {
      template: preview.template,
      alertId: preview.alertId,
      touristId: preview.touristId,
      cause: preview.cause,
      meta: preview.meta,
      statement: (addl.statement || preview.statement || '').trim(),
      sections: (addl.sections ? addl.sections.split(',').map(s=>s.trim()).filter(Boolean) : preview.sections) || [],
      officerNotes: (addl.officerNotes || preview.officerNotes || '').trim(),
    };
    setPayload(merged);
  }, [preview, addl]);

  const submit = async () => {
    const res = await api.fileEfir({ alertId: alert.id, form: { preview }, payload });
    onDone(res);
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-6 pt-5 pb-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-ink">e‑FIR Filing</div>
            <div className="text-xs text-slate mt-0.5">Step {step} of {steps.length} • {steps.find(s=>s.id===step)?.name}</div>
          </div>
          <div className="text-xs text-slate">Alert: {alert.id}</div>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-4 text-[11px] text-slate">
          {steps.map(s => (
            <div key={s.id} className={`text-center ${s.id===step ? 'text-ink font-medium' : ''}`}>{s.name}</div>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {step===1 && (
          <div className="space-y-4">
            <Card title="Subject summary" muted>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="rounded-xl p-3 bg-columbia">
                  <div className="text-xs text-slate">Tourist</div>
                  <div className="font-semibold text-ink">{tourist.name}</div>
                  <div className="text-xs text-slate">{tourist.phone}</div>
                </div>
                <div className="rounded-xl p-3 bg-columbia">
                  <div className="text-xs text-slate">Last seen</div>
                  <div className="font-semibold text-ink">{tourist.lastSeen} ({tourist.pincode})</div>
                  <div className="text-xs text-slate">Coords: {tourist.lat.toFixed(4)}, {tourist.lng.toFixed(4)}</div>
                </div>
                <div className="rounded-xl p-3 bg-columbia">
                  <div className="text-xs text-slate">Alert</div>
                  <div className="font-semibold text-ink">{alert.type}</div>
                  <div className="text-xs text-slate truncate">{alert.reason}</div>
                </div>
              </div>
            </Card>

            <Card title="FIR cause">
              <label className="block">
                <span className="text-sm text-slate">Select cause</span>
                <select className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal focus:ring-0" value={cause} onChange={e=>setCause(e.target.value)}>
                  <option>Missing</option>
                  <option>Kidnap</option>
                  <option>Assault</option>
                  <option>Accident</option>
                </select>
              </label>
            </Card>

            <div className="flex justify-end gap-2">
              <button className="btn-primary" onClick={()=>setStep(2)}>Next</button>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="space-y-4">
            <Card title="Preview (editable)">
              <div className="space-y-3">
                <Row label="Template"><input className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.template} onChange={e=>setPreview(p=>({ ...p, template:e.target.value }))} /></Row>
                <Row label="Alert ID"><input className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.alertId} onChange={e=>setPreview(p=>({ ...p, alertId:e.target.value }))} /></Row>
                <Row label="Tourist ID"><input className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.touristId} onChange={e=>setPreview(p=>({ ...p, touristId:e.target.value }))} /></Row>
                <Row label="Cause"><input className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.cause} onChange={e=>setPreview(p=>({ ...p, cause:e.target.value }))} /></Row>
                <Row label="Statement"><textarea className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" rows={4} value={preview.statement} onChange={e=>setPreview(p=>({ ...p, statement:e.target.value }))} /></Row>
                <Row label="IPC Sections (comma‑sep)"><input className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.sections.join(', ')} onChange={e=>setPreview(p=>({ ...p, sections: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) }))} /></Row>
                <Row label="Officer Notes"><textarea className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" rows={3} value={preview.officerNotes} onChange={e=>setPreview(p=>({ ...p, officerNotes:e.target.value }))} /></Row>
                <Row label="Location (lat, lng, pincode)">
                  <div className="grid md:grid-cols-3 gap-2">
                    <input className="px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.meta.location.lat} onChange={e=>setPreview(p=>({ ...p, meta:{ ...p.meta, location:{ ...p.meta.location, lat:e.target.value }}}))} />
                    <input className="px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.meta.location.lng} onChange={e=>setPreview(p=>({ ...p, meta:{ ...p.meta, location:{ ...p.meta.location, lng:e.target.value }}}))} />
                    <input className="px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.meta.location.pincode} onChange={e=>setPreview(p=>({ ...p, meta:{ ...p.meta, location:{ ...p.meta.location, pincode:e.target.value }}}))} />
                  </div>
                </Row>
                <Row label="Time"><input className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" value={preview.meta.time} onChange={e=>setPreview(p=>({ ...p, meta:{ ...p.meta, time:e.target.value }}))} /></Row>
              </div>
            </Card>

            <div className="flex justify-between">
              <button className="btn-warn" onClick={()=>setStep(1)}>Back</button>
              <button className="btn-primary" onClick={()=>setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card title="Review generated payload" muted>
              {payload ? (
                <div className="space-y-3">
                  <Row label="Template" readOnly><input className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-teal/30" value={payload.template} readOnly /></Row>
                  <Row label="Alert ID" readOnly><input className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-teal/30" value={payload.alertId} readOnly /></Row>
                  <Row label="Tourist ID" readOnly><input className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-teal/30" value={payload.touristId} readOnly /></Row>
                  <Row label="Cause" readOnly><input className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-teal/30" value={payload.cause} readOnly /></Row>
                  <Row label="Time" readOnly><input className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-teal/30" value={new Date(payload.meta.time).toLocaleString()} readOnly /></Row>
                  <Row label="Location" readOnly>
                    <div className="grid md:grid-cols-3 gap-2">
                      <input className="px-3 py-2 rounded-xl bg-gray-50 border border-teal/30" value={payload.meta.location.lat} readOnly />
                      <input className="px-3 py-2 rounded-xl bg-gray-50 border border-teal/30" value={payload.meta.location.lng} readOnly />
                      <input className="px-3 py-2 rounded-xl bg-gray-50 border border-teal/30" value={payload.meta.location.pincode} readOnly />
                    </div>
                  </Row>
                  <Row label="Statement"><textarea className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" rows={3} placeholder="Public-facing narrative…" value={addl.statement} onChange={e=>setAddl(p=>({ ...p, statement: e.target.value }))} /></Row>
                  <Row label="IPC Sections (comma‑sep)"><input className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" placeholder="e.g., IPC 363, IPC 364A" value={addl.sections} onChange={e=>setAddl(p=>({ ...p, sections: e.target.value }))} /></Row>
                  <Row label="Officer Notes"><textarea className="w-full px-3 py-2 rounded-xl bg-white border border-teal/40 focus:border-teal" rows={3} placeholder="Internal remarks…" value={addl.officerNotes} onChange={e=>setAddl(p=>({ ...p, officerNotes: e.target.value }))} /></Row>
                </div>
              ) : (
                <div className="text-sm text-slate">Preview first to generate payload.</div>
              )}
            </Card>

            <Card title="Preview snapshot" muted>
              <div className="space-y-2 text-sm">
                <div><span className="text-slate">Template:</span> <span className="font-medium">{preview.template}</span></div>
                <div><span className="text-slate">IDs:</span> <span className="font-medium">{preview.alertId} • {preview.touristId}</span></div>
                <div><span className="text-slate">Cause:</span> <span className="font-medium">{preview.cause}</span></div>
                <div><span className="text-slate">Statement:</span> <span className="font-medium line-clamp-3">{(addl.statement || preview.statement)}</span></div>
                <div><span className="text-slate">Sections:</span> <span className="font-medium">{(addl.sections || preview.sections.join(', '))}</span></div>
                <div><span className="text-slate">Notes:</span> <span className="font-medium line-clamp-3">{(addl.officerNotes || preview.officerNotes || '—')}</span></div>
              </div>
            </Card>

            <div className="md:col-span-2 flex justify-between">
              <button className="btn-warn" onClick={()=>setStep(2)}>Back</button>
              <button className="btn-primary" onClick={()=>setStep(4)} disabled={!payload}>Next</button>
            </div>
          </div>
        )}

        {step===4 && (
          <div className="space-y-4">
            <Card title="Authenticate & submit">
              <div className="text-sm text-slate mb-2">Enter OTP to submit the e‑FIR.</div>
              <div className="flex items-center gap-2">
                <input className="bg-white rounded-2xl p-3 border border-teal/40 focus:border-teal w-40" placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
                <button className="btn-primary" onClick={submit} disabled={!otp}>Submit e‑FIR</button>
              </div>
              <div className="text-xs text-slate mt-2">Submission includes the canonical payload and the edited preview.</div>
            </Card>

            <div className="flex justify-start">
              <button className="btn-warn" onClick={()=>setStep(3)}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
