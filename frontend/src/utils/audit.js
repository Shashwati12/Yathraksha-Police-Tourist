import dayjs from 'dayjs';

let audit = [];

/**
 * recordAudit
 * Adds an audit entry for key actions (dispatch, status change, inform police, resolve).
 * event: { type, by, alertId, meta? }
 */
export function recordAudit(event) {
  const entry = { id: crypto.randomUUID(), ts: dayjs().toISOString(), ...event };
  audit.unshift(entry);
  return entry;
}

export function getAudit() {
  return audit;
}

