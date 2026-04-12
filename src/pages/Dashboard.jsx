import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserMinus,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Shield
} from 'lucide-react';
import api from '../services/api';

const StatCard = ({ title, value, trend, trendValue, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
        <p className="text-slate-500 font-medium">Crunching real-time data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Welcome back, here's what's happening today in your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend="up"
          trendValue={`+${stats?.growth || 0}%`}
          color="bg-slate-900"
        />
        <StatCard
          title="Regular Users"
          value={stats?.userCount || 0}
          icon={UserCheck}
          trend="up"
          trendValue="+5.2%"
          color="bg-slate-900"
        />
        <StatCard
          title="Admins"
          value={stats?.adminCount || 0}
          icon={Shield}
          trend="up"
          trendValue="+1"
          color="bg-slate-900"
        />
        {/* <StatCard
          title="Signups (Today)"
          value={stats?.recentUsers?.length || 0}
          icon={TrendingUp}
          trend="up"
          trendValue="+8.1%"
          color="bg-slate-900"
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Signups</h3>
            <button className="text-slate-900 text-sm font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-6">
            {stats?.recentUsers?.map((u, i) => (
              <div key={u._id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                  {u.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{u.name || 'Anonymous User'}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {u.email} • {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${u.role === 'admin' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                  {u.role}
                </span>
              </div>
            ))}
            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <p className="text-center py-4 text-slate-500">No recent signups yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">User Distribution</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600">Regular Users</span>
                <span className="text-slate-900">
                  {stats?.totalUsers ? Math.round((stats.userCount / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-900 h-2 rounded-full" style={{ width: `${stats?.totalUsers ? (stats.userCount / stats.totalUsers) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600">Admins</span>
                <span className="text-slate-900">
                  {stats?.totalUsers ? Math.round((stats.adminCount / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${stats?.totalUsers ? (stats.adminCount / stats.totalUsers) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
