import { useEffect, useMemo, useState } from 'react';
import MapView from '../components/MapView.jsx';
import HeatmapToggle from '../components/HeatmapToggle.jsx';
import * as api from '../services/api.js';
import { useAuth } from '../utils/auth.jsx';
import { useStore } from '../utils/store.jsx';
import { recordAudit } from '../utils/audit.js';

export default function TouristMap() {
  const { user } = useAuth();
  const { alerts, tourists } = useStore();
  const [geo, setGeo] = useState({ highRiskZones:[], clusterHeat:[], units:{ ambulances:[], police:[] } });
  const [theme, setTheme] = useState('warm');
  const [reveal, setReveal] = useState(false);

  const activeAlertIds = useMemo(
    () => new Set(alerts.filter(a => a.status === 'active').map(a => a.touristId)),
    [alerts]
  );

  useEffect(() => { api.getGeo().then(setGeo); }, []);

  const canReveal = (t) =>
    user.role === 'police' || (activeAlertIds.has(t.id) && (t.panic || t.dropOffMins >= 120));

  const acknowledge = () => {
    setReveal(true);
    recordAudit({
      user: user.name,
      role: user.role,
      action: 'Emergency contact reveal',
      alertId: 'ACTIVE',
      reason: 'SOS/Drop-off'
    });
  };

  const onTrack = (t) => {
    // Simple simulated movement
    let i = 0;
    const id = setInterval(() => {
      t.lat += 0.001; t.lng += 0.001;
      setGeo(g => ({ ...g })); // re-render
      if (++i > 20) clearInterval(id);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <HeatmapToggle value={theme} onChange={setTheme} />
        {user.role === 'tourism' && (
          <div className="bg-yellow rounded-xl px-3 py-2 text-ink">
            Emergency Access is available for active SOS/drop-off only. Click acknowledge to view contact.
            <button className="ml-3 btn-primary" onClick={acknowledge} disabled={reveal}>
              Acknowledge Emergency Use
            </button>
          </div>
        )}
      </div>

      {/* Compact map card */}
      <MapView
        height={420}
        tourists={tourists}
        geo={geo}
        theme={theme}
        allowTrack={user.role === 'police'}
        onTrack={onTrack}
        revealContact={reveal || user.role === 'police'}
        canReveal={canReveal}
      />

      {/* Map legend / documentation */}
      <section className="glass rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Map legend</h3>
        <ul className="text-sm space-y-1">
          <li>• Teal dot: Tourist marker (normal condition). [Source: UI spec]</li>
          <li>• Red dot: Tourist with active SOS or panic. [Source: UI spec]</li>
          <li>• Orange circle: Ambulance unit location. [Source: UI spec]</li>
          <li>• Teal circle: Police unit location. [Source: UI spec]</li>
          <li>• Shaded polygon: High‑risk zone; red for high, orange for medium. [Source: UI spec]</li>
          <li>• Heatmap: Cluster intensity of recent tourist presence or alerts; switch between Warm/Cool. [Source: UI spec]</li>
        </ul>
      </section>
    </div>
  );
}
