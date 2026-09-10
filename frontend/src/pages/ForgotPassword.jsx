import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      showToast(res.data.message || 'Password reset instructions sent.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to send password reset instructions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-white p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-gov-darkText text-center">Forgot Password</h1>
          <p className="mt-2 text-center text-sm text-slate-400">Enter your email to receive a reset link.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-gov-darkText outline-none focus:border-emerald-500"
                placeholder="name@example.com"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-gov-darkText disabled:opacity-70">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <Link to="/login" className="font-semibold text-emerald-400">Back to Login</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
