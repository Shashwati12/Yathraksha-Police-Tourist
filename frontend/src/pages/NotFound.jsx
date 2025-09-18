import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="glass rounded-2xl p-6 text-center">
        <div className="text-2xl font-semibold">Page not found</div>
        <Link to="/login" className="btn-primary mt-3 inline-block">Go to Login</Link>
      </div>
    </div>
  );
}
