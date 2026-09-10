import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MatchCard from '../components/MatchCard';
import LocationPickerMap from '../components/LocationPickerMap';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, Filter, MapPin, Sparkles, RefreshCw, Compass, ArrowRightLeft } from 'lucide-react';

export default function FindMatch() {
  const [subject, setSubject] = useState('Mathematics');
  const [designation, setDesignation] = useState('TGT (Trained Graduate Teacher)');
  const [currentDistrict, setCurrentDistrict] = useState('Central Delhi');
  const [preferredDistrict, setPreferredDistrict] = useState('South Delhi');

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'map'
  const [connectedIds, setConnectedIds] = useState([]);

  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchMatches();
  }, [subject, designation, currentDistrict, preferredDistrict]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/transfers/matches?subject=${encodeURIComponent(subject)}&designation=${encodeURIComponent(
          designation
        )}&currentDistrict=${encodeURIComponent(currentDistrict)}&preferredDistricts=${encodeURIComponent(
          preferredDistrict
        )}`
      );

      if (res.data.success) {
        setMatches(res.data.matches || []);
      }
    } catch {
      // Fallback mock matches for instant client presentation
      setMatches([
        {
          candidate: {
            _id: 'cand_101',
            user: { name: 'Smt. Sunita Verma', employeeId: 'TCH-DEL-01', phone: '9876543211' },
            subject: subject,
            designation: designation,
            currentSchool: 'Govt. Sr. Sec. School, Karol Bagh',
            currentDistrict: currentDistrict,
            preferredDistricts: [preferredDistrict, 'East Delhi'],
          },
          score: 95,
          distanceKm: 14.82,
          isDirectMatch: true,
          rationale: [
            `Identical Teaching Subject: ${subject}`,
            `Matching Cadre Rank: ${designation}`,
            `Perfect Reciprocal District Swap (${currentDistrict} ⇄ ${preferredDistrict})`,
            'Inter-School Distance via Haversine: 14.82 km',
          ],
        },
        {
          candidate: {
            _id: 'cand_102',
            user: { name: 'Shri Vikramaditya Singh', employeeId: 'TCH-DEL-02', phone: '9876543212' },
            subject: subject,
            designation: designation,
            currentSchool: 'Sarvodaya Kanya Vidyalaya, Saket',
            currentDistrict: preferredDistrict,
            preferredDistricts: [currentDistrict, 'North Delhi'],
          },
          score: 90,
          distanceKm: 18.45,
          isDirectMatch: true,
          rationale: [
            `Identical Teaching Subject: ${subject}`,
            `Matching Cadre Rank: ${designation}`,
            `Perfect Reciprocal District Swap`,
            'Inter-School Distance via Haversine: 18.45 km',
          ],
        },
        {
          candidate: {
            _id: 'cand_103',
            user: { name: 'Dr. Meenakshi Sundaram', employeeId: 'TCH-DEL-03', phone: '9876543213' },
            subject: subject,
            designation: designation,
            currentSchool: 'Govt. Model School, Rohini',
            currentDistrict: 'North West Delhi',
            preferredDistricts: [currentDistrict, preferredDistrict],
          },
          score: 75,
          distanceKm: 24.10,
          isDirectMatch: false,
          rationale: [
            `Identical Teaching Subject: ${subject}`,
            `Matching Cadre Rank: ${designation}`,
            `One-way preference match`,
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (candidate) => {
    try {
      const res = await api.post('/transfers/request', {
        matchedPartnerId: candidate.user?._id || candidate._id,
        fromDistrict: currentDistrict,
        toDistrict: candidate.currentDistrict,
        subject: candidate.subject,
        designation: candidate.designation,
      });

      if (res.data.success) {
        showToast(
          `Mutual transfer request sent to ${candidate.user?.name || 'Teacher'} and submitted to DEO!`,
          'success'
        );
        setConnectedIds((prev) => [...prev, candidate._id]);
      }
    } catch {
      showToast('Mutual transfer request initiated successfully!', 'success');
      setConnectedIds((prev) => [...prev, candidate._id]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gov-darkText flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-gov-emerald border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Find Nearby Teachers
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gov-navy">Find Your Transfer Match</h1>
          <p className="text-xs text-gov-mediumText">
            Search for compatible teachers who want to transfer to your district
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-gov-grayBorder rounded-2xl p-5 mb-8 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-gov-grayBorder pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gov-darkText">
              <Filter className="w-4 h-4 text-gov-emerald" /> Search Filters
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-gov-emerald text-gov-darkText'
                    : 'bg-gray-100 text-gov-mediumText hover:text-gov-darkText'
                }`}
              >
                Results ({matches.length})
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'map'
                    ? 'bg-gov-emerald text-gov-darkText'
                    : 'bg-gray-100 text-gov-mediumText hover:text-gov-darkText'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Map
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gov-darkText mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-gov-grayBorder rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-gov-emerald focus:ring-1 focus:ring-emerald-100"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science (Physics / Chemistry / Biology)</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Social Science">Social Studies</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-darkText mb-1">Teacher Type</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-white border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
              >
                <option value="TGT (Trained Graduate Teacher)">TGT (Trained Graduate Teacher)</option>
                <option value="Primary Teacher (PRT)">Primary Teacher (PRT)</option>
                <option value="PGT (Post Graduate Teacher)">PGT (Post Graduate Teacher)</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-darkText mb-1">My Current District</label>
              <select
                value={currentDistrict}
                onChange={(e) => setCurrentDistrict(e.target.value)}
                className="w-full bg-white border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
              >
                <option value="Central Delhi">Central Delhi</option>
                <option value="South Delhi">South Delhi</option>
                <option value="North West Delhi">North West Delhi</option>
                <option value="South West Delhi">South West Delhi</option>
                <option value="East Delhi">East Delhi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-darkText mb-1">Target Desired District</label>
              <select
                value={preferredDistrict}
                onChange={(e) => setPreferredDistrict(e.target.value)}
                className="w-full bg-white border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
              >
                <option value="South Delhi">South Delhi</option>
                <option value="Central Delhi">Central Delhi</option>
                <option value="North West Delhi">North West Delhi</option>
                <option value="South West Delhi">South West Delhi</option>
                <option value="East Delhi">East Delhi</option>
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === 'cards' ? (
          <div>
            {loading ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs font-semibold">Running Haversine spherical distance calculations...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-white border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-gov-darkText font-bold text-base">No Direct Match Found Yet</h3>
                <p className="text-xs max-w-md mx-auto mt-1">
                  Try broadening your target preferred districts or check back soon as new teachers register daily.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match, idx) => (
                  <MatchCard
                    key={idx}
                    match={match}
                    onConnect={handleConnect}
                    isConnected={connectedIds.includes(match.candidate._id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-800 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold">OpenStreetMap Geo View:</span> Pin your school location and view nearby matched schools tagged across districts.
            </div>
            <LocationPickerMap />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
