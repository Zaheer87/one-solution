'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServices, getTechnicians, getCategories } from '@/lib/appwrite/services';
import { ServiceItem, TechnicianProfile, Category } from '@/lib/types';
import {
  Wrench,
  Zap,
  Droplet,
  Wind,
  Sparkles,
  Hammer,
  ShieldCheck,
  Star,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
  Building2,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('All');

  useEffect(() => {
    Promise.all([getServices(), getTechnicians('verified'), getCategories()]).then(([srvs, techs, cats]) => {
      setServices(srvs.filter(s => s.isActive));
      setTechnicians(techs.filter(t => t.isAvailable));
      setCategories(cats.filter(c => c.isActive));
    });
  }, []);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.$id === id)?.name || id;
  };

  const getCategoryIcon = (id: string) => {
    return categories.find(c => c.$id === id)?.iconName || 'Wrench';
  };

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategoryId === 'All' || s.categoryId === selectedCategoryId;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Droplets':
        return <Droplet className="w-6 h-6 text-sky-400" />;
      case 'Fan':
        return <Wind className="w-6 h-6 text-teal-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-amber-500" />;
      default:
        return <Wrench className="w-6 h-6 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-sky-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Next-Gen Home & Facility Service Network</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Expert Services, <br />
              <span className="gradient-text">Delivered On-Demand.</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Connect directly with verified electricians, plumbers, HVAC specialists, and technicians. Transparent pricing, guaranteed arrival, and instant booking.
            </p>

            {/* Interactive Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="p-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search service e.g. Electrical, AC Repair, Plumbing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-0"
                />
                <Link
                  href="/book"
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-sky-500/25 whitespace-nowrap flex items-center gap-2"
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800/80">
              <div className="text-center p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-xs text-slate-400 font-medium">Average Rating</div>
              </div>
              <div className="text-center p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-2xl font-bold text-sky-400">100%</div>
                <div className="text-xs text-slate-400 font-medium">Verified Techs</div>
              </div>
              <div className="text-center p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-2xl font-bold text-amber-400">60 Min</div>
                <div className="text-xs text-slate-400 font-medium">Avg Arrival Time</div>
              </div>
              <div className="text-center p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-2xl font-bold text-emerald-400">$0</div>
                <div className="text-xs text-slate-400 font-medium">Hidden Fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES & SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block mb-1">
              Explore Our Expertise
            </span>
            <h2 className="text-3xl font-extrabold text-white">Popular On-Demand Services</h2>
          </div>

          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId('All')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategoryId === 'All'
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.$id}
                onClick={() => setSelectedCategoryId(cat.$id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategoryId === cat.$id
                    ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.$id}
              className="glass-card rounded-2xl overflow-hidden p-6 flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                    {getIconComponent(getCategoryIcon(service.categoryId))}
                  </div>
                  <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                    From ${(service.basePrice / 100).toFixed(2)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Est. {service.durationMinutes} mins</span>
                </div>
                <Link
                  href={`/book?serviceId=${service.$id}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 group-hover:shadow-md"
                >
                  Book Service <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">
              Seamless Process
            </span>
            <h2 className="text-3xl font-extrabold text-white">How ServiceConnect Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-black text-xl mb-4 shadow-inner">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Select Your Service</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose from electrical, plumbing, HVAC, or custom home repair categories with transparent upfront estimates.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-black text-xl mb-4 shadow-inner">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Schedule & Match</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pick your preferred date and time slot. Our algorithm assigns a top-rated, background-checked technician.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xl mb-4 shadow-inner">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Track & Relax</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor job progress in real-time, inspect completion photos, and approve payment only when fully satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP-RATED TECHNICIANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Top Rated Professionals
            </span>
            <h2 className="text-3xl font-extrabold text-white">Meet Our Certified Technicians</h2>
          </div>
          <Link
            href="/technician/register"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            Join Network <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <div key={tech.$id} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 flex-shrink-0">
                    <img
                      src={tech.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}
                      alt={tech.name || tech.userId.slice(-6)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{tech.name || `Pro-${tech.userId.slice(-4)}`}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{tech.averageRating?.toFixed(1)}</span>
                      <span className="text-slate-500">({tech.reviewCount} jobs)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 italic">
                  "{tech.bio}"
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tech.categoryIds.map((catId) => (
                    <span
                      key={catId}
                      className="px-2.5 py-1 bg-slate-900 text-sky-300 rounded-md text-[11px] font-medium border border-slate-800"
                    >
                      {getCategoryName(catId)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white">${(tech.hourlyRate / 100).toFixed(2)}/hr rate</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Pro
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* B2B ENTERPRISE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-500/30">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-bold rounded-full border border-sky-500/30 inline-block">
              Corporate & Enterprise Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Commercial Property Maintenance Contracts
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Managing multiple office locations, retail stores, or residential complexes? ServiceConnect Hub offers centralized billing, dedicated dispatch managers, and custom SLAs.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-sky-500/20 flex items-center gap-2"
              >
                Request Commercial Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
