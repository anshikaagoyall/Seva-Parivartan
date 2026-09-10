import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Building2, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in both email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      showToast(res.message || 'Login successful!', 'success');

      if (res.user.role === 'officer' || res.user.role === 'admin') {
        navigate('/officer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Invalid credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'teacher') {
      setEmail('teacher@demo.gov.in');
      setPassword('password123');
    } else if (demoRole === 'officer') {
      setEmail('officer@demo.gov.in');
      setPassword('password123');
    } else {
      setEmail('admin@demo.gov.in');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gov-darkText flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-4 flex items-center justify-center relative">
        <div className="max-w-md w-full bg-white border border-gov-grayBorder rounded-3xl p-8 shadow-md space-y-6 relative overflow-hidden">
          {/* Top Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-center text-gov-emerald mx-auto shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-gov-navy">Sign In</h2>
            <p className="text-xs text-gov-mediumText">
              Access your Teacher Profile or Government Portal
            </p>
          </div>

          {/* Quick Demo Credentials Panel */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2">
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Try Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className="bg-emerald-100 hover:bg-emerald-200 text-gov-emerald border border-emerald-300 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-center truncate"
              >
                Teacher Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('officer')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-center truncate"
              >
                Officer Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gov-darkText mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gov-emerald" /> Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@government.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gov-grayBorder rounded-xl px-4 py-3 text-xs text-gov-darkText placeholder-gov-mediumText focus:outline-none focus:border-gov-emerald focus:ring-1 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-darkText mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-gov-emerald" /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gov-grayBorder rounded-xl px-4 py-3 text-xs text-gov-darkText placeholder-gov-mediumText focus:outline-none focus:border-gov-emerald focus:ring-1 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gov-emerald to-gov-emeraldDark hover:from-gov-emeraldDark hover:to-gov-emerald text-gov-darkText font-bold py-3.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gov-mediumText border-t border-gov-grayBorder pt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-gov-emerald font-bold hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
