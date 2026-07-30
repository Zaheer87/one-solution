'use client';

import React, { useState, useEffect } from 'react';
import { getServices, saveService, deleteService, getCategories } from '@/lib/appwrite/services';
import { ServiceItem, Category } from '@/lib/types';
import { Plus, Trash2, Edit2, Zap, Loader2 } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(5000); // in paise (50.00)
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    Promise.all([getServices(), getCategories()]).then(([srvs, cats]) => {
      setServices(srvs);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.$id === id)?.name || id;
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const newService: ServiceItem = {
      $id: 'srv-' + Date.now(),
      name,
      categoryId,
      description,
      basePrice,
      durationMinutes,
      isActive,
    };
    try {
      await saveService(newService);
      setServices((prev) => [...prev, newService]);
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      console.error('[AdminServices] save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setDeletingId(id);
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.$id !== id));
    } catch (err) {
      console.error('[AdminServices] delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (srv: ServiceItem) => {
    const updated = { ...srv, isActive: !srv.isActive };
    try {
      await saveService(updated);
      setServices((prev) =>
        prev.map((s) => (s.$id === srv.$id ? updated : s))
      );
    } catch (err) {
      console.error('[AdminServices] toggle failed:', err);
    }
  };

  const resetForm = () => {
    setName('');
    setCategoryId('');
    setDescription('');
    setBasePrice(5000);
    setDurationMinutes(60);
    setIsActive(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Service Definitions</h1>
          <p className="text-sm text-slate-400">Manage the services available for booking</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(!isFormOpen);
          }}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-2"
        >
          {isFormOpen ? 'Close Form' : <><Plus className="w-4 h-4" /> Add Service</>}
        </button>
      </div>

      {isFormOpen && (
        <div className="glass-card p-6 rounded-2xl border border-sky-500/30 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Create New Service</h2>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-sky-500">
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.$id} value={c.$id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-sky-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Base Price ($) - Decimal Allowed</label>
                <input required type="number" step="0.01" value={basePrice / 100} onChange={e => setBasePrice(parseFloat(e.target.value) * 100)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                <input required type="number" value={durationMinutes} onChange={e => setDurationMinutes(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-sky-500" />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-sky-500" />
                <label className="text-sm font-semibold text-slate-300">Active (Visible to Clients)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition">Cancel</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {services.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400">No services defined yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv.$id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
                    {getCategoryName(srv.categoryId)}
                  </span>
                  <button
                    onClick={() => handleToggleActive(srv)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider transition ${
                      srv.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {srv.isActive ? 'Active' : 'Draft'}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{srv.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">{srv.description}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-end justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-500">Base Rate</span>
                  <span className="text-xl font-bold text-sky-400">${(srv.basePrice / 100).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{srv.durationMinutes} mins est.</span>
                  <button
                    onClick={() => handleDeleteService(srv.$id)}
                    disabled={deletingId === srv.$id}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition disabled:opacity-40"
                    title="Remove Service"
                  >
                    {deletingId === srv.$id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
