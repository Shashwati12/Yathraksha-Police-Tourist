export default function TouristPopup({ t, revealContact, onTrack }) {
  return (
    <div className="space-y-1">
      <div className="font-semibold">{t.name} • {t.groupSize} pax</div>
      <div className="text-sm">{revealContact? t.phone : 'Phone hidden'}</div>
      <div className="text-sm">ID ending {t.last4}</div>
      <div className="text-sm">Panic: {t.panic? 'Yes':'No'}</div>
      <div className="text-sm">Last seen: {t.lastSeen} ({t.pincode})</div>
      <div className="text-sm">Lat/Lng: {t.lat.toFixed(4)}, {t.lng.toFixed(4)}</div>
      <div className="text-sm">Drop-off: {t.dropOffMins} mins</div>
      {onTrack && <div className="pt-2"><button className="btn-primary" onClick={()=>onTrack(t)}>Track Live</button></div>}
    </div>
  );
}
