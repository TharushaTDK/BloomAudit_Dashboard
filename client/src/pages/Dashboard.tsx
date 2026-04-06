import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, DollarSign, Package, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import AdminLayout from '../layouts/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalRevenue: number;
  packageBreakdown: { package_name: string; count: string }[];
}

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}> = ({ label, value, icon, color, sub }) => (
  <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  </div>
);

const packageColors: Record<string, string> = {
  Basic: 'bg-slate-700 text-slate-300',
  Pro: 'bg-blue-500/20 text-blue-400',
  Enterprise: 'bg-indigo-500/20 text-indigo-400',
};

const packagePrices: Record<string, string> = {
  Basic: '$49.99/mo',
  Pro: '$99.99/yr',
  Enterprise: '$249.99/yr',
};

const Dashboard: React.FC = () => {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setStats(res.data.stats);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your platform">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex gap-2 items-center text-slate-400">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading stats...
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">{error}</div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              icon={<Users size={20} className="text-blue-400" />}
              color="bg-blue-500/15"
              sub="All registered users"
            />
            <StatCard
              label="Active Users"
              value={stats.activeUsers}
              icon={<UserCheck size={20} className="text-emerald-400" />}
              color="bg-emerald-500/15"
              sub={`${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total`}
            />
            <StatCard
              label="Suspended"
              value={stats.suspendedUsers}
              icon={<UserX size={20} className="text-red-400" />}
              color="bg-red-500/15"
              sub="Restricted accounts"
            />
            <StatCard
              label="Active Revenue"
              value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<DollarSign size={20} className="text-amber-400" />}
              color="bg-amber-500/15"
              sub="From active subscriptions"
            />
          </div>

          {/* Package breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <Package size={18} className="text-indigo-400" />
                <h2 className="text-white font-semibold">Package Breakdown</h2>
              </div>
              {stats.packageBreakdown.length === 0 ? (
                <p className="text-slate-500 text-sm">No package data available.</p>
              ) : (
                <div className="space-y-3">
                  {stats.packageBreakdown.map(pkg => {
                    const total = stats.packageBreakdown.reduce((a, b) => a + parseInt(b.count), 0);
                    const pct = total > 0 ? Math.round((parseInt(pkg.count) / total) * 100) : 0;
                    return (
                      <div key={pkg.package_name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${packageColors[pkg.package_name] || 'bg-slate-700 text-slate-300'}`}>
                              {pkg.package_name}
                            </span>
                            <span className="text-slate-500 text-xs">{packagePrices[pkg.package_name] ?? ''}</span>
                          </div>
                          <span className="text-white text-sm font-semibold">{pkg.count} users</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick summary */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={18} className="text-blue-400" />
                <h2 className="text-white font-semibold">Platform Summary</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'User Activation Rate', value: stats.totalUsers > 0 ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%` : '—' },
                  { label: 'Avg Revenue Per User', value: stats.activeUsers > 0 ? `$${(stats.totalRevenue / stats.activeUsers).toFixed(2)}` : '—' },
                  { label: 'Inactive / Suspended', value: stats.suspendedUsers },
                  { label: 'Package Tiers Available', value: stats.packageBreakdown.length },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-700/40 last:border-0">
                    <span className="text-slate-400 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default Dashboard;
