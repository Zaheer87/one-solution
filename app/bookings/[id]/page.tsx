'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getBookingById, updateBooking, createReview, getTechnicianById } from '@/lib/appwrite/services';
import { Booking, TechnicianProfile } from '@/lib/types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  User,
  Star,
  ShieldCheck,
  ArrowLeft,
  Camera,
  Loader2,
} from 'lucide-react';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Rating State
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    setLoading(true);
    getBookingById(id)
      .then(async (data) => {
        if (data) {
          setBooking(data);
          if (data.technicianId) {
             const tech = await getTechnicianById(data.technicianId);
             setTechnician(tech);
          }
        } else {
          setNotFound(true);
        }
      })
      .catch((e) => {
        console.error('[BookingDetail]', e);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [params?.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !user) return;
    setIsReviewSubmitting(true);
    try {
      await createReview({
        bookingId: booking.$id,
        clientId: user.$id,
        technicianId: booking.technicianId || '',
        serviceId: booking.serviceId,
        rating,
        comment: reviewComment,
      });
      setIsReviewSubmitted(true);
    } catch (err) {
      console.error('[BookingDetail] review submit failed:', err);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading booking details...</span>
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold text-white mb-2">Booking Not Found</h2>
        <button
          onClick={() => router.push('/bookings')}
          className="px-4 py-2 bg-sky-500 text-slate-950 font-bold rounded-xl text-xs"
        >
          Back to My Bookings
        </button>
      </div>
    );
  }

  const steps = [
    { label: 'Booking Placed', done: true },
    { label: 'Technician Assigned', done: !!booking.technicianId },
    { label: 'In Progress', done: booking.status === 'in_progress' || booking.status === 'completed' },
    { label: 'Completed', done: booking.status === 'completed' },
  ];

  return (
    <ProtectedRoute allowedRoles={['client', 'technician', 'admin']}>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <button
          onClick={() => router.push('/bookings')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </button>

        {/* Header */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-md mb-2 inline-block">
                Booking ID #{booking.$id}
              </span>
              <h1 className="text-2xl font-black text-white">{booking.serviceName}</h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Amount</span>
              <span className="text-2xl font-black text-sky-400">${(booking.totalPrice / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="pt-6 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Real-Time Dispatch Tracker
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition ${
                    step.done
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center justify-center gap-1">
                    {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
                    <span>{step.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment Details */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Appointment Details</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Date: <strong>{booking.bookingDate}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Slot: <strong>{booking.timeSlot}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Address: <strong>{booking.address}</strong></span>
              </div>
              {booking.notes && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 mt-2">
                  <span className="block font-semibold text-slate-300 mb-1">Notes:</span>
                  {booking.notes}
                </div>
              )}
            </div>
          </div>

          {/* Assigned Technician */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Assigned Specialist</h3>
            {technician ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 overflow-hidden">
                    {technician.avatarUrl ? (
                       <img src={technician.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                       <User className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {technician.name || booking.technicianName || 'Certified Technician'}
                    </h4>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {technician.experienceYears ? `${technician.experienceYears} Years Experience` : 'Certified Field Specialist'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Contact via dispatch line after confirmation</span>
                </div>
              </div>
            ) : booking.technicianId ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                 <Loader2 className="w-4 h-4 animate-spin" /> Loading technician details...
              </div>
            ) : (
              <p className="text-xs text-slate-400">Matching available technician in your neighborhood...</p>
            )}
          </div>
        </div>

        {/* Completion Proof & Reviews */}
        {booking.status === 'completed' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" /> Job Completion Proof
            </h3>

            {booking.completionProofUrl && (
              <div className="rounded-2xl overflow-hidden max-w-md border border-slate-800">
                <img
                  src={booking.completionProofUrl}
                  alt="Work Proof"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {booking.completionNotes && (
              <p className="text-xs text-slate-300 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <strong>Technician Notes:</strong> {booking.completionNotes}
              </p>
            )}

            {/* Rating */}
            {!isReviewSubmitted ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white">Rate & Review Service</h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-2 font-bold">{rating} Stars</span>
                </div>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share feedback on technician punctuality and work quality..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={isReviewSubmitting}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2"
                >
                  {isReviewSubmitting ? <><Loader2 className="w-3 h-3 animate-spin" /> Submitting...</> : 'Submit Service Rating'}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{rating} Stars Rating Submitted</span>
                </div>
                {reviewComment && (
                  <p className="text-slate-300 italic">&quot;{reviewComment}&quot;</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
