import { getAudit } from '../utils/audit.js';

export default function AuditLog() {
  const entries = getAudit();
  return (
    <div className="rounded-2xl glass p-4">
      <div className="font-semibold mb-2">Audit Trail</div>
      <div className="table">
        <table className="w-full">
          <thead><tr><th>Time</th><th>User</th><th>Role</th><th>Action</th><th>Alert</th><th>Reason</th></tr></thead>
          <tbody>
            {entries.map(e=>(
              <tr key={e.id}><td>{new Date(e.ts).toLocaleString()}</td><td>{e.user}</td><td>{e.role}</td><td>{e.action}</td><td>{e.alertId}</td><td>{e.reason}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
