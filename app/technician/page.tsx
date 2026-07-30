'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  getTechnicianByUserId,
  getBookings,
  getBookingsByTechnician,
  updateTechnicianAvailability,
} from '@/lib/appwrite/services';
import { Booking, TechnicianProfile } from '@/lib/types';
import {
  Briefcase,
  DollarSign,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  User,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';

export default function TechnicianDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [techProfile, setTechProfile] = useState<TechnicianProfile | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    getTechnicianByUserId(user.$id  )
      .then(async (tech) => {
        if (tech) {
          setTechProfile(tech);
          setIsAvailable(tech.isAvailable);
          const assigned = await getBookingsByTechnician(tech.$id);
          setJobs(assigned);
        } else {
          // Fallback: show all bookings if tech profile not found
          const all = await getBookings();
          setJobs(all);
        }
      })
      .catch((e) => console.error('[TechnicianDashboard]', e))
      .finally(() => setLoading(false));
  }, [user]);

  const toggleAvailability = async () => {
    if (!techProfile) return;
    setTogglingAvailability(true);
    const newVal = !isAvailable;
    try {
      await updateTechnicianAvailability(techProfile.$id, newVal);
      setIsAvailable(newVal);
      setTechProfile((prev) => prev ? { ...prev, isAvailable: newVal } : prev);
    } catch (e) {
      console.error('[TechnicianDashboard] toggle availability failed:', e);
    } finally {
      setTogglingAvailability(false);
    }
  };

  const activeJobs = jobs.filter((j) => j.status === 'confirmed' || j.status === 'in_progress');
  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const totalEarnings = completedJobs.reduce((sum, j) => sum + (j.totalPrice / 100), 0);

  return (
    <ProtectedRoute allowedRoles={['technician', 'admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* Header & Availability */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Technician Portal</h1>
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">Welcome back, {user?.name || techProfile?.name || 'Technician'}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Dispatch Status</span>
              <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isAvailable ? '● Available for Jobs' : '○ Offline'}
              </span>
            </div>
            <button
              onClick={toggleAvailability}
              disabled={togglingAvailability || !techProfile}
              className={`p-2 rounded-xl border transition disabled:opacity-50 ${
                isAvailable ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {togglingAvailability ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isAvailable ? (
                <ToggleRight className="w-6 h-6" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Total Earnings</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <span className="text-[11px] text-slate-500">From {completedJobs.length} completed jobs</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Active Queue</span>
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-sky-400">{activeJobs.length}</div>
            <span className="text-[11px] text-slate-500">Jobs pending arrival/completion</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Rating Score</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-400">
              {techProfile?.averageRating?.toFixed(1) || '—'}★
            </div>
            <span className="text-[11px] text-slate-500">
              {techProfile?.reviewCount || 0} client reviews
            </span>
          </div>
        </div>

        {/* Jobs Queue */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-white">Assigned Dispatch Queue</h3>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Loading assigned jobs from Appwrite...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-500">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No jobs assigned yet. Set your status to &quot;Available&quot; to receive dispatch.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((j) => (
                <div
                  key={j.$id}
                  className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                        #{j.$id}
                      </span>
                      <span className="text-xs font-bold text-white capitalize bg-slate-800 px-3 py-1 rounded-full">
                        {j.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">{j.serviceName}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-500" /> {j.clientName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> {j.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {j.bookingDate} ({j.timeSlot})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Payout</span>
                      <span className="text-lg font-bold text-emerald-400">${(j.totalPrice / 100).toFixed(2)}</span>
                    </div>
                    <Link
                      href={`/technician/job/${j.$id}`}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      Open Job Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
