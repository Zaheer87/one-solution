import React from 'react';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'ServiceConnect Hub | On-Demand Home & Field Services Platform',
  description: 'Book certified technicians for electrical, plumbing, HVAC, cleaning, and appliance repair with instant scheduling and real-time tracking.',
  keywords: ['home services', 'field technicians', 'plumbing repair', 'electrician booking', 'hvac maintenance', 'appliance fix'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
