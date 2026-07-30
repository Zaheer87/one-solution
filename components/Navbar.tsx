'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Wrench,
  Calendar,
  Briefcase,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  PlusCircle,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Wrench className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Service<span className="gradient-text">Connect</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-medium text-slate-400 -mt-1">
                Hub Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/' ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>

            {user?.role === 'client' && (
              <>
                <Link
                  href="/book"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/book' ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-sky-400" />
                  Book Service
                </Link>
                <Link
                  href="/bookings"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname?.startsWith('/bookings') ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  My Bookings
                </Link>
              </>
            )}

            {user?.role === 'technician' && (
              <>
                <Link
                  href="/technician"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/technician' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  Jobs Portal
                </Link>
                <Link
                  href="/technician/profile"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/technician/profile' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link
                  href="/admin"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/admin' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  Admin Overview
                </Link>
                <Link
                  href="/admin/bookings"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/admin/bookings' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Bookings
                </Link>
                <Link
                  href="/admin/technicians"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/admin/technicians' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Techs
                </Link>
                <Link
                  href="/admin/services"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/admin/services' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Services
                </Link>
              </>
            )}

            <Link
              href="/quote"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/quote' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4 text-teal-400" />
              B2B Quote
            </Link>
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="text-right">
                  <span className="block text-xs font-semibold text-white leading-tight">
                    {user.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl transition shadow-lg shadow-sky-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            href="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-sky-400 hover:bg-slate-800"
          >
            Book Service
          </Link>
          <Link
            href="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            My Bookings
          </Link>
          <Link
            href="/technician"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-amber-400 hover:bg-slate-800"
          >
            Technician Jobs
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-800"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/quote"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-teal-400 hover:bg-slate-800"
          >
            Enterprise B2B Quote
          </Link>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold rounded-xl text-center text-sm"
              >
                Log Out ({user.name})
              </button>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-slate-300 font-medium border border-slate-700 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-slate-950 font-semibold bg-sky-500 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
