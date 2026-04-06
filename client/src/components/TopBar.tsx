import React, { useState, useRef, useEffect } from 'react';
import { Bell, Clock, AlertTriangle, CheckCircle, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNotifications, Notification } from '../context/NotificationContext';

const typeIcon: Record<string, React.ReactNode> = {
  expire_warning:      <Clock size={13} className="text-amber-400" />,
  user_limit_exceeded: <AlertTriangle size={13} className="text-red-400" />,
};

const typeBg: Record<string, string> = {
  expire_warning:      'bg-amber-500/10 border-amber-500/20',
  user_limit_exceeded: 'bg-red-500/10 border-red-500/20',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface TopBarProps { title: string; subtitle?: string; }

const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { admin } = useAdminAuth();
  const { notifications, counts, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const recent = notifications.slice(0, 6);

  const handleNotifClick = (n: Notification) => {
    if (!n.is_read) markRead(n.id);
    setOpen(false);
    if (n.type === 'expire_warning')      navigate('/admin/expire-reminders');
    else                                  navigate('/admin/other-reminders');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-sm relative z-30">
      <div>
        <h1 className="text-white text-xl font-bold">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3" ref={ref}>

        {/* Bell button */}
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
              open ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Bell size={16} />
            {counts.total > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                {counts.total > 99 ? '99+' : counts.total}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-11 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-blue-400" />
                  <span className="text-white text-sm font-semibold">Notifications</span>
                  {counts.total > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">{counts.total}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {counts.total > 0 && (
                    <button onClick={() => markAllRead()} className="text-slate-400 hover:text-blue-400 text-xs transition-colors">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/40">
                {recent.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-sm">
                    <CheckCircle size={24} className="mb-2 opacity-40" />
                    All caught up!
                  </div>
                ) : recent.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-700/40 transition-colors flex items-start gap-3 ${!n.is_read ? 'bg-slate-700/20' : ''}`}
                  >
                    <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center ${typeBg[n.type] ?? 'bg-slate-700/50 border-slate-600/50'}`}>
                      {typeIcon[n.type] ?? <Bell size={11} className="text-slate-400" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-xs font-semibold truncate">{n.title}</p>
                        {!n.is_read && <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                      <p className="text-slate-600 text-xs mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-700/60 grid grid-cols-2 divide-x divide-slate-700/60">
                <button
                  onClick={() => { setOpen(false); navigate('/admin/expire-reminders'); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs text-slate-400 hover:text-amber-400 hover:bg-amber-500/5 transition-all"
                >
                  <Clock size={12} /> Expire ({counts.expire})
                </button>
                <button
                  onClick={() => { setOpen(false); navigate('/admin/other-reminders'); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                >
                  <ExternalLink size={12} /> Other ({counts.other})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin profile chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {admin?.name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-xs font-semibold leading-tight">{admin?.name ?? 'Admin'}</p>
            <p className="text-slate-400 text-xs leading-tight">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
