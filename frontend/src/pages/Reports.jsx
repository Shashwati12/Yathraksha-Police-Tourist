import { useEffect, useState } from 'react';
import { useStore } from '../utils/store.jsx';
import * as api from '../services/api.js';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ComposedChart, Bar, Area } from 'recharts';
import HeatmapToggle from '../components/HeatmapToggle.jsx';

export default function Reports() {
  const { alerts } = useStore();
  const [series,setSeries]=useState({ alertsDaily:[], firTrend:[] });
  const [theme,setTheme]=useState('warm');

  useEffect(()=>{ api.getReportSeries().then(setSeries); },[]);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="font-semibold mb-2">Alerts vs Drop-offs (Daily)</div>
          <div className="h-64">
            <ResponsiveContainer>
              <ComposedChart data={series.alertsDaily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" /><YAxis />
                <Tooltip />
                <Bar dataKey="drop" barSize={24} fill="#FF8045" />
                <Line type="monotone" dataKey="sos" stroke="#DF2A2A" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="font-semibold mb-2">FIR Trend (Monthly)</div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={series.firTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" /><YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#008080" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Heatmap Layer Controls</div>
          <HeatmapToggle value={theme} onChange={setTheme} />
        </div>
        <div className="text-sm text-slate mt-2">
          Use Map page to visualize heatmaps; this panel stores the preferred color theme used across sessions (mock). Current theme: {theme}.
        </div>
        <div className="mt-3 text-sm">Current active alerts: {alerts.length}</div>
      </div>
    </div>
  );
}
