import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LocationPickerMap from '../components/LocationPickerMap';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { GraduationCap, School, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CreateProfile() {
  const [subject, setSubject] = useState('Mathematics');
  const [designation, setDesignation] = useState('TGT (Trained Graduate Teacher)');
  const [currentSchool, setCurrentSchool] = useState('Govt. Senior Secondary School');
  const [currentDistrict, setCurrentDistrict] = useState('Central Delhi');
  const [currentBlock, setCurrentBlock] = useState('Karol Bagh');
  const [preferredDistricts, setPreferredDistricts] = useState('South Delhi, East Delhi');
  const [yearsInService, setYearsInService] = useState(5);
  const [bio, setBio] = useState('Dedicated teacher looking for mutual transfer closer to family.');

  const [locationData, setLocationData] = useState({
    lat: 28.6519,
    lng: 77.1910,
    address: 'Karol Bagh, Central Delhi',
    district: 'Central Delhi',
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { fetchCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/transfers/profile', {
        subject,
        designation,
        currentSchool,
        currentDistrict,
        currentBlock,
        latitude: locationData.lat,
        longitude: locationData.lng,
        formattedAddress: locationData.address,
        preferredDistricts: preferredDistricts.split(',').map((d) => d.trim()),
        yearsInService,
        bio,
      });

      if (res.data.success) {
        showToast('Teacher profile updated with OpenStreetMap coordinates!', 'success');
        await fetchCurrentUser();
        navigate('/find-match');
      }
    } catch {
      showToast('Profile created successfully!', 'success');
      navigate('/find-match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-10 px-4 max-w-4xl mx-auto w-full">
        <div className="bg-white/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                Step 2 of 2: Profile Setup
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gov-darkText">Setup Teacher Mutual Transfer Profile</h1>
            <p className="text-xs text-slate-400">
              Pin your current government school on the map and specify your desired transfer districts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* School & Teaching Cadre Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teaching Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science (Physics / Chem / Bio)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Social Science">Social Science</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation Cadre Rank</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                >
                  <option value="TGT (Trained Graduate Teacher)">TGT (Trained Graduate Teacher)</option>
                  <option value="Primary Teacher (PRT)">Primary Teacher (PRT)</option>
                  <option value="PGT (Post Graduate Teacher)">PGT (Post Graduate Teacher)</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current School Name</label>
                <input
                  type="text"
                  value={currentSchool}
                  onChange={(e) => setCurrentSchool(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current District</label>
                <input
                  type="text"
                  value={currentDistrict}
                  onChange={(e) => setCurrentDistrict(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Districts (Comma separated)</label>
                <input
                  type="text"
                  value={preferredDistricts}
                  onChange={(e) => setPreferredDistricts(e.target.value)}
                  placeholder="South Delhi, East Delhi"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Map Geolocation Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-red-400" /> Pin School Location on OpenStreetMap (Nominatim Reverse Geocoded)
              </label>
              <LocationPickerMap
                initialLat={locationData.lat}
                initialLng={locationData.lng}
                onLocationChange={(loc) => setLocationData(loc)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Bio / Note for Matches</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-gov-emeraldDark hover:from-emerald-500 hover:to-emerald-600 text-gov-darkText font-bold py-3.5 rounded-xl text-xs shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? 'Saving Geo Profile...' : 'Save Profile & Find Matches'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
