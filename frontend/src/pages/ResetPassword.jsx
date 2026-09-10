import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]).{8,}$/;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const token = searchParams.get('token') || '';
  const validPassword = PASSWORD_REGEX.test(password);
  const passwordsMatch = password && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      showToast('Reset token is missing from the URL.', 'error');
      return;
    }

    if (!validPassword) {
      showToast('Password does not meet the required policy.', 'error');
      return;
    }

    if (!passwordsMatch) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', { token, password });
      showToast(res.data.message || 'Password reset successful.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to reset password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-white p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-gov-darkText text-center">Reset Password</h1>
          <p className="mt-2 text-center text-sm text-slate-400">Create a new password for your account.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-gov-darkText outline-none focus:border-emerald-500"
                placeholder="New Password"
              />
              <p className="mt-2 text-xs text-slate-400">{validPassword ? '✅ Password meets all requirements.' : '⚠️ Use 8+ chars with uppercase, lowercase, number, and special character.'}</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-gov-darkText outline-none focus:border-emerald-500"
                placeholder="Confirm Password"
              />
              {confirmPassword && <p className="mt-2 text-xs text-slate-400">{passwordsMatch ? '✅ Passwords match.' : '❌ Passwords do not match.'}</p>}
            </div>

            <button type="submit" disabled={loading || !validPassword || !passwordsMatch} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-gov-darkText disabled:opacity-70">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
