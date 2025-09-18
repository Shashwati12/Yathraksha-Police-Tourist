import { useEffect, useState, useMemo } from 'react';
import KpiCard from '../components/KpiCard.jsx';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../utils/store.jsx';
import * as api from '../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function DashboardPolice() {
  const { alerts, firs, dispatches, policeNotices } = useStore();
  const [kpis, setKpis] = useState({});
  const [series, setSeries] = useState({});
  const [dismissed, setDismissed] = useState(new Set());
  const navigate = useNavigate();

  const dismiss = (id) => setDismissed(prev => new Set([...prev, id]));

  useEffect(() => {
    api.getKpis('police').then(setKpis);
    api.getReportSeries().then(setSeries);
  }, []);

  const resourceData = useMemo(() => {
    const ambAvail = series?.resourceAvail?.ambAvail ?? 2;
    const policeAvail = series?.resourceAvail?.polAvail ?? 2;
    const ambBusy = (series?.resourceAvail?.ambTotal ?? 3) - ambAvail;
    const policeBusy = (series?.resourceAvail?.polTotal ?? 3) - policeAvail;
    return [
      { name: 'Ambulance', Available: ambAvail, Busy: ambBusy },
      { name: 'Police',    Available: policeAvail, Busy: policeBusy },
    ];
  }, [series]);

  return (
    <div className="space-y-6">
      {/* Dismissible police notifications */}
      {policeNotices
        .filter(n => !dismissed.has(n.id))
        .slice(0, 5)
        .map(n => (
          <div key={n.id} className="rounded-xl bg-yellow px-3 py-2 text-ink flex items-start justify-between gap-3">
            <div>
              Tourism notice: {n.message} —{' '}
              <button className="text-teal underline" onClick={()=>navigate('/alerts?open='+n.alertId)}>Open Alerts</button>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 text-xs leading-none"
              onClick={()=>dismiss(n.id)}
              aria-label="Dismiss"
            >✕</button>
          </div>
        ))}

      {/* KPI cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <KpiCard label="Active Alerts" value={kpis.activeAlerts} tone="rojo" hint="live" />
        <KpiCard label="e-FIRs Filed Today" value={kpis.efirsToday} tone="teal" hint="today" />
        <KpiCard label="Avg Response Time" value={`${kpis.avgResponseMins} min`} tone="orange" hint="last 24h" />
        <KpiCard label="SOS This Week" value={kpis.sosThisWeek} tone="yellow" hint="week" />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Daily Alert Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.alertsDaily || []}>
                <defs>
                  <linearGradient id="sosGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DF2A2A" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#DF2A2A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" /><YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sos" stroke="#DF2A2A" fill="url(#sosGrad)" name="SOS Alerts" />
                <Area type="monotone" dataKey="drop" stroke="#FF8045" fill="#FF804540" name="Drop-Offs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Monthly FIR Filing</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={series.firTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" /><YAxis /><Tooltip />
                <Bar dataKey="count" fill="#008080" name="FIRs Filed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Dispatch Response Times</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={series.dispatchTimes || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="eta" stroke="#1E90FF" name="Avg ETA (mins)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resource Availability */}
      <div className="glass rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Resource Availability</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="Available" fill="#008080" />
              <Bar dataKey="Busy" fill="#FF8045" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent e-FIRs */}
      <div className="glass rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Recent e-FIRs</h2>
        <div className="overflow-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">FIR ID</th>
                <th className="px-4 py-2 text-left">Linked Alert</th>
                <th className="px-4 py-2 text-left">Officer</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Filed On</th>
              </tr>
            </thead>
            <tbody>
              {firs.slice(0, 6).map(f => (
                <tr key={f.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium">{f.id}</td>
                  <td className="px-4 py-2">{f.alertId}</td>
                  <td className="px-4 py-2">{f.officer}</td>
                  <td className="px-4 py-2">
                    <span className="badge bg-teal text-white">{f.status}</span>
                  </td>
                  <td className="px-4 py-2">{new Date(f.ts).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Summary */}
      <div className="glass rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Active Alerts Summary</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {alerts.map(a => (
            <div key={a.id} className="p-3 border rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className={`badge text-white ${a.type==='SOS' ? 'bg-rojo' : 'bg-orange'}`}>{a.type}</span>
                <span className="text-xs text-slate">{new Date(a.ts).toLocaleString()}</span>
              </div>
              <div className="text-sm font-medium">{a.state} • {a.district}</div>
              <div className="text-slate-600 text-xs mt-1">{a.reason}</div>
              <button className="text-teal underline text-xs mt-2" onClick={()=>navigate('/alerts?open='+a.id)}>Open details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
