import { useMemo, useState } from 'react';
import { useStore } from '../utils/store.jsx';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export default function History() {
  const { alerts, dispatches, firs } = useStore();
  const [tab,setTab]=useState('alerts');
  const [state,setState]=useState('');
  const [date,setDate]=useState('');

  const filtered = useMemo(()=>{
    const byTab = tab==='alerts'? alerts : tab==='dispatch'? dispatches : firs;
    return byTab.filter(r=>{
      const sOk = state? (r.state===state) : true;
      const dOk = date? (new Date(r.ts).toISOString().slice(0,10)===date) : true;
      return sOk && dOk;
    });
  },[alerts,dispatches,firs,tab,state,date]);

  const exportCSV = ()=>{
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    saveAs(blob, `yatraksha-${tab}.csv`);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button className={`btn-primary ${tab==='alerts'?'':'opacity-70'}`} onClick={()=>setTab('alerts')}>Alert History</button>
        <button className={`btn-primary ${tab==='dispatch'?'':'opacity-70'}`} onClick={()=>setTab('dispatch')}>Ambulance Dispatch</button>
        <button className={`btn-primary ${tab==='firs'?'':'opacity-70'}`} onClick={()=>setTab('firs')}>FIR Logs</button>
      </div>

      <div className="flex gap-3 items-center">
        <input className="bg-white rounded-2xl p-3" placeholder="Filter by state" value={state} onChange={e=>setState(e.target.value)} />
        <input type="date" className="bg-white rounded-2xl p-3" value={date} onChange={e=>setDate(e.target.value)} />
        <button className="btn-warn" onClick={()=>{ setState(''); setDate(''); }}>Clear</button>
        <button className="btn-primary ml-auto" onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="glass rounded-2xl p-4">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              {tab!=='firs' && <th>Alert</th>}
              {tab==='dispatch' && <th>Unit</th>}
              {tab==='firs' && <th>Officer</th>}
              <th>State</th>
              <th>District</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r)=>(
              <tr key={r.id}>
                <td>{r.id}</td>
                {tab!=='firs' && <td>{r.alertId || r.id}</td>}
                {tab==='dispatch' && <td>{r.unit}</td>}
                {tab==='firs' && <td>{r.officer}</td>}
                <td>{r.state}</td>
                <td>{r.district}</td>
                <td>{r.status || '—'}</td>
                <td>{new Date(r.ts).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div className="text-slate text-sm mt-3">No records match the filters.</div>}
      </div>
    </div>
  );
}

