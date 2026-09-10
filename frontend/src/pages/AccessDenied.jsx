import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-2xl text-red-300">!</div>
          <h1 className="text-3xl font-black text-gov-darkText">Access Denied</h1>
          <p className="mt-3 text-sm text-slate-400">You do not have permission to view this page. Please sign in with the correct account or return to home.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-gov-darkText">Home</Link>
            <Link to="/login" className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200">Login</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
