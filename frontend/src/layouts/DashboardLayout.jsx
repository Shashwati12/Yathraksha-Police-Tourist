import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/auth.jsx';
import { useStore } from '../utils/store.jsx';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const loc = useLocation();

  // Navigation labels
  const nav = useMemo(()=>[
    { to: user?.role==='police' ? '/dashboard/police' : '/dashboard/tourism', label:'Overview' },
    { to:'/map', label:'Live Map' },
    { to:'/alerts', label:'Active Alerts' },
    { to:'/history', label:'Incident History' },
    { to:'/reports', label:'Analytics & Reports' },
    { to:'/settings', label:'System Settings' },
  ], [user?.role]);

  // Single display line: prefer real name, else dummy per role
  const displayName =
    user?.name?.trim()
      ? user.name
      : (user?.role === 'police' ? 'Inspector Rajiv Singh' : 'Officer Ananya Rao');

  // Extra descriptor: rank or state with sensible fallback
  const roleExtra =
    user?.role === 'police'
      ? (user?.rank ? user.rank : 'Indian Police Service')
      : (user?.state ? user.state : 'North-East Region');

  // Ministry short line by role
  const ministryShort = user?.role === 'police'
    ? 'Ministry of Home Affairs (with State Police & NIC)'
    : 'Ministry of Tourism (with State Police & NIC)';

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-gray-50">
      {/* Sidebar */}
      <aside className="p-5 bg-teal text-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <img src="/src/assets/india-emblem.png" alt="Emblem of India" className="w-12 h-12 rounded-lg " />
          <div>
            <div className="font-extrabold text-lg tracking-wide">Government of India</div>
            <div className="text-xs text-white/85">{ministryShort}</div>
          </div>
        </div>
        <nav className="space-y-2">
          {nav.map(n => (
            <Link key={n.to} to={n.to}
              className={`block px-3 py-2 rounded-xl transition ${
                loc.pathname===n.to ? 'bg-white text-teal font-semibold shadow-md' : 'hover:bg-white/10'
              }`}>
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="p-6">
        <Header displayName={displayName} roleExtra={roleExtra} onLogout={logout} />
        <div className="space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Header({ displayName, roleExtra, onLogout }) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <img
          src="/src/assets/logo-yatraksha.png"
          alt="Yatraksha logo"
          className="w-10 h-10 rounded-xl shadow-md"
        />
        <h1 className="text-2xl font-bold text-teal tracking-wide">Yatraksha</h1>
      </div>
      <div className="flex items-center gap-4">
        <BellMenu />
        <div className="text-sm font-medium text-teal">
          {displayName} • {roleExtra}
        </div>
        <button className="btn-danger px-4 py-2 rounded-lg shadow focus-ring" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

function BellMenu() {
  const { alerts } = useStore();
  const [showAlerts, setShowAlerts] = useState(false);
  const activeCount = alerts.filter(a => a.status === 'active').length;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowAlerts(true)}
        className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />
        <span className="absolute -top-1 -right-1 bg-rojo text-white text-[10px] rounded-full min-w-[16px] h-[16px] grid place-items-center px-1">
          {activeCount}
        </span>
      </motion.button>

      {showAlerts && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setShowAlerts(false)} />
          <div className="absolute right-6 top-16 w-[420px] glass rounded-2xl p-4 shadow-glass">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-ink">Live Alerts</div>
              <button className="text-slate text-sm" onClick={()=>setShowAlerts(false)}>Close</button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-auto">
              {alerts.map(a => (
                <div key={a.id} className="rounded-xl p-3 border bg-white">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{a.type} • {a.state} • {a.district}</div>
                    <span className={`badge text-white ${a.severity==='high'?'bg-rojo':'bg-orange'}`}>{a.status}</span>
                  </div>
                  <div className="text-sm text-slate">{a.reason}</div>
                  <div className="text-xs text-slate mt-1">{new Date(a.ts).toLocaleString()}</div>
                </div>
              ))}
              {alerts.length===0 && (
                <div className="text-sm text-slate">No active alerts.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}




