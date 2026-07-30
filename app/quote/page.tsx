'use client';

import React, { useState } from 'react';
import { createLead } from '@/lib/appwrite/services';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('HVAC & Electrical Maintenance');
  const [estimatedLocations, setEstimatedLocations] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await createLead({
        companyName,
        contactName,
        email,
        phone,
        serviceType,
        estimatedLocations,
        notes,
        status: 'new',
        $createdAt: new Date().toDateString().toString()
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('[QuotePage] createLead failed:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Quote Request Received!</h2>
          <p className="text-sm text-slate-300">
            Thank you, <span className="text-teal-400 font-semibold">{contactName}</span> from <span className="font-semibold text-white">{companyName}</span>. Our corporate dispatch director will review your requirements and respond within 2 business hours.
          </p>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 text-left">
            <div className="font-semibold text-white mb-1">Direct Enterprise Hotline</div>
            Priority Phone: +1 (800) 555-SERV (7378)
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Info Column */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-full border border-teal-500/20 inline-block mb-3">
              Corporate & Property Managers
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              Custom Commercial Service Pricing
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Streamline multi-site facility maintenance, regular HVAC servicing, electrical compliance, and emergency response with a single master service agreement.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-teal-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Multi-Location Centralization</h4>
                <p className="text-xs text-slate-400">Single dashboard for tracking all work orders across your portfolio.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Guaranteed Response SLA</h4>
                <p className="text-xs text-slate-400">Priority technician dispatch with guaranteed emergency response times.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white">Request Proposal</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Apex Commercial Properties"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="David Sterling"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dsterling@apex.com"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 300-4000"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Service Needed</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:border-teal-500"
                  >
                    <option value="HVAC & Electrical Maintenance">HVAC & Electrical Maintenance</option>
                    <option value="Plumbing & Water Infrastructure">Plumbing & Water Infrastructure</option>
                    <option value="Commercial Cleaning Services">Commercial Cleaning Services</option>
                    <option value="Full Facility Management Contract">Full Facility Management Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Locations</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={estimatedLocations}
                    onChange={(e) => setEstimatedLocations(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Details / SLA Requirements</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide scope overview, timeline, or special access requirements..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:border-teal-500 resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-teal-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting to Firestore...</>
                ) : (
                  <>Submit Quote Request <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
