'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner CTA for Enterprise & Technicians */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-500/20 flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-xs font-semibold rounded-full border border-sky-500/20 mb-3 inline-block">
                For Enterprises & Property Managers
              </span>
              <h4 className="text-xl font-bold text-white mb-2">Need Commercial Service Management?</h4>
              <p className="text-sm text-slate-400 mb-4">
                Get custom SLAs, dedicated account directors, and bulk volume rates for multi-location facility maintenance.
              </p>
            </div>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold text-sm group"
            >
              Request Custom B2B Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/20 flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20 mb-3 inline-block">
                For Certified Professionals
              </span>
              <h4 className="text-xl font-bold text-white mb-2">Join as a Verified Technician</h4>
              <p className="text-sm text-slate-400 mb-4">
                Expand your client base, set flexible availability, and earn top rates with guaranteed payouts.
              </p>
            </div>
            <Link
              href="/technician/register"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm group"
            >
              Apply as Technician <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-slate-900 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm mb-1">Vetted & Insured Pros</h5>
              <p className="text-xs text-slate-400">Background checks, license verification, and full coverage on every job.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm mb-1">On-Time Guarantee</h5>
              <p className="text-xs text-slate-400">Real-time technician tracking with guaranteed arrival within designated slots.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm mb-1">100% Satisfaction Warranty</h5>
              <p className="text-xs text-slate-400">If you are not satisfied with the work quality, we make it right for free.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">ServiceConnect Hub</span>
            <span className="text-xs text-slate-400">© 2026 ServiceConnect Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/quote" className="hover:text-white transition">Enterprise SLA</Link>
            <Link href="/technician/register" className="hover:text-white transition">Technician Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
