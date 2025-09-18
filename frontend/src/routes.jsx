import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Login from './pages/Login.jsx';
import DashboardPolice from './pages/DashboardPolice.jsx';
import DashboardTourism from './pages/DashboardTourism.jsx';
import TouristMap from './pages/TouristMap.jsx';
import Alerts from './pages/Alerts.jsx';
import EfirFiling from './pages/EfirFiling.jsx';
import History from './pages/History.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';
import { RequireAuth, RequireRole } from './utils/auth.jsx';

export default function RoutesDef() {
  return (
    <Routes>
      {/* Redirect root to login; Dashboard redirect is handled after login by app logic */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected area */}
      <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        {/* Role-specific dashboards */}
        <Route
          path="/dashboard/police"
          element={<RequireRole role="police"><DashboardPolice /></RequireRole>}
        />
        <Route
          path="/dashboard/tourism"
          element={<RequireRole role="tourism"><DashboardTourism /></RequireRole>}
        />

        {/* Shared pages (RBAC enforced inside components where needed) */}
        <Route path="/map" element={<TouristMap />} />
        <Route path="/alerts" element={<Alerts />} />

        {/* Police-only workflows */}
        <Route
          path="/efir/:alertId"
          element={<RequireRole role="police"><EfirFiling /></RequireRole>}
        />

        {/* Common informational pages */}
        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

