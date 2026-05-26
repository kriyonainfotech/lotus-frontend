import React, { useState, useEffect } from 'react';
import { Plus, IndianRupee, Search, Edit2, Trash2, Save, X, Calendar } from 'lucide-react';
import api from '../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  durationDays: '',
  badge: '',
  featuresText: '',
  isActive: true,
  sortOrder: 0,
};

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
      alert(err.response?.data?.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setCurrentPlan(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setCurrentPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description || '',
      price: String(plan.price),
      durationDays: String(plan.durationDays),
      badge: plan.badge || '',
      featuresText: (plan.features || []).join('\n'),
      isActive: plan.isActive !== false,
      sortOrder: plan.sortOrder ?? 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        badge: form.badge,
        features: form.featuresText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (currentPlan) {
        await api.put(`/plans/${currentPlan._id}`, payload);
      } else {
        await api.post('/plans', payload);
      }

      setShowModal(false);
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Delete this plan permanently?')) return;
    try {
      await api.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deactivating plan');
    }
  };

  const filtered = plans.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pricing Plans</h1>
          <p className="text-slate-500 mt-1">
            Manage packages shown in the app. Duration sets expiry after Razorpay purchase.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          Add Plan
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search plans..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-white rounded-3xl border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((plan) => (
            <div
              key={plan._id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  {plan.badge && (
                    <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-1 rounded-lg">
                      {plan.badge}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                      plan.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-1">{plan.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <IndianRupee size={14} />
                    {plan.price}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {plan.durationDays} days validity
                  </span>
                  <span className="text-slate-400">Order: {plan.sortOrder ?? 0}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(plan)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeactivate(plan._id)}
                  className="p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">{currentPlan ? 'Edit Plan' : 'New Plan'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Plan name</label>
                <input
                  required
                  className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Price (INR)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl outline-none"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Duration (days)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl outline-none"
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Badge (optional)</label>
                  <input
                    className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl outline-none"
                    placeholder="45% OFF"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Sort order</label>
                  <input
                    type="number"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl outline-none"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Features (one per line)</label>
                <textarea
                  className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl outline-none"
                  rows={3}
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <span className="text-sm font-semibold text-slate-700">Visible in mobile app</span>
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPlans;
