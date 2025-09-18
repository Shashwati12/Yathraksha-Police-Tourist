import { useEffect, useState } from 'react';

export default function Toast({ message, tone='teal', onDone }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(()=>{ setShow(false); onDone?.(); }, 3000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className={`fixed bottom-6 right-6 px-4 py-2 rounded-xl text-white shadow-glass`} style={{backgroundColor: tone==='teal'?'#008080': tone==='orange'?'#FF8045': tone==='yellow'?'#FFE163':'#DF2A2A'}}>
      {message}
    </div>
  );
}
