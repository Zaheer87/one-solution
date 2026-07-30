'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getTechnicianByUserId, saveTechnician, getCategories } from '@/lib/appwrite/services';
import { TechnicianProfile, Category } from '@/lib/types';
import { User, CheckCircle2, ShieldCheck, DollarSign, Loader2 } from 'lucide-react';

export default function TechnicianProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(65);
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([getTechnicianByUserId(user.$id), getCategories()])
      .then(([tech, cats]) => {
        setCategories(cats);
        if (tech) {
          setProfile(tech);
          setHourlyRate(tech.hourlyRate / 100);
          setBio(tech.bio || '');
        }
      })
      .catch((e) => console.error('[TechProfile]', e))
      .finally(() => setLoading(false));
  }, [user]);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.$id === id)?.name || id;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    const updated: TechnicianProfile = { ...profile, hourlyRate: hourlyRate * 100, bio };
    try {
      await saveTechnician(updated);
      setProfile(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('[TechProfile] save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['technician', 'admin']}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading profile from Appwrite...</span>
            </div>
          ) : !profile ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <p>No technician profile found for your account.</p>
              <p className="text-xs text-slate-500">
                Please register as a technician first via the registration page.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={user?.name || 'Technician'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">{user?.name || 'Technician'}</h1>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-bold rounded-full border flex items-center gap-1 ${
                        profile.status === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : profile.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {profile.status === 'verified' ? 'Approved Pro' : profile.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>

              {isSaved && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully in Appwrite!
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Hourly Rate ($)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="20"
                      max="250"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 outline-none"
                    />
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio & Credentials</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 resize-none outline-none"
                  />
                </div>

                <div className="pt-2">
                  <span className="block text-xs font-semibold text-slate-400 mb-2">Trade Specializations:</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.categoryIds.map((catId) => (
                      <span key={catId} className="px-3 py-1 bg-slate-900 text-sky-400 border border-slate-800 rounded-lg text-xs font-semibold">
                        {getCategoryName(catId)}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving to Appwrite...</>
                  ) : (
                    'Save Profile Changes'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
