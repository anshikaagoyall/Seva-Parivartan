import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Building2,
  Users,
  Search,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Bell,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/transfers/notifications');
        if (res.data.success) {
          setUnreadCount(res.data.unread || 0);
        }
      } catch {
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white text-gov-darkText shadow-md border-b border-gov-grayBorder backdrop-blur-md bg-opacity-98">
      {/* Top Banner Ribbon - Independent Platform Notice */}
      <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 text-[11px] text-blue-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-gov-emerald">
              <ShieldCheck className="w-3.5 h-3.5" /> Independent Facilitation Platform
            </span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline text-blue-600">
              Connecting Verified Government Employees Across India
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <Link to="/disclaimer" className="text-amber-600 hover:underline flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" /> Non-Government Disclaimer
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gov-emerald to-gov-emeraldDark flex items-center justify-center shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform duration-300 border border-emerald-300">
              <Building2 className="w-6 h-6 text-gov-darkText" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-gov-navy font-sans">
                  SEVA <span className="text-gov-emerald">PARIVARTAN</span>
                </span>
                <span className="bg-blue-100 text-blue-700 border border-blue-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  Facilitator
                </span>
              </div>
              <p className="text-[11px] text-gov-mediumText font-medium tracking-wide">
                Government Mutual Transfer & Opportunity Matching
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-gov-emerald ${
                isActive('/') ? 'text-gov-emerald font-semibold' : 'text-gov-mediumText'
              }`}
            >
              Home
            </Link>
            <Link
              to="/find-match"
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-gov-emerald ${
                isActive('/find-match') ? 'text-gov-emerald font-semibold' : 'text-gov-mediumText'
              }`}
            >
              <Search className="w-4 h-4 text-gov-emerald" />
              Find Transfer Match
            </Link>
            <a href="/#how-it-works" className="text-sm font-medium text-gov-mediumText hover:text-gov-emerald transition-colors">
              How It Works
            </a>
            <a href="/#features" className="text-sm font-medium text-gov-mediumText hover:text-gov-emerald transition-colors">
              Features
            </a>
            <a href="/#faq" className="text-sm font-medium text-gov-mediumText hover:text-gov-emerald transition-colors">
              FAQ
            </a>
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative p-2.5 rounded-xl bg-gray-100 border border-gov-grayBorder text-gov-mediumText hover:text-gov-emerald hover:border-gov-emerald/40 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-emerald-500 text-[10px] font-bold text-gov-darkText flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <Link
                  to={['moderator', 'officer', 'admin'].includes(user.role) ? '/officer-dashboard' : '/dashboard'}
                  className="flex items-center gap-2 bg-gov-emerald hover:bg-gov-emeraldDark text-gov-darkText px-4 py-2 rounded-xl text-sm font-semibold border border-gov-emerald transition-all shadow-sm"
                >
                  <Users className="w-4 h-4" />
                  <span>Dashboard</span>
                  <span className="bg-white/20 text-gov-darkText text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {user.role === 'moderator' ? 'Moderator' : user.role === 'officer' ? 'Officer' : user.role === 'admin' ? 'Admin' : 'Teacher'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gov-mediumText hover:text-gov-darkText px-3 py-2 text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-gov-emerald to-gov-emeraldDark hover:from-gov-emeraldDark hover:to-gov-emerald text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md border border-gov-emerald flex items-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gov-mediumText hover:text-gov-darkText hover:bg-gray-100 focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-gray-50 border-t border-gov-grayBorder px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-gov-mediumText hover:text-gov-emerald py-2 font-medium">
            Home
          </Link>
          <Link to="/find-match" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-gov-emerald py-2 font-semibold">
            <Search className="w-4 h-4" /> Find Transfer Match
          </Link>
          <Link to="/disclaimer" onClick={() => setMobileOpen(false)} className="block text-amber-600 py-2 font-semibold">
            Legal Disclaimer
          </Link>

          <div className="pt-3 border-t border-gov-grayBorder">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={['moderator', 'officer', 'admin'].includes(user.role) ? '/officer-dashboard' : '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-gov-emerald text-gov-darkText font-semibold py-2.5 rounded-xl"
                >
                  Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-center bg-red-50 text-red-600 border border-red-200 font-semibold py-2 rounded-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center bg-gray-200 text-gov-darkText py-2.5 rounded-xl font-medium">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center bg-gov-emerald text-gov-darkText py-2.5 rounded-xl font-bold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
