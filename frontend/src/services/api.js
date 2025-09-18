// Mock API layer with stable contracts for future backend swap.
// Preserves previous named exports and adds minor utilities.

import {
  alerts,
  tourists,
  geo,
  dispatchLogs,
  firs,
  kpis,
  reportSeries,
  statesNE
} from './mockData.js';

const sleep = (ms=250) => new Promise(r => setTimeout(r, ms));
const rand = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
const nowIso = () => new Date().toISOString();

function genDispatchId() {
  return `D-${7000 + rand(0, 999)}`;
}
function genFirId() {
  return `FIR-2025-${String(rand(1, 9999)).padStart(4, '0')}`;
}

// Reads
export const getStatesNE = async () => {
  await sleep();
  return statesNE;
};
export const getTourists = async () => {
  await sleep();
  // return copy to avoid accidental mutation
  return [...tourists];
};
export const getAlerts = async () => {
  await sleep();
  return [...alerts];
};
export const getGeo = async () => {
  await sleep();
  return geo;
};
export const getDispatchLogs = async () => {
  await sleep();
  return [...dispatchLogs];
};
export const getFirs = async () => {
  await sleep();
  return [...firs];
};
export const getKpis = async (role) => {
  await sleep();
  return kpis[role] || {};
};
export const getReportSeries = async () => {
  await sleep();
  return reportSeries;
};

// Writes (mock)
export const dispatchAmbulance = async (payload) => {
  await sleep(200);
  const res = {
    id: genDispatchId(),
    ...payload,
    status: 'dispatched',
    ts: nowIso()
  };
  // Side-effect for local mock log list if present
  try { dispatchLogs.unshift(res); } catch {}
  return res;
};

export const fileEfir = async (payload) => {
  await sleep(300);
  const res = {
    id: genFirId(),
    ...payload,
    status: 'submitted',
    ts: nowIso()
  };
  try { firs.unshift(res); } catch {}
  return res;
};

// Placeholders for future integrations (kept for compatibility)
/*
export async function verifyCCTNSInspector({ inspectorId, password, otp }) { }
export async function verifyHRMSUser({ empCode, password, otp, state }) { }
export async function secureContact({ alertId, reason }) { }
*/

// Utility: calculate simple ETA for demos (not used by core flows)
export function estimateEtaMins(distanceKm=3) {
  // Assume average 30 km/h in city => 2 min per km
  const eta = Math.max(2, Math.round(distanceKm * 2));
  return eta;
}
