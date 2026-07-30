'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { saveTechnician, getCategories } from '@/lib/appwrite/services';
import { TechnicianProfile, Category } from '@/lib/types';
import { Wrench, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function TechnicianRegisterPage() {
  const { signupUser } = useAuth();
  const router = useRouter();

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(60); // visually in dollars
  const [bio, setBio] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then((cats) => {
      setAvailableCategories(cats.filter(c => c.isActive));
      if (cats.length > 0) {
        setSelectedCategories([cats[0].$id]);
      }
      setLoadingCategories(false);
    });
  }, []);

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catId));
      }
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      // 1. Create Appwrite Auth user + Appwrite user profile
      await signupUser(email, password, name, 'technician', phone, 'Field Office');

      // 2. Re-fetch the newly created auth user to get their UID
      const { account } = await import('@/lib/appwrite/config');
      const sessionUser = await account.get();
      if (!sessionUser) throw new Error('Auth state not available after signup.');

      // 3. Create technician profile document in Appwrite
      const techId = 'tech-' + sessionUser.$id;
      const newTech: TechnicianProfile = {
        $id: techId,
        userId: sessionUser.$id,
        name: name,
        email: email,
        categoryIds: selectedCategories,
        serviceIds: [], // Can be selected later in profile
        experienceYears,
        hourlyRate: hourlyRate * 100, // store in paise
        averageRating: 0.0,
        reviewCount: 0,
        status: 'pending',
        bio,
        isAvailable: true,
      };
      await saveTechnician(newTech);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md p-8 bg-slate-900/90 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Application Received!</h2>
          <p className="text-sm text-slate-300">
            Thank you, <span className="text-sky-400 font-semibold">{name}</span>. Your technician application has been submitted and saved to our platform for review.
          </p>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 text-left">
            <div className="font-semibold text-white mb-1">Status: Pending Admin Verification</div>
            We review licenses and background checks within 24 hours. You will receive an email once approved.
          </div>
          <button
            onClick={() => router.push('/technician')}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition"
          >
            Access Technician Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="glass-panel p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Technician Application & Onboarding</h1>
          <p className="text-sm text-slate-400">Join our certified network and earn top rates on your schedule</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Profile */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">1. Basic Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Marcus Brody"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcus@example.com"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Trade Specializations */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">2. Trade Specializations</h3>
            <p className="text-xs text-slate-400">Select all service categories you are certified to perform:</p>
            {loadingCategories ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading categories...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.$id);
                  return (
                    <button key={cat.$id} type="button" onClick={() => toggleCategory(cat.$id)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}>
                      <span>{cat.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Experience & Billing */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">3. Experience & Billing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
                <input type="number" min="1" max="40" value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Hourly Rate ($)</label>
                <input type="number" min="20" max="250" value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Summary / Bio</label>
              <textarea rows={3} required value={bio} onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your qualifications, licenses, and previous work history..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 resize-none outline-none" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting || loadingCategories}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl transition shadow-lg shadow-amber-500/20 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Application...</>
            ) : (
              <>Submit Technician Application <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
