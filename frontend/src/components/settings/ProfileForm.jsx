import { useEffect, useMemo, useState } from 'react';

function Field({ label, children, hint, error }) {
  return (
    <div>
      <label className="text-sm text-slate">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && !error && <div className="text-xs text-slate mt-1">{hint}</div>}
      {error && <div className="text-xs text-rojo mt-1">{error}</div>}
    </div>
  );
}

function AvatarBadge({ name, role }) {
  const initials = useMemo(() => {
    const parts = String(name || '').trim().split(' ');
    return (parts[0]?.[0] || 'O') + (parts[1]?.[0] || '');
  }, [name]);
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-teal text-white grid place-items-center text-lg font-semibold shadow">
        {initials.toUpperCase()}
      </div>
      <div>
        <div className="font-semibold text-ink">{name || 'Officer'}</div>
        <div className="text-xs text-slate">{role==='police' ? 'Police Department' : 'Tourism Department'}</div>
      </div>
    </div>
  );
}

export default function ProfileForm({ role, initial, onSave }) {
  const [model, setModel] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(()=>{ setModel(initial); setSaved(initial); setErrors({}); }, [initial]);

  const validate = () => {
    const e = {};
    if (!model.officerName?.trim()) e.officerName = 'Officer name is required';
    if (model.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(model.email)) e.email = 'Enter a valid email';
    if (model.phone && !/^[0-9+\-\s]{7,15}$/.test(model.phone)) e.phone = 'Enter a valid phone';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    setSaved(model);
    onSave?.(model);
  };
  const reset = () => { setModel(saved); setErrors({}); };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header band */}
      <div className="p-5 bg-white border-b">
        <div className="flex items-center justify-between">
          <AvatarBadge name={model.officerName} role={role} />
          <div className="hidden md:flex items-center gap-2">
            <span className="px-2 py-1 rounded-lg bg-gray-100 text-xs">ID: {model.officerId}</span>
            {role==='police' && <span className="px-2 py-1 rounded-lg bg-gray-100 text-xs">Rank: {model.rank || '—'}</span>}
            <span className="px-2 py-1 rounded-lg bg-gray-100 text-xs">{model.department}</span>
          </div>
        </div>
      </div>

      {/* Body form */}
      <div className="p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Department Name" hint="Configured by administration">
            <input className="w-full px-3 py-2 rounded-xl bg-gray-50 border" value={model.department} readOnly />
          </Field>

          <Field label="Assigned Officer Name" error={errors.officerName} hint="Official name as per records">
            <input
              className={`w-full px-3 py-2 rounded-xl bg-white border ${errors.officerName ? 'border-rojo' : ''}`}
              placeholder="Enter officer name…"
              value={model.officerName}
              onChange={e=>setModel({...model, officerName:e.target.value})}
            />
          </Field>

          <Field label={role==='police' ? 'Badge / Officer ID' : 'Officer ID / State code'}>
            <input className="w-full px-3 py-2 rounded-xl bg-gray-50 border" value={model.officerId} readOnly />
          </Field>

          <Field label="Contact Email" error={errors.email} hint="Official email (e.g., name@dept.gov.in)">
            <input
              className={`w-full px-3 py-2 rounded-xl bg-white border ${errors.email ? 'border-rojo' : ''}`}
              placeholder="Enter contact email…"
              value={model.email}
              onChange={e=>setModel({...model, email:e.target.value})}
            />
          </Field>

          <Field label="Contact Phone" error={errors.phone} hint="Include country code if external">
            <input
              className={`w-full px-3 py-2 rounded-xl bg-white border ${errors.phone ? 'border-rojo' : ''}`}
              placeholder="Enter phone…"
              value={model.phone}
              onChange={e=>setModel({...model, phone:e.target.value})}
            />
          </Field>

          {role==='police' && (
            <Field label="Officer Rank" hint="e.g., Inspector, DySP">
              <input
                className="w-full px-3 py-2 rounded-xl bg-white border"
                placeholder="Enter rank…"
                value={model.rank || ''}
                onChange={e=>setModel({...model, rank:e.target.value})}
              />
            </Field>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <button className="px-4 py-2 rounded-xl bg-green-600 text-white hover:brightness-110" onClick={save}>
            Save Changes
          </button>
          <button className="px-4 py-2 rounded-xl bg-rojo text-white hover:brightness-110" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
