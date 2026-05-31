import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import { useAppStore } from './stores/appStore';

// Placeholder pages
function Users() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400">User management coming soon...</p>
      </div>
    </div>
  );
}

function Inbounds() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inbounds</h1>
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400">Inbound management coming soon...</p>
      </div>
    </div>
  );
}

function Subscriptions() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400">Subscription management coming soon...</p>
      </div>
    </div>
  );
}

function Alerts() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h1>
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400">Alert management coming soon...</p>
      </div>
    </div>
  );
}

function Admin() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400">Admin controls coming soon...</p>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400">Settings panel coming soon...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="servers" element={<Servers />} />
        <Route path="users" element={<Users />} />
        <Route path="inbounds" element={<Inbounds />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="admin" element={<Admin />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}