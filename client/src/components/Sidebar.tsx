import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, LogOut,
  ChevronLeft, ChevronRight, ShieldCheck,
  Clock, Bell,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNotifications } from '../context/NotificationContext';

const Badge: React.FC<{ count: number; collapsed: boolean }> = ({ count, collapsed }) => {
  if (!count) return null;
  return (
    <span className={`flex-shrink-0 flex items-center justify-center rounded-full bg-red-500 text-white font-bold leading-none ${
      collapsed ? 'absolute -top-1 -right-1 w-4 h-4 text-[9px]' : 'min-w-[18px] h-[18px] px-1 text-[10px]'
    }`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { admin, logout } = useAdminAuth();
  const { counts } = useNotifications();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard',              badge: 0 },
    { to: '/admin/users',     icon: Users,            label: 'Users',                  badge: 0 },
    { to: '/admin/packages',  icon: Package,          label: 'Packages',               badge: 0 },
    { to: '/admin/expire-reminders', icon: Clock,     label: 'Expire Reminders',       badge: counts.expire },
    { to: '/admin/other-reminders',  icon: Bell,      label: 'Other Reminders',        badge: counts.other  },
  ];

  return (
    <aside className={`relative flex flex-col h-screen bg-slate-900 border-r border-slate-700/60 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/60">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <ShieldCheck size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight whitespace-nowrap">BloomAudit</p>
            <p className="text-slate-400 text-xs whitespace-nowrap">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="relative flex-shrink-0">
              <Icon size={18} />
              {collapsed && <Badge count={badge} collapsed={true} />}
            </span>
            {!collapsed && (
              <>
                <span className="whitespace-nowrap flex-1">{label}</span>
                <Badge count={badge} collapsed={false} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="border-t border-slate-700/60 px-2 py-3 space-y-1">
        {!collapsed && admin && (
          <div className="px-3 py-2 rounded-xl bg-slate-800/60 mb-2">
            <p className="text-white text-xs font-semibold truncate">{admin.name}</p>
            <p className="text-slate-400 text-xs truncate">{admin.email}</p>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};

export default Sidebar;
