'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getBookings, getTechnicians, updateBooking, getCategories } from '@/lib/appwrite/services';
import { Booking, TechnicianProfile, Category } from '@/lib/types';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getBookings(), getTechnicians('verified'), getCategories()])
      .then(([b, t, cats]) => {
        setBookings(b);
        setTechnicians(t);
        setCategories(cats);
      })
      .catch((e) => console.error('[AdminBookings]', e))
      .finally(() => setLoading(false));
  }, []);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.$id === id)?.name || id;
  };

  const handleAssignTechnician = async (bookingId: string, techId: string) => {
    const tech = technicians.find((t) => t.$id === techId);
    if (!tech) return;
    setSavingId(bookingId);
    try {
      await updateBooking(bookingId, {
        technicianId: tech.$id,
        technicianName: tech.userId, // Can't easily use name, assuming ID for now since normalized schema doesn't duplicate name
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.$id === bookingId ? { ...b, technicianId: tech.$id, technicianName: tech.userId } : b
        )
      );  
    } catch (e) {
      console.error('[AdminBookings] assign failed:', e);
    } finally {
      setSavingId(null);
    }
  };

  const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
    setSavingId(bookingId);
    try {
      await updateBooking(bookingId, { status });
      setBookings((prev) =>
        prev.map((b) => (b.$id === bookingId ? { ...b, status } : b))
      );
    } catch (e) {
      console.error('[AdminBookings] status change failed:', e);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">All Dispatch Bookings</h1>
          <p className="text-xs text-slate-400">Reassign technicians and manually override booking statuses</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Assign Technician</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                      Loading bookings from Appwrite...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.$id} className="hover:bg-slate-900/50 relative">
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">
                        #{b.$id}
                        {savingId === b.$id && (
                          <Loader2 className="w-3 h-3 animate-spin inline ml-2 text-slate-500" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{b.clientName}</div>
                        <div className="text-[11px] text-slate-400">{b.clientPhone}</div>
                      </td>
                      <td className="py-3 px-4 font-medium">{b.serviceName}</td>
                      <td className="py-3 px-4">
                        <select
                          value={b.technicianId || ''}
                          onChange={(e) => handleAssignTechnician(b.$id, e.target.value)}
                          disabled={savingId === b.$id}
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 outline-none disabled:opacity-50"
                        >
                          <option value="">Select Technician</option>
                          {technicians.map((tech) => (
                            <option key={tech.$id} value={tech.$id}>
                              {tech.userId.slice(-6)} ({tech.categoryIds.map(getCategoryName).join(', ')})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.$id, e.target.value as Booking['status'])}
                          disabled={savingId === b.$id}
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-400 font-semibold focus:border-amber-500 outline-none disabled:opacity-50"
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="in_progress">in_progress</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">${(b.totalPrice / 100).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
