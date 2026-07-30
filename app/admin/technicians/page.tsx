'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getTechnicians, updateTechnicianStatus, getCategories } from '@/lib/appwrite/services';
import { TechnicianProfile, Category } from '@/lib/types';
import { CheckCircle2, XCircle, User, Loader2 } from 'lucide-react';

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getTechnicians(), getCategories()])
      .then(([techs, cats]) => {
        setTechnicians(techs);
        setCategories(cats);
      })
      .catch((e) => console.error('[AdminTechnicians]', e))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (techId: string, newStatus: TechnicianProfile['status']) => {
    setUpdatingId(techId);
    try {
      await updateTechnicianStatus(techId, newStatus);
      setTechnicians((prev) =>
        prev.map((t) => (t.$id === techId ? { ...t, status: newStatus } : t))
      );
    } catch (e) {
      console.error('[AdminTechnicians] status update failed:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.$id === id)?.name || id;
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">Technician Verification Hub</h1>
          <p className="text-xs text-slate-400">
            Review pending technician applications, verify credentials, and grant dispatch access
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Loading technicians from Appwrite...</span>
          </div>
        ) : technicians.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-500">
            No technicians registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech) => (
              <div key={tech.$id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        tech.status === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : tech.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {tech.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">${(tech.hourlyRate / 100).toFixed(2)}/hr</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {tech.avatarUrl ? (
                      <img
                        src={tech.avatarUrl}
                        alt={tech.userId}
                        className="w-12 h-12 rounded-full object-cover border border-amber-500/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-base">User: {tech.userId.slice(-6)}</h3>
                      {/* Name and Email should ideally come from UserProfile relation.
                          For admin view, we'd fetch the user profiles and map them.
                          Since they are removed from tech schema to avoid duplication,
                          we just show user ID and rating here for now. */}
                      <p className="text-xs text-sky-400 font-semibold">{tech.averageRating} ★ ({tech.reviewCount} revs)</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 line-clamp-3 italic">&quot;{tech.bio}&quot;</p>

                  <div className="space-y-1 text-xs text-slate-400 mb-4">
                    <div><strong>Experience:</strong> {tech.experienceYears} Years</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tech.categoryIds.map((c) => (
                        <span key={c} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-sky-400 rounded text-[10px]">
                          {getCategoryName(c)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(tech.$id, 'verified')}
                    disabled={tech.status === 'verified' || updatingId === tech.$id}
                    className="py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-40 flex items-center justify-center gap-1"
                  >
                    {updatingId === tech.$id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(tech.$id, 'rejected')}
                    disabled={tech.status === 'rejected' || updatingId === tech.$id}
                    className="py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded-xl text-xs border border-rose-500/30 transition disabled:opacity-40 flex items-center justify-center gap-1"
                  >
                    {updatingId === tech.$id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
