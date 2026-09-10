import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Lock, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="bg-white/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-2xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gov-darkText">Privacy Policy & Teacher Data Protection</h1>
              <p className="text-xs text-slate-400">Strict Anonymous Masking Rules</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <h3 className="text-sm font-bold text-gov-darkText">1. Pre-Consent Anonymous Masking</h3>
            <p>
              Before mutual interest consent, candidate cards hide your full name, phone number, email address, and exact school location. Only masked Teacher ID, subject, designation rank, district, Haversine distance, and match score % are displayed.
            </p>

            <h3 className="text-sm font-bold text-gov-darkText">2. Consent-Based Contact Unlock</h3>
            <p>
              Your contact details are shared only with specific teachers with whom a mutual 2-way connection request has been established.
            </p>

            <h3 className="text-sm font-bold text-gov-darkText">3. Document Upload Security</h3>
            <p>
              Uploaded Employee ID Cards and Appointment Letters are encrypted via Multer storage and accessed solely for platform quality moderation.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
