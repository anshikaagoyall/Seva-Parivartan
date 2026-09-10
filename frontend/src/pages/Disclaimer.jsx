import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AlertTriangle, ShieldCheck, Scale, FileText } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="bg-white/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gov-darkText">Platform Disclaimer & Non-Affiliation Notice</h1>
              <p className="text-xs text-slate-400">Important legal clarification regarding Seva Parivartan</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-700/50 text-amber-200 space-y-2">
              <strong className="text-sm font-bold block text-amber-300">1. Independent Platform Identity</strong>
              <p>
                Seva Parivartan is an independent online mutual transfer discovery and facilitation platform developed strictly to assist verified government school teachers in India. Seva Parivartan is <strong>NOT</strong> affiliated with, operated by, endorsed by, or representing any Ministry of Education, State Education Department, or District Education Authority.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gov-darkText">2. No Official Transfer Approvals or NOC Issuance</h3>
              <p>
                The platform <strong>DOES NOT</strong> approve transfers, issue No Objection Certificates (NOCs), guarantee mutual transfers, or process official government transfer applications.
              </p>

              <h3 className="text-sm font-bold text-gov-darkText">3. Role of Seva Parivartan</h3>
              <p>
                The platform solely provides algorithmic matching tools (using distance algorithms, subject matching, and district reciprocity) to help teachers discover compatible colleagues and exchange contact information after mutual consent.
              </p>

              <h3 className="text-sm font-bold text-gov-darkText">4. Official Transfer Authority</h3>
              <p>
                All official mutual transfers, service book verifications, cadre seniority determinations, and formal NOC releases remain strictly under the jurisdiction of official state government education portals, District Education Officers (DEOs), and official departmental transfer policies.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
