'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getBookings, getBookingsByClient } from '@/lib/appwrite/services';
import { Booking } from '@/lib/types';
import { Calendar, Clock, MapPin, Loader2, ChevronRight, PlusCircle } from 'lucide-react';

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchFn = user.role === 'admin' ? getBookings() : getBookingsByClient(user.$id);
    fetchFn
      .then((data) => setBookings(data))
      .catch((e) => console.error('[BookingsPage]', e))
      .finally(() => setLoading(false));
  }, [user]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-xs font-bold rounded-full border border-sky-500/30">Confirmed</span>;
      case 'in_progress':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30 animate-pulse">In Progress</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-full border border-rose-500/30">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full">Pending</span>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client', 'admin']}>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">My Service Bookings</h1>
            <p className="text-xs text-slate-400">Track active dispatches and view complete service history</p>
          </div>
          <Link
            href="/book"
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-sky-500/20 flex items-center gap-1.5 w-fit"
          >
            <PlusCircle className="w-4 h-4" /> Book New Service
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {['all', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                filter === tab
                  ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Loading your bookings...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-800">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You don&apos;t have any bookings in this category yet.
            </p>
            <Link
              href="/book"
              className="inline-block px-6 py-2.5 bg-sky-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Book Your First Service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.$id}
                className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md">
                      #{b.$id}
                    </span>
                    {getStatusBadge(b.status)}
                  </div>
                  <h3 className="text-lg font-bold text-white">{b.serviceName}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {b.bookingDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {b.timeSlot}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {b.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Price</div>
                    <span className="text-xl font-bold text-emerald-400">${(b.totalPrice / 100).toFixed(2)}</span>
                  </div>
                  <Link
                    href={`/bookings/${b.$id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-sky-500 hover:text-slate-950 border border-slate-700 hover:border-sky-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
