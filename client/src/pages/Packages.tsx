import React, { useEffect, useState, useRef } from 'react';
import {
  Package, Users, DollarSign, CheckCircle, XCircle,
  CalendarDays, RefreshCw, Plus, X, Trash2, GripVertical,
} from 'lucide-react';
import api from '../api/axios';
import AdminLayout from '../layouts/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';

interface PackageData {
  package_name: string;
  plan_type: string;
  package_price: number;
  description: string;
  features: string[];
  max_users: number | null;
  total_subscribers: string;
  active_subscribers: string;
  suspended_subscribers: string;
  revenue: string;
}

interface FormState {
  name: string;
  plan_type: 'monthly' | 'yearly';
  price: string;
  max_users: string;
  description: string;
  features: string[];
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  name: '',
  plan_type: 'monthly',
  price: '',
  max_users: '',
  description: '',
  features: [''],
  is_active: true,
};

type Tab = 'monthly' | 'yearly';

function getTier(name: string) {
  if (name.startsWith('Enterprise')) return 'Enterprise';
  if (name.startsWith('Pro')) return 'Pro';
  return 'Basic';
}

const tierStyles: Record<string, {
  gradient: string; border: string; accent: string;
  badge: string; barColor: string; iconBg: string;
}> = {
  Basic: {
    gradient: 'from-slate-800/80 to-slate-800/40',
    border: 'border-slate-600/50',
    accent: 'text-slate-300',
    badge: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
    barColor: 'from-slate-400 to-slate-300',
    iconBg: 'bg-slate-700/60',
  },
  Pro: {
    gradient: 'from-blue-900/40 to-slate-800/50',
    border: 'border-blue-500/30',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    barColor: 'from-blue-500 to-blue-400',
    iconBg: 'bg-blue-500/15',
  },
  Enterprise: {
    gradient: 'from-indigo-900/40 to-slate-800/50',
    border: 'border-indigo-500/30',
    accent: 'text-indigo-400',
    badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    barColor: 'from-indigo-500 to-purple-400',
    iconBg: 'bg-indigo-500/15',
  },
};

// ── Input helper ──────────────────────────────────────────────────────────────
const Field: React.FC<{ label: string; required?: boolean; hint?: string; children: React.ReactNode }> = ({
  label, required, hint, children,
}) => (
  <div>
    <label className="flex items-center gap-1 text-slate-300 text-sm font-medium mb-1.5">
      {label}
      {required && <span className="text-red-400 text-xs">*</span>}
    </label>
    {children}
    {hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
  </div>
);

const inputCls =
  'w-full bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all';

// ── Main component ────────────────────────────────────────────────────────────
const Packages: React.FC = () => {
  const { token } = useAdminAuth();

  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('monthly');

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const newFeatureRef = useRef<HTMLInputElement>(null);

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/admin/packages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPackages(res.data.packages);
    } catch {
      setError('Failed to load package data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, [token]);

  // ── Form helpers ────────────────────────────────────────────────────────────
  const openDrawer = () => { setForm(EMPTY_FORM); setFormError(''); setDrawerOpen(true); };
  const closeDrawer = () => setDrawerOpen(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const setFeature = (idx: number, val: string) =>
    setForm(f => {
      const arr = [...f.features];
      arr[idx] = val;
      return { ...f, features: arr };
    });

  const addFeature = () => {
    setForm(f => ({ ...f, features: [...f.features, ''] }));
    setTimeout(() => newFeatureRef.current?.focus(), 50);
  };

  const removeFeature = (idx: number) =>
    setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanFeatures = form.features.map(f => f.trim()).filter(Boolean);

    if (!form.name.trim()) return setFormError('Package name is required.');
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0)
      return setFormError('Enter a valid price greater than 0.');

    setSubmitting(true);
    try {
      await api.post(
        '/api/admin/packages',
        {
          name: form.name.trim(),
          price: parseFloat(form.price),
          plan_type: form.plan_type,
          description: form.description.trim() || null,
          max_users: form.max_users ? parseInt(form.max_users) : null,
          features: cleanFeatures,
          is_active: form.is_active,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeDrawer();
      // Switch to the tab matching the new package's plan type
      setTab(form.plan_type);
      await fetchPackages();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create package.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived stats ───────────────────────────────────────────────────────────
  const filtered = packages.filter(p => p.plan_type === tab);
  const totalRevenue = packages.reduce((s, p) => s + parseFloat(p.revenue || '0'), 0);
  const totalSubscribers = packages.reduce((s, p) => s + parseInt(p.total_subscribers || '0'), 0);
  const totalActive = packages.reduce((s, p) => s + parseInt(p.active_subscribers || '0'), 0);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Packages" subtitle="Subscription plans and subscriber statistics">
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 gap-2 text-sm">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading packages...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">{error}</div>
      ) : (
        <div className="space-y-6">

          {/* Summary + Add button row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="grid grid-cols-3 gap-3 flex-1">
              {/* Total plans */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Total Plans</p>
                  <p className="text-white text-lg font-bold">{packages.length}</p>
                </div>
              </div>
              {/* Subscribers */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <Users size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Subscribers</p>
                  <p className="text-white text-lg font-bold">{totalSubscribers}</p>
                  <p className="text-slate-500 text-xs">{totalActive} active</p>
                </div>
              </div>
              {/* Revenue */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <DollarSign size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Revenue</p>
                  <p className="text-white text-lg font-bold">
                    ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Add package button */}
            <button
              onClick={openDrawer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 active:scale-[0.97] transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap"
            >
              <Plus size={16} />
              Add Package
            </button>
          </div>

          {/* Tab toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/60 border border-slate-700/60 rounded-xl w-fit">
            <button
              onClick={() => setTab('monthly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RefreshCw size={13} />
              Monthly
            </button>
            <button
              onClick={() => setTab('yearly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === 'yearly'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays size={13} />
              Yearly
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                Save 20%
              </span>
            </button>
          </div>

          {/* Package cards */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm border border-dashed border-slate-700 rounded-2xl">
              <Package size={36} className="mb-2 opacity-30" />
              No {tab} packages yet.
              <button onClick={openDrawer} className="mt-3 text-blue-400 hover:text-blue-300 text-xs underline underline-offset-2">
                Add one now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filtered.map(pkg => {
                const tier = getTier(pkg.package_name);
                const cfg = tierStyles[tier] ?? tierStyles.Basic;
                const activeCount = parseInt(pkg.active_subscribers || '0');
                const totalCount = parseInt(pkg.total_subscribers || '0');
                const activePct = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
                const cycle = pkg.plan_type === 'monthly' ? 'mo' : 'yr';
                const features: string[] = Array.isArray(pkg.features) ? pkg.features : [];

                return (
                  <div key={pkg.package_name} className={`bg-gradient-to-br ${cfg.gradient} border ${cfg.border} rounded-2xl p-5 flex flex-col gap-4`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.badge}`}>
                          {pkg.package_name}
                        </span>
                        <p className={`text-2xl font-bold mt-2 ${cfg.accent}`}>
                          ${Number(pkg.package_price).toFixed(2)}
                          <span className="text-sm font-normal text-slate-400 ml-1">/{cycle}</span>
                        </p>
                        {pkg.description && (
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2">{pkg.description}</p>
                        )}
                      </div>
                      <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Package size={18} className={cfg.accent} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-slate-400" />
                      <span className="text-slate-300 text-xs">
                        {pkg.max_users != null ? `Up to ${pkg.max_users} users` : 'Unlimited users'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Total', value: pkg.total_subscribers, icon: <Users size={11} />, color: '' },
                        { label: 'Active', value: pkg.active_subscribers, icon: <CheckCircle size={11} />, color: 'text-emerald-400' },
                        { label: 'Suspended', value: pkg.suspended_subscribers, icon: <XCircle size={11} />, color: 'text-red-400' },
                        { label: 'Revenue', value: `$${parseFloat(pkg.revenue || '0').toFixed(0)}`, icon: <DollarSign size={11} />, color: 'text-amber-400' },
                      ].map(item => (
                        <div key={item.label} className="bg-slate-900/30 rounded-xl p-2.5">
                          <div className={`flex items-center gap-1 text-xs mb-1 ${item.color || 'text-slate-400'}`}>
                            {item.icon}{item.label}
                          </div>
                          <p className="text-white text-base font-bold">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Active Rate</span>
                        <span className="text-white font-medium">{activePct}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                        <div className={`bg-gradient-to-r ${cfg.barColor} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${activePct}%` }} />
                      </div>
                    </div>

                    {features.length > 0 && (
                      <div className="border-t border-slate-700/40 pt-3">
                        <p className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">Includes</p>
                        <ul className="space-y-1.5">
                          {features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-slate-300 text-xs">
                              <CheckCircle size={11} className={cfg.accent} />{f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Drawer backdrop ───────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeDrawer}
        />
      )}

      {/* ── Drawer ────────────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700/60 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-500/20 flex items-center justify-center">
              <Package size={15} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Add Package</h2>
              <p className="text-slate-400 text-xs">Create a new subscription plan</p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Error */}
          {formError && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <XCircle size={15} className="mt-0.5 flex-shrink-0" />
              {formError}
            </div>
          )}

          {/* Name */}
          <Field label="Package Name" required>
            <input
              type="text"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              placeholder="e.g. Starter, Growth, Ultimate…"
              className={inputCls}
            />
          </Field>

          {/* Plan type toggle */}
          <Field label="Billing Cycle" required>
            <div className="flex gap-1 p-1 bg-slate-800/60 border border-slate-700 rounded-xl">
              {(['monthly', 'yearly'] as const).map(pt => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setField('plan_type', pt)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    form.plan_type === pt
                      ? pt === 'monthly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pt === 'monthly' ? <RefreshCw size={13} /> : <CalendarDays size={13} />}
                  {pt.charAt(0).toUpperCase() + pt.slice(1)}
                </button>
              ))}
            </div>
          </Field>

          {/* Price + Max users */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price" required hint={`Per ${form.plan_type === 'monthly' ? 'month' : 'year'}`}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={e => setField('price', e.target.value)}
                  placeholder="0.00"
                  className={`${inputCls} pl-7`}
                />
              </div>
            </Field>
            <Field label="Max Users" hint="Leave blank for unlimited">
              <input
                type="number"
                min="1"
                value={form.max_users}
                onChange={e => setField('max_users', e.target.value)}
                placeholder="Unlimited"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description" hint="Short description shown on the package card">
            <textarea
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Describe who this plan is for…"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Features */}
          <Field label="Features" hint="Each line is a bullet point on the package card">
            <div className="space-y-2">
              {form.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-600 flex-shrink-0" />
                  <input
                    ref={idx === form.features.length - 1 ? newFeatureRef : undefined}
                    type="text"
                    value={feat}
                    onChange={e => setFeature(idx, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder={`Feature ${idx + 1}`}
                    className={inputCls}
                  />
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors mt-1"
              >
                <Plus size={13} />
                Add feature
              </button>
            </div>
          </Field>

          {/* Active toggle */}
          <Field label="Status">
            <button
              type="button"
              onClick={() => setField('is_active', !form.is_active)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border w-full transition-all ${
                form.is_active
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}
            >
              <div className={`w-9 h-5 rounded-full transition-all relative ${form.is_active ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_active ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-sm font-medium">{form.is_active ? 'Active — visible to users' : 'Inactive — hidden from users'}</span>
            </button>
          </Field>
        </form>

        {/* Drawer footer */}
        <div className="px-6 py-4 border-t border-slate-700/60 flex gap-3">
          <button
            type="button"
            onClick={closeDrawer}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating…
              </>
            ) : (
              <>
                <Plus size={15} />
                Create Package
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Packages;
