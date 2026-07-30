'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getServices, getTechnicians, createBooking, getCategories } from '@/lib/appwrite/services';
import { ServiceItem, Booking, Category, TechnicianProfile } from '@/lib/types';
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

function BookingWizardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId');

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTechnicians, setAllTechnicians] = useState<TechnicianProfile[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | 'auto'>('auto');
  const [loadingServices, setLoadingServices] = useState(true);

  // Form State
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setClientAddress(user.address || '');
      setClientPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    setLoadingServices(true);
    Promise.all([getServices(), getCategories(), getTechnicians('verified')])
      .then(([list, cats, techs]) => {
        setCategories(cats);
        setAllTechnicians(techs);
        const active = list.filter((s) => s.isActive);
        setServices(active);
        if (preselectedServiceId) {
          const match = active.find((s) => s.$id === preselectedServiceId);
          if (match) setSelectedService(match);
        } else if (active.length > 0) {
          setSelectedService(active[0]);
        }
      })
      .finally(() => setLoadingServices(false));
  }, [preselectedServiceId]);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.$id === id)?.name || id;
  };

  const availableSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !user) return;
    setIsSubmitting(true);
    setError('');

    try {
      let matchedTech: TechnicianProfile | undefined;
      
      if (selectedTechnicianId !== 'auto') {
        matchedTech = allTechnicians.find(t => t.$id === selectedTechnicianId);
      } else {
        // Auto-assign available technician matching category
        matchedTech =
          allTechnicians.find((t) => t.categoryIds.includes(selectedService.categoryId) && t.isAvailable) ||
          allTechnicians.find((t) => t.isAvailable) ||
          allTechnicians[0];
      }

      const bookingId = 'bk-' + Math.floor(100000 + Math.random() * 900000);
      const newBooking: Booking = {
        $id: bookingId,
        clientId: user.$id,
        clientName: user.name,
        clientPhone,
        address: clientAddress,
        serviceId: selectedService.$id,
        serviceName: selectedService.name,
        technicianId: matchedTech?.$id,
        technicianName: matchedTech?.name,
        bookingDate: scheduledDate,
        timeSlot,
        notes,
        totalPrice: selectedService.basePrice,
        status: 'confirmed',
      };

      await createBooking(newBooking);
      router.push(`/bookings/${bookingId}`);
    } catch (err: any) {
      console.error('[BookPage] createBooking failed:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  const availableTechsForService = selectedService 
    ? allTechnicians.filter(t => t.categoryIds.includes(selectedService.categoryId))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-2 mb-8">
        <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-xs font-bold rounded-full border border-sky-500/20 inline-block">
          Instant Service Dispatch
        </span>
        <h1 className="text-3xl font-black text-white">Book a Certified Technician</h1>
        <p className="text-sm text-slate-400">Select service, slot, and delivery address in seconds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleBookingSubmit} className="space-y-6">

            {/* Step 1: Service Selection */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-500 text-slate-950 text-xs flex items-center justify-center font-bold">1</span>
                Select Required Service
              </h3>

              {loadingServices ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading services from catalog...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((srv) => {
                    const isSelected = selectedService?.$id === srv.$id;
                    return (
                      <div
                        key={srv.$id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/10'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-400">{getCategoryName(srv.categoryId)}</span>
                          <span className="text-xs font-bold text-sky-400">${(srv.basePrice / 100).toFixed(2)}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm mb-1">{srv.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{srv.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Date & Slot */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-500 text-slate-950 text-xs flex items-center justify-center font-bold">2</span>
                Schedule Date & Arrival Window
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 outline-none"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Address & Notes */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-500 text-slate-950 text-xs flex items-center justify-center font-bold">3</span>
                Service Address & Instructions
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Service Address</label>
                  <input
                    type="text"
                    required
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Street address, building, unit number"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Description / Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify symptoms (e.g. breaker tripping, water leak location)..."
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 resize-none outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Technician Selection */}
            {selectedService && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-500 text-slate-950 text-xs flex items-center justify-center font-bold">4</span>
                  Select Specialist (Optional)
                </h3>
                <p className="text-xs text-slate-400">Choose a specific technician, or let us find the best available match.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {/* Auto-Assign Option */}
                  <div
                    onClick={() => setSelectedTechnicianId('auto')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedTechnicianId === 'auto'
                        ? 'bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Auto-Assign Best Match</h4>
                      <p className="text-[11px] text-slate-400">Fastest dispatch time</p>
                    </div>
                    {selectedTechnicianId === 'auto' && <CheckCircle2 className="w-5 h-5 text-sky-400 ml-auto" />}
                  </div>

                  {/* Available Technicians */}
                  {availableTechsForService.map((tech) => (
                    <div
                      key={tech.$id}
                      onClick={() => setSelectedTechnicianId(tech.$id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        selectedTechnicianId === tech.$id
                          ? 'bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/10'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 overflow-hidden flex-shrink-0">
                        {tech.avatarUrl ? (
                          <img src={tech.avatarUrl} alt={tech.name || 'Tech'} className="w-full h-full object-cover" />
                        ) : (
                          <Wrench className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{tech.name || 'Certified Tech'}</h4>
                        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {tech.experienceYears} Yrs Exp
                        </div>
                      </div>
                      {selectedTechnicianId === tech.$id && <CheckCircle2 className="w-5 h-5 text-sky-400 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !selectedService || loadingServices}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold rounded-2xl transition shadow-lg shadow-sky-500/25 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Confirming Booking...</>
              ) : (
                <>Confirm Booking (${selectedService ? (selectedService.basePrice / 100).toFixed(2) : 0}) <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {selectedService && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
                Order Summary
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-semibold text-white">{selectedService.name}</span>
                  <span className="font-bold text-sky-400">${(selectedService.basePrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Category</span>
                  <span className="text-slate-200">{getCategoryName(selectedService.categoryId)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Time</span>
                  <span className="text-slate-200">{selectedService.durationMinutes} mins</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dispatch Fee</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Total Amount</span>
                <span className="text-xl text-sky-400">${(selectedService.basePrice / 100).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Guarantee Protection Included
                </div>
                <p>Payment released to technician only after work completion and your approval.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <ProtectedRoute allowedRoles={['client', 'admin']}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading booking options...</div>}>
        <BookingWizardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
