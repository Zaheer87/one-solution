'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getBookings, getTechnicians, getLeads, getServices } from '@/lib/appwrite/services';
import { seedFirestoreIfEmpty } from '@/lib/seed-data';
import { Booking, TechnicianProfile, EnterpriseLead, ServiceItem } from '@/lib/types';
import {
  ShieldAlert,
  DollarSign,
  Calendar,
  Users,
  Building2,
  Wrench,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [leads, setLeads] = useState<EnterpriseLead[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Seed Firestore with initial data if empty (first-time setup)
      await seedFirestoreIfEmpty();

      const [b, t, l, s] = await Promise.all([
        getBookings(),
        getTechnicians(),
        getLeads(),
        getServices(),
      ]);
      setBookings(b);
      setTechnicians(t);
      setLeads(l);
      setServices(s);
      setLoading(false);
    };
    init().catch((e) => {
      console.error('[AdminDashboard]', e);
      setLoading(false);
    });
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingTechs = technicians.filter((t) => t.status === 'pending');
  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'in_progress'
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Admin Management Hub</h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">Platform operational metrics, technician approvals, and service management</p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              Syncing live data...
            </div>
          )}
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">${totalRevenue.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" /> Live Gross Volume
            </span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Active Bookings</span>
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-sky-400">{activeBookings.length}</div>
            <span className="text-[11px] text-slate-500">{bookings.length} Total Bookings</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Technicians</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-400">{technicians.length}</div>
            <span className="text-[11px] text-amber-400 font-semibold">
              {pendingTechs.length} Pending Approval
            </span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">B2B Enterprise Leads</span>
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-400">{leads.length}</div>
            <span className="text-[11px] text-slate-500">Corporate Requests</span>
          </div>
        </div>

        {/* Admin Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/admin/bookings" className="p-5 glass-card rounded-2xl border border-slate-800 hover:border-sky-500/40 transition group">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-sky-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-bold text-white text-base">Bookings Master</h4>
            <p className="text-xs text-slate-400 mt-1">Assign techs and manage status</p>
          </Link>

          <Link href="/admin/technicians" className="p-5 glass-card rounded-2xl border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-amber-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-bold text-white text-base">Tech Verifications</h4>
            <p className="text-xs text-slate-400 mt-1">Approve/reject pending techs</p>
          </Link>

          <Link href="/admin/services" className="p-5 glass-card rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition group">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-6 h-6 text-emerald-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-bold text-white text-base">Service Catalog</h4>
            <p className="text-xs text-slate-400 mt-1">Add or edit services & rates</p>
          </Link>

          <Link href="/admin/leads" className="p-5 glass-card rounded-2xl border border-slate-800 hover:border-purple-500/40 transition group">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-6 h-6 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-bold text-white text-base">B2B Leads</h4>
            <p className="text-xs text-slate-400 mt-1">Manage corporate RFPs</p>
          </Link>
        </div>

        {/* Recent Platform Bookings Table */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Recent Platform Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">No bookings yet.</td>
                  </tr>
                ) : (
                  bookings.slice(0, 10).map((b) => (
                    <tr key={b.$id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">#{b.$id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{b.clientName}</td>
                      <td className="py-3 px-4">{b.serviceName}</td>
                      <td className="py-3 px-4 text-slate-400">{b.technicianName || 'Unassigned'}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-sky-400">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">${b.totalPrice}</td>
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
