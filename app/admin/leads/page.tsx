'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getLeads, updateLeadStatus } from '@/lib/appwrite/services';
import { EnterpriseLead } from '@/lib/types';
import { Building2, Loader2 } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<EnterpriseLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    getLeads()
      .then(setLeads)
      .catch((e) => console.error('[AdminLeads]', e))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (leadId: string, status: EnterpriseLead['status']) => {
    setUpdatingId(leadId);
    try {
      await updateLeadStatus(leadId, status);
      setLeads((prev) => prev.map((l) => (l.$id === leadId ? { ...l, status } : l)));
    } catch (e) {
      console.error('[AdminLeads] status update failed:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">B2B Commercial RFPs & Leads</h1>
          <p className="text-xs text-slate-400">Manage incoming enterprise facility maintenance inquiries and status</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading leads from Firestore...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No enterprise leads yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">Service Required</th>
                    <th className="py-3 px-4">Sites</th>
                    <th className="py-3 px-4">Pipeline Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leads.map((l) => (
                    <tr key={l.$id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{l.companyName}</div>
                        <div className="text-[11px] text-slate-400">{l.notes}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{l.contactName}</div>
                        <div className="text-[11px] text-slate-400">{l.email} • {l.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-teal-400">{l.serviceType}</td>
                      <td className="py-3 px-4 font-bold text-white">{l.estimatedLocations} Locations</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={l.status}
                            onChange={(e) => handleStatusChange(l.$id, e.target.value as EnterpriseLead['status'])}
                            disabled={updatingId === l.$id}
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-purple-400 focus:border-purple-500 outline-none disabled:opacity-50"
                          >
                            <option value="new">new</option>
                            <option value="contacted">contacted</option>
                            <option value="converted">converted</option>
                            <option value="closed">closed</option>
                          </select>
                          {updatingId === l.$id && <Loader2 className="w-3 h-3 animate-spin text-slate-500" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
