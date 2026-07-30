'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md p-8 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-slate-400 mb-6">Please log in to access this section of ServiceConnect Hub.</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-xl transition-colors shadow-lg shadow-sky-500/20"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md p-8 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 mb-4">
            You are logged in as <span className="capitalize font-semibold text-sky-400">{user.role}</span>, but this page requires <span className="font-semibold text-amber-400">{allowedRoles.join(' or ')}</span> access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
