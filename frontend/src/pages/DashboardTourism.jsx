import { useEffect, useState } from 'react';
import KpiCard from '../components/KpiCard.jsx';
import {
  RadialBarChart, RadialBar, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar
} from 'recharts';
import { useStore } from '../utils/store.jsx';
import * as api from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { recordAudit } from '../utils/audit.js';

const CATEGORICAL = ['#008080', '#1296AF', '#FF8045', '#FFC857', '#DF2A2A', '#6A5ACD'];
const TEAL_DARK='#006A6A', TEAL_BASE='#008080', TEAL_MED='#21A3A3', TEAL_LIGHT='#6ECACA';

function Toast({ toasts, onClose }) {
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

export default function DashboardTourism() {
  const { alerts, updateAlert } = useStore();
  const [kpis, setKpis] = useState({});
  const [series, setSeries] = useState({});
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const pushToast = (msg, icon='ℹ️') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 6000);
  };
  const closeToast = (id) => setToasts(prev => prev.filter(x => x.id !== id));

  useEffect(() => {
    api.getKpis('tourism').then(setKpis);
    api.getReportSeries().then(s => {
      const rb = s?.resolutionBreakdown?.length ? s.resolutionBreakdown : [
        { state:'Assam', resolved:18, pending:3, escalated:2, dropped:1 },
        { state:'Sikkim', resolved:12, pending:2, escalated:1, dropped:0 },
        { state:'Meghalaya', resolved:15, pending:4, escalated:1, dropped:1 },
        { state:'Tripura', resolved:9, pending:1, escalated:0, dropped:1 },
      ];
      setSeries({
        ...s,
        resolutionBreakdown: rb,
        dropTrends: s.dropTrends?.length ? s.dropTrends : [
          { day:'Mon', dropOffs:1 },{ day:'Tue', dropOffs:2 },{ day:'Wed', dropOffs:1 },
          { day:'Thu', dropOffs:3 },{ day:'Fri', dropOffs:2 },{ day:'Sat', dropOffs:4 },{ day:'Sun', dropOffs:1 },
        ],
        touristCluster: s.touristCluster?.length ? s.touristCluster : [
          { state:'Assam', count:32 },{ state:'Sikkim', count:21 },{ state:'Meghalaya', count:27 },
          { state:'Nagaland', count:9 },{ state:'Tripura', count:14 },{ state:'Arunachal', count:10 },
        ],
      });
    });
  }, []);

  const resolutionPct = Math.round((kpis.resolutionRate || 0) * 100);
  const openDetails = (id) => navigate('/alerts?open='+encodeURIComponent(id));

  const onStatusChange = (a, status) => {
    updateAlert(a.id, { status });
    recordAudit({ type:'status-update', by:'tourism', alertId:a.id, meta:{ status } });
    pushToast(`Alert ${a.id} → ${status}.`);
  };

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} onClose={closeToast} />

      <div className="grid md:grid-cols-4 gap-4">
        <KpiCard label="Active Alerts" value={kpis.activeAlerts} tone="rojo" hint="live" />
        <KpiCard label="Emergency Reveals" value={kpis.emergencyReveals} tone="orange" hint="30 days" />
        <KpiCard label="Drop-Offs" value={kpis.dropOffs} tone="yellow" hint="7 days" />
        <KpiCard label="Resolution Rate" value={`${resolutionPct}%`} tone="teal" hint="rolling" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Safety Index</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <RadialBarChart data={[{ bg:100, uv:resolutionPct }]} innerRadius="60%" outerRadius="100%" startAngle={180} endAngle={0}>
                <RadialBar dataKey="bg" cornerRadius={8} fill="#E6F6F9" isAnimationActive={false} />
                <RadialBar dataKey="uv" cornerRadius={8} fill={CATEGORICAL[0]} name="Resolution" />
                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-teal font-semibold" style={{ fontSize: 24 }}>{resolutionPct}%</text>
                <Legend verticalAlign="bottom" content={() => (
                  <div className="flex items-center justify-center gap-2 text-sm mt-2">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: CATEGORICAL[0] }} />
                    <span>Resolution</span>
                  </div>
                )} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Tourist Clusters by State</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={series.touristCluster || []} dataKey="count" nameKey="state" outerRadius={100} label>
                  {(series.touristCluster || []).map((_, i) => <Cell key={i} fill={CATEGORICAL[i % CATEGORICAL.length]} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Drop-Off Trends</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={series.dropTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="dropOffs" stroke={CATEGORICAL[2]} strokeWidth={2} dot={{ r:3, stroke:CATEGORICAL[3], strokeWidth:1 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Emergency Resolution Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={series.resolutionBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" /><YAxis /><Tooltip />
                <Bar dataKey="resolved" stackId="a" fill={TEAL_BASE} />
                <Bar dataKey="pending" stackId="a" fill={TEAL_LIGHT} />
                <Bar dataKey="escalated" stackId="a" fill={TEAL_MED} />
                <Bar dataKey="dropped" stackId="a" fill={TEAL_DARK} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts Summary (no action buttons; keep status + open link) */}
      <div className="glass rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Active Alerts Summary</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {alerts.map(a => (
            <div key={a.id} className="p-3 border rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className={`badge text-white ${a.type==='SOS' ? 'bg-rojo' : 'bg-orange'}`}>{a.type}</span>
                <span className="text-xs text-slate">{new Date(a.ts).toLocaleString()}</span>
              </div>
              <div className="text-sm font-medium">Tourist: {a.touristId}</div>
              <div className="text-xs text-slate mt-1">Name: T-{a.touristId?.slice(-4)} • Phone/Email: masked</div>

              <div className="mt-2 flex items-center gap-2">
                <select className="px-2 py-1 rounded border text-sm" value={a.status} onChange={(e)=>onStatusChange(a, e.target.value)}>
                  <option value="active">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
                <button className="text-teal underline text-sm" onClick={()=>openDetails(a.id)}>Open details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





