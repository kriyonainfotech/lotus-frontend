import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

// Simple Settings mockup
const Settings = () => (
  <div className="animate-in fade-in duration-500">
    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
    <p className="text-slate-500 mt-1">Configure your platform preferences.</p>
    <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        Profile Information
      </h3>
      <p className="text-slate-500 text-sm mb-6">
        Update your account details and email address.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            defaultValue="Lotus Platform"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Support Email
          </label>
          <input
            type="text"
            defaultValue="support@lotus.com"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50"
          />
        </div>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold mt-4 shadow-lg shadow-primary-100">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
