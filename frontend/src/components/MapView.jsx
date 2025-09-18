import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import L from 'leaflet';
import { useEffect } from 'react';

function HeatLayer({ points, theme='warm', visible=true }) {
  const map = useMap();
  useEffect(() => {
    if (!visible || !points?.length) return;
    const gradient = theme === 'warm'
      ? { 0.4:'#87CEEB', 0.65:'#FFE163', 0.9:'#FF8045' }
      : { 0.4:'#CBEAF6', 0.7:'#87CEEB', 1:'#008080' };
    const heat = L.heatLayer(points, { radius: 25, blur: 15, minOpacity: 0.4, gradient });
    heat.addTo(map);
    return () => { heat.remove(); };
  }, [points, visible, theme, map]);
  return null;
}

export default function MapView({
  tourists,
  geo,
  theme='warm',
  allowTrack=false,
  onTrack,
  revealContact,
  canReveal,
  height=420 // new: compact height with override
}) {
  const tealIcon = L.divIcon({
    className: '',
    html: '<div style="background:#008080;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 0 2px #00808066"></div>'
  });
  const rojoIcon = L.divIcon({
    className: '',
    html: '<div style="background:#DF2A2A;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 0 2px #DF2A2A66"></div>'
  });

  return (
    <div className="rounded-2xl overflow-hidden shadow-soft">
      <MapContainer center={[26.5, 92.0]} zoom={6} style={{ height }}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatLayer points={geo.clusterHeat} theme={theme} />
        {geo.highRiskZones.map(z => (
          <Polygon
            key={z.id}
            positions={z.coords}
            pathOptions={{ color: z.level === 'high' ? '#DF2A2A' : '#FF8045', weight: 2, fillOpacity: 0.2 }}
          />
        ))}
        {tourists.map(t => (
          <Marker key={t.id} position={[t.lat, t.lng]} icon={t.panic ? rojoIcon : tealIcon}>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{t.name} • {t.groupSize} pax</div>
                <div className="text-sm">{revealContact || canReveal?.(t) ? t.phone : 'Phone hidden'}</div>
                <div className="text-sm">ID ending {t.last4}</div>
                <div className="text-sm">Panic: {t.panic ? 'Yes' : 'No'}</div>
                <div className="text-sm">Last seen: {t.lastSeen} ({t.pincode})</div>
                <div className="text-sm">Lat/Lng: {t.lat.toFixed(4)}, {t.lng.toFixed(4)}</div>
                <div className="text-sm">Drop-off: {t.dropOffMins} mins</div>
                <div className="flex gap-2 pt-2">
                  {allowTrack && <button className="btn-primary" onClick={() => onTrack?.(t)}>Track Live</button>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {geo.units.ambulances.map(u => (
          <CircleMarker
            key={u.id}
            center={[u.lat, u.lng]}
            radius={8}
            pathOptions={{ color:'#FF8045', fillColor:'#FF8045', fillOpacity:0.8 }}
          />
        ))}
        {geo.units.police.map(u => (
          <CircleMarker
            key={u.id}
            center={[u.lat, u.lng]}
            radius={8}
            pathOptions={{ color:'#008080', fillColor:'#008080', fillOpacity:0.8 }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
