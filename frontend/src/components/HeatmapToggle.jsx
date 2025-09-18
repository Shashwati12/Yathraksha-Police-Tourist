export default function HeatmapToggle({ onChange, value }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-slate">Heatmap theme</label>
      <select
        aria-label="Heatmap color theme"
        className="px-3 py-2 rounded-xl bg-white shadow-soft"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="warm">Warm</option>
        <option value="cool">Cool</option>
      </select>
    </div>
  );
}

