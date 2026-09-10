import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Scale, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="bg-white/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gov-darkText">Terms & Conditions of Service</h1>
              <p className="text-xs text-slate-400">Effective Date: September 2026</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <h3 className="text-sm font-bold text-gov-darkText">1. Facilitation Only Agreement</h3>
            <p>
              By creating an account on Seva Parivartan, you acknowledge and agree that this platform functions exclusively as a mutual discovery tool between teachers. Seva Parivartan does not hold administrative authority over government school postings.
            </p>

            <h3 className="text-sm font-bold text-gov-darkText">2. Accuracy of Teacher Profiles & Document Uploads</h3>
            <p>
              Users are solely responsible for ensuring that all submitted details (Employee ID, Subject, Designation Rank, School District, and uploaded appointment documents) are accurate. Submitting false credentials will result in immediate account suspension.
            </p>

            <h3 className="text-sm font-bold text-gov-darkText">3. Mutual Consent & Contact Exchange</h3>
            <p>
              Contact details (email address and mobile number) are kept strictly confidential and masked until both candidates explicitly express mutual interest by clicking "Connect".
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
