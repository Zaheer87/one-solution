'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getBookingById, updateBooking } from '@/lib/appwrite/services';
import { Booking } from '@/lib/types';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  ArrowLeft,
  Camera,
  Play,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function TechnicianJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [completionNotes, setCompletionNotes] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    setLoading(true);
    getBookingById(id)
      .then((data) => {
        if (data) {
          setJob(data);
          if (data.completionNotes) setCompletionNotes(data.completionNotes);
          if (data.completionProofUrl) setProofUrl(data.completionProofUrl);
        } else {
          setNotFound(true);
        }
      })
      .catch((e) => {
        console.error('[TechJobDetail]', e);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [params?.id]);

  const handleUpdateStatus = async (newStatus: Booking['status']) => {
    if (!job) return;
    setIsUpdating(true);
    const updates: Partial<Booking> = {
      status: newStatus,
      ...(newStatus === 'completed' && {
        completionNotes,
        completionProofUrl: proofUrl,
      }),
    };
    try {
      await updateBooking(job.$id, updates);
      setJob((prev) => prev ? { ...prev, ...updates } : prev);
      setUpdateSuccess(
        newStatus === 'in_progress'
          ? 'Job marked as In Progress!'
          : 'Job marked as Completed! Payout is now ready.'
      );
      setTimeout(() => setUpdateSuccess(''), 4000);
    } catch (e) {
      console.error('[TechJobDetail] update failed:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading job details...</span>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold text-white mb-2">Job Not Found</h2>
        <button
          onClick={() => router.push('/technician')}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
        >
          Back to Technician Portal
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['technician', 'admin']}>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <button
          onClick={() => router.push('/technician')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Technician Portal
        </button>

        {updateSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-sm text-emerald-400 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {updateSuccess}
          </div>
        )}

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                  Job #{job.$id}
                </span>
                <span className="text-xs font-bold text-white uppercase bg-slate-800 px-3 py-1 rounded-full">
                  {job.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">{job.serviceName}</h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Job Payout</span>
              <span className="text-2xl font-black text-emerald-400">${job.totalPrice}</span>
            </div>
          </div>

          {/* Status Action Bar */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Update Dispatch Status</h4>
            <div className="flex flex-wrap gap-3">
              {job.status === 'confirmed' && (
                <button
                  onClick={() => handleUpdateStatus('in_progress')}
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Start Work (Mark In Progress)
                </button>
              )}

              {job.status === 'in_progress' && (
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={isUpdating || !completionNotes}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Mark Job Completed & Claim Payout
                </button>
              )}

              {job.status === 'completed' && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> Job Completed & Payout Ready
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client & Timing Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Customer Details</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <User className="w-4 h-4 text-sky-400" />
                <span>Customer: <strong>{job.clientName}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Phone: <strong>{job.clientPhone}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Address: <strong>{job.address}</strong></span>
              </div>
              {job.notes && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 mt-2">
                  <span className="block font-semibold text-slate-300 mb-1">Customer Notes:</span>
                  {job.notes}
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Appointment Timing</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Scheduled Date: <strong>{job.bookingDate}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Slot Window: <strong>{job.timeSlot}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Proof Form */}
        {(job.status === 'in_progress' || job.status === 'completed') && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" /> Work Completion Proof & Notes
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technician Work Summary & Actions Taken {job.status === 'in_progress' ? '*' : ''}
                </label>
                <textarea
                  rows={3}
                  disabled={job.status === 'completed'}
                  value={completionNotes || job.completionNotes || ''}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Describe parts replaced, tests conducted, and safety checks completed..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 resize-none outline-none disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Completion Photo URL (Image link as proof of work)
                </label>
                <input
                  type="text"
                  disabled={job.status === 'completed'}
                  value={proofUrl || job.completionProofUrl || ''}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 outline-none disabled:opacity-75"
                />
              </div>

              {(proofUrl || job.completionProofUrl) && (
                <div className="pt-2">
                  <span className="block text-xs font-semibold text-slate-400 mb-2">Preview Image:</span>
                  <div className="rounded-2xl overflow-hidden max-w-sm border border-slate-800">
                    <img
                      src={proofUrl || job.completionProofUrl}
                      alt="Work Completion Proof"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
