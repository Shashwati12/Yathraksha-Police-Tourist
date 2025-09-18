import { useState } from 'react';
import { useStore } from '../utils/store.jsx';
import Modal from './Modal.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const { alerts } = useStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const active = alerts.filter(a => a.status === 'active');
  const count = active.length;

  const openAlert = (id) => {
    setOpen(false);
    navigate('/alerts?open='+encodeURIComponent(id));
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        aria-label="Notifications"
        className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
        onClick={()=>setOpen(true)}
      >
        <Bell size={20} className="text-gray-600" />
        <span className="absolute -top-1 -right-1 bg-rojo text-white text-xs rounded-full px-1">{count}</span>
      </motion.button>

      <Modal open={open} onClose={()=>setOpen(false)} title="Live Alerts">
        <div className="space-y-3">
          {alerts.map(a=>(
            <div key={a.id} className="rounded-2xl p-3 bg-columbia flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.type} • {a.state} • {a.district}</div>
                <div className="text-sm text-slate">{a.reason}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-warn" onClick={()=>{ setOpen(false); navigate('/map?alert='+a.id); }}>Track on Map</button>
                <button className="btn-primary" onClick={()=>openAlert(a.id)}>Open</button>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-sm text-slate">No live alerts.</div>
          )}
        </div>
      </Modal>
    </div>
  );
}
