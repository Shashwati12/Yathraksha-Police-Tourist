import { motion } from 'framer-motion';

export default function KpiCard({ label, value, tone='teal', hint }) {
  const toneMap = { teal:'#008080', orange:'#FF8045', yellow:'#FFE163', rojo:'#DF2A2A' };
  const color = toneMap[tone] || '#008080';
  return (
    <motion.div
      initial={{opacity:0, y:12}}
      animate={{opacity:1, y:0}}
      transition={{duration:0.3}}
      className="glass rounded-2xl p-4"
    >
      <div className="text-sm text-slate mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-semibold">{value}</div>
        {hint && (
          <span className="badge text-white" style={{backgroundColor: color}}>
            {hint}
          </span>
        )}
      </div>
    </motion.div>
  );
}

