import { useEffect, useState } from 'react';
import { useAuth } from '../utils/auth.jsx';
import * as api from '../services/api.js';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const n = useNavigate();
  const loc = useLocation();
  const [role, setRole] = useState('police');
  const [states, setStates] = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ id: '', password: '', otp: '', state: '' });

  useEffect(() => { api.getStatesNE().then(setStates); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!otpSent) { setOtpSent(true); return; }
    if (otpSent && form.otp.length !== 6) return;
    const payload = {
      role,
      name: role === 'police' ? 'Inspector (Mock)' : 'Tourism Officer (Mock)',
      state: role === 'tourism' ? form.state : undefined,
    };
    await login(payload);
    const dest = role === 'police' ? '/dashboard/police' : '/dashboard/tourism';
    n(loc.state?.from?.pathname || dest);
  };

  const credsReady = form.id.trim() && form.password.trim();
  const otpReady = form.otp.length === 6;
  const otpBtnLabel = !otpSent ? 'Send OTP' : (otpReady ? 'Verify OTP' : 'Send OTP');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Brand hero */}
      <div className="pt-12 pb-6 flex justify-center">
        <div className="flex items-center gap-5">
          <div className="relative">
            {/* Subtle glow only, no border */}
            <div className="absolute inset-0 rounded-3xl bg-teal-600/5 blur-lg" aria-hidden="true" />
            <div className="relative w-24 h-24 rounded-3xl bg-white shadow-md grid place-items-center">
              <img
                src="/src/assets/logo-yatraksha.png"
                alt="Yatraksha logo"
                className="w-20 h-20 rounded-2xl"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide text-teal-700">Yatraksha</h1>
            <p className="text-sm text-gray-500 -mt-0.5">Secure Portal for Government Officials</p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="px-4 pb-14">
        <form
          onSubmit={submit}
          className="mx-auto w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200"
          aria-label="Login form"
        >
          {/* Department switch */}
          <fieldset className="flex justify-center gap-6 bg-gray-100 rounded-xl p-2" aria-label="Select department">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                className="accent-teal-600"
                checked={role === 'police'}
                onChange={() => setRole('police')}
              />
              <span className="text-gray-700">Police Dept.</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                className="accent-teal-600"
                checked={role === 'tourism'}
                onChange={() => setRole('tourism')}
              />
              <span className="text-gray-700">Tourism Dept.</span>
            </label>
          </fieldset>

          {/* Fields */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-600">
                {role === 'police' ? 'CCTNS Inspector ID' : 'HRMS Employee Code'}
              </span>
              <input
                className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder={role === 'police' ? 'Enter CCTNS ID' : 'Enter HRMS Code'}
                required
                autoComplete="username"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
              />
            </label>

            {role === 'tourism' && (
              <label className="block">
                <span className="text-sm text-gray-600">Select State (North-East)</span>
                <select
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:ring-2 focus:ring-teal-500 outline-none"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                >
                  <option value="">Select State</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            )}

            <label className="block">
              <span className="text-sm text-gray-600">Password</span>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Enter Password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            {otpSent && (
              <label className="block">
                <span className="text-sm text-gray-600">OTP (mock)</span>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Enter OTP"
                  required
                  value={form.otp}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setForm({ ...form, otp: v });
                  }}
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full bg-[#FF8045] text-white font-semibold rounded-full py-3 hover:brightness-110 transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => {
                setOtpSent(true);
                if (otpSent && otpReady) {
                  setToast('OTP verified successfully');
                  setTimeout(() => setToast(''), 2000);
                }
              }}
              aria-label="Send or Verify OTP"
              disabled={!credsReady}
            >
              {otpBtnLabel}
            </button>
            <button
              type="submit"
              className="w-full bg-[#008080] text-white font-semibold rounded-full py-3 hover:brightness-110 transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={otpSent && !otpReady}
            >
              {otpSent ? 'Login' : 'Proceed'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Note: Integrate with HRMS/CCTNS + OTP gateway in production.
          </p>
        </form>
      </div>

      {/* Message popup toast */}
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-50">
          <div className="animate-[slideUp_200ms_ease-out] bg-white text-ink rounded-2xl shadow-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-teal-600 text-white">✓</span>
            <div className="text-sm">
              <div className="font-semibold text-ink">Success</div>
              <div className="text-gray-600">{toast}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



