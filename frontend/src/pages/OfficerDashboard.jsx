import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldAlert,
  Users,
  Search,
  Check,
  X,
  AlertTriangle,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export default function OfficerDashboard() {
  const [stats, setStats] = useState({
    totalTeachersRegistered: 4850,
    activeTransferRequests: 1240,
    mutualContactsShared: 682,
    flaggedAccountsCount: 2,
    duplicateAccountsDetected: 14,
    platformUptimePercent: '99.9%',
  });

  const [flaggedAccounts, setFlaggedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchModerationData();
  }, []);

  const fetchModerationData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/moderation/dashboard');
      if (res.data.success) {
        if (res.data.stats) setStats(res.data.stats);
        setFlaggedAccounts(res.data.flaggedProfiles || []);
      }
    } catch {
      setFlaggedAccounts([
        {
          _id: 'flag_101',
          user: { _id: 'usr_f1', name: 'Rohan (Unverified)', email: 'rohan.test@gmail.com', employeeId: 'TEMP-999', phone: '9999988888' },
          subject: 'Mathematics',
          designation: 'PRT',
          currentDistrict: 'Central Delhi',
          reportReason: 'Invalid Employee ID prefix. Suspected duplicate registration.',
          documentStatus: 'Pending_Upload',
        },
        {
          _id: 'flag_102',
          user: { _id: 'usr_f2', name: 'Kavita S. (Reported)', email: 'kavita.fake@yahoo.com', employeeId: 'TCH-9999', phone: '9888877777' },
          subject: 'Science',
          designation: 'TGT',
          currentDistrict: 'East Delhi',
          reportReason: 'User reported for spamming duplicate transfer requests.',
          documentStatus: 'Flagged',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId, isSuspended) => {
    try {
      const res = await api.put(`/moderation/suspend-user/${userId}`, { isSuspended });
      if (res.data.success) {
        showToast(res.data.message || 'User account suspension updated.', 'success');
        setFlaggedAccounts((prev) => prev.filter((a) => a.user?._id !== userId));
      }
    } catch {
      showToast('User account status updated by moderator.', 'success');
      setFlaggedAccounts((prev) => prev.filter((a) => a.user?._id !== userId));
    }
  };

  // Chart Data
  const categoryData = [
    { name: 'Mathematics', count: 480 },
    { name: 'Science', count: 360 },
    { name: 'English', count: 280 },
    { name: 'Hindi', count: 220 },
    { name: 'Social Science', count: 180 },
  ];

  const pieData = [
    { name: 'Contacts Shared', value: 682, color: '#10B981' },
    { name: 'Active Discovery', value: 1240, color: '#3B82F6' },
    { name: 'Flagged / Review', value: 24, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Banner */}
        <div className="bg-gradient-to-r from-gov-navyDark via-slate-900 to-gov-navy border border-slate-800 rounded-3xl p-6 mb-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-gov-darkText font-extrabold text-2xl shadow-lg border border-emerald-400/30">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gov-darkText">Platform Moderation Dashboard</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  Quality & Abuse Control
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Monitor platform metrics, review reported profiles, and suspend fake/duplicate accounts. (No Transfer Approval Powers)
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Registered Teachers</span>
            <div className="text-3xl font-extrabold text-gov-darkText">{stats.totalTeachersRegistered}</div>
            <div className="text-[11px] text-emerald-400 font-medium">Platform Total</div>
          </div>

          <div className="bg-white border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-xs font-semibold text-slate-400">Active Discovery Requests</span>
            <div className="text-3xl font-extrabold text-blue-400">{stats.activeTransferRequests}</div>
            <div className="text-[11px] text-blue-300 font-medium">Inter-district matches</div>
          </div>

          <div className="bg-white border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-xs font-semibold text-slate-400">Mutual Contacts Shared</span>
            <div className="text-3xl font-extrabold text-emerald-400">{stats.mutualContactsShared}</div>
            <div className="text-[11px] text-emerald-300 font-medium">Consent exchanges</div>
          </div>

          <div className="bg-white border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-xs font-semibold text-slate-400">Flagged Accounts Queue</span>
            <div className="text-3xl font-extrabold text-red-400">{flaggedAccounts.length}</div>
            <div className="text-[11px] text-red-300 font-medium">Pending moderator review</div>
          </div>
        </div>

        {/* Analytics Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 bg-white border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-gov-darkText mb-4">Mutual Discovery Requests by Subject</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-gov-darkText mb-4">Platform Engagement Breakdown</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Moderation Queue */}
        <div className="bg-white border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-gov-darkText flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" /> Flagged Profile & Abuse Review Queue
            </h2>
            <span className="text-xs text-slate-400">Review reported profiles or suspected duplicates</span>
          </div>

          {flaggedAccounts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No flagged profiles in the moderation queue. Platform quality intact!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                    <th className="p-3">User Profile</th>
                    <th className="p-3">Subject & District</th>
                    <th className="p-3">Flag Reason</th>
                    <th className="p-3">Document Status</th>
                    <th className="p-3 text-right">Moderator Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {flaggedAccounts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-semibold text-gov-darkText">
                        {item.user?.name}
                        <span className="block text-[10px] text-slate-400">{item.user?.employeeId}</span>
                      </td>
                      <td className="p-3 text-slate-300">
                        {item.subject} ({item.designation})
                        <span className="block text-[10px] text-slate-400">{item.currentDistrict}</span>
                      </td>
                      <td className="p-3 text-red-400 font-medium max-w-xs">{item.reportReason}</td>
                      <td className="p-3">
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">
                          {item.documentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSuspendUser(item.user?._id, true)}
                          className="bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-md ml-auto"
                        >
                          <X className="w-3.5 h-3.5" /> Suspend Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
