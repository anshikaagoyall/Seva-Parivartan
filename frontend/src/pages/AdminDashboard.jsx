import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    totalCauses: 0,
    totalProblems: 0,
    activeVolunteers: 0,
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.stats || stats);
          setUsers(res.data.recentUsers || []);
        }
      } catch (err) {
        setUsers([
          { _id: 'demo-1', name: 'Admin User', email: 'admin@demo.gov.in', mobile: '9999999999', role: 'admin', isActive: true },
          { _id: 'demo-2', name: 'Demo User', email: 'user@demo.gov.in', mobile: '8888888888', role: 'user', isActive: true },
        ]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Admin Access</p>
            <h1 className="mt-2 text-3xl font-black text-gov-darkText">System Dashboard</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Total Users', stats.totalUsers],
              ['Total Admins', stats.totalAdmins],
              ['Active Users', stats.activeUsers],
              ['Pending Verifications', stats.pendingVerifications],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-white p-5">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-3 text-3xl font-black text-gov-darkText">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-gov-darkText">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-slate-800/70">
                      <td className="px-4 py-3 font-medium text-gov-darkText">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.mobile || 'N/A'}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${user.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
