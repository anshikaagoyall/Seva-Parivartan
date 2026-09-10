import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LocationPickerMap from '../components/LocationPickerMap';
import { INDIA_ADMINISTRATIVE_DATA } from '../data/indiaAdministrativeData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Building2,
  MapPin,
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Briefcase,
  User,
  Heart,
  Sliders,
  Award,
} from 'lucide-react';

const RADIUS_OPTIONS = [25, 50, 75, 100, 150];

export default function CreateTransferRequest() {
  const { user, teacherProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // SECTION 1: Current Posting Data (Read-Only)
  const currentState = user?.state || teacherProfile?.currentDistrict || 'Delhi (NCT)';
  const currentDistrict = user?.district || teacherProfile?.currentDistrict || 'Central Delhi';
  const currentCity = user?.city || teacherProfile?.currentBlock || 'Karol Bagh';
  const currentSchool = user?.schoolName || teacherProfile?.currentSchool || 'Govt. Senior Secondary School';
  const teacherCategory = user?.teacherCategory || teacherProfile?.designation || 'TGT (Trained Graduate Teacher)';
  const subject = user?.subject || teacherProfile?.subject || 'Mathematics';
  const yearsOfService = user?.yearsOfService || teacherProfile?.yearsInService || 5;

  // SECTION 2: Preferred Transfer Location State (Cascading Dataset)
  const [prefState, setPrefState] = useState('Delhi (NCT)');
  const [prefDistrict, setPrefDistrict] = useState('South Delhi');
  const [prefCity, setPrefCity] = useState('Saket');
  const [prefSchool, setPrefSchool] = useState('');
  const [prefPincode, setPrefPincode] = useState('110017');
  const [prefCoords, setPrefCoords] = useState({ lat: 28.5244, lng: 77.2188 });

  // SECTION 3: Search Radius State
  const [searchRadiusKm, setSearchRadiusKm] = useState(100);

  // SECTION 4: Transfer Reason State
  const [reason, setReason] = useState('Family');
  const [otherReason, setOtherReason] = useState('');

  const [loading, setLoading] = useState(false);
  const [existingActiveId, setExistingActiveId] = useState(null);

  // Load existing active request preferences for editing
  useEffect(() => {
    fetchActiveRequest();
  }, []);

  const fetchActiveRequest = async () => {
    try {
      const res = await api.get('/transfers/my-active-request');
      if (res.data.success && res.data.activeRequest) {
        const req = res.data.activeRequest;
        setExistingActiveId(req._id);
        if (req.preferredLocation) {
          if (req.preferredLocation.state) setPrefState(req.preferredLocation.state);
          if (req.preferredLocation.district) setPrefDistrict(req.preferredLocation.district);
          if (req.preferredLocation.city) setPrefCity(req.preferredLocation.city);
          if (req.preferredLocation.preferredSchool) setPrefSchool(req.preferredLocation.preferredSchool);
        }
        if (req.searchRadiusKm) setSearchRadiusKm(req.searchRadiusKm);
        if (req.reason) setReason(req.reason);
        if (req.otherReason) setOtherReason(req.otherReason);
      }
    } catch {
      // Default initial state
    }
  };

  // CASCADING LOCATION ENGINE FOR PREFERRED LOCATION
  useEffect(() => {
    if (!prefState) {
      setPrefDistrict('');
      setPrefCity('');
      setPrefPincode('');
      return;
    }

    const stateObj = INDIA_ADMINISTRATIVE_DATA[prefState];
    if (stateObj) {
      const availableDistricts = Object.keys(stateObj);
      let currentDist = prefDistrict;

      if (!availableDistricts.includes(currentDist)) {
        currentDist = availableDistricts[0] || '';
        setPrefDistrict(currentDist);
      }

      if (currentDist && stateObj[currentDist]) {
        const distData = stateObj[currentDist];
        const availableCities = distData.cities || [];

        let currentCt = prefCity;
        if (!availableCities.includes(currentCt)) {
          currentCt = availableCities[0] || '';
          setPrefCity(currentCt);
        }

        setPrefPincode(distData.pin || '110001');
        setPrefCoords({ lat: distData.lat || 28.6139, lng: distData.lng || 77.2090 });
      }
    }
  }, [prefState, prefDistrict]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Preferred location cannot equal current location
    if (
      prefState === currentState &&
      prefDistrict === currentDistrict &&
      prefCity === currentCity
    ) {
      showToast('Preferred transfer location cannot be identical to your current posting location.', 'error');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        currentLocation: {
          state: currentState,
          district: currentDistrict,
          city: currentCity,
          schoolName: currentSchool,
          pincode: user?.pincode || '110001',
          latitude: user?.latitude || 28.6519,
          longitude: user?.longitude || 77.1910,
        },
        preferredLocation: {
          state: prefState,
          district: prefDistrict,
          city: prefCity,
          preferredSchool: prefSchool,
          pincode: prefPincode,
          latitude: prefCoords.lat,
          longitude: prefCoords.lng,
        },
        subject,
        teacherCategory,
        yearsOfService,
        searchRadiusKm,
        reason,
        otherReason: reason === 'Other' ? otherReason : '',
      };

      const res = await api.post('/transfers/request-preference', payload);

      if (res.data.success) {
        showToast(res.data.message || 'Transfer request saved! Radius set to ' + searchRadiusKm + ' km.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Transfer request preferences saved!', 'success');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const availableDistricts = prefState && INDIA_ADMINISTRATIVE_DATA[prefState]
    ? Object.keys(INDIA_ADMINISTRATIVE_DATA[prefState])
    : [];

  const availableCities = prefState && prefDistrict && INDIA_ADMINISTRATIVE_DATA[prefState]?.[prefDistrict]
    ? INDIA_ADMINISTRATIVE_DATA[prefState][prefDistrict].cities
    : [];

  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Transfer Preference Module
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-darkText">
              {existingActiveId ? 'Edit Active Mutual Transfer Request' : 'Create Mutual Transfer Request'}
            </h1>
            <p className="text-xs text-slate-400">
              Specify your preferred target district, search radius, and reason. Prepares your profile for the Haversine matching engine.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ========================================================================= */}
            {/* SECTION 1: CURRENT POSTING (READ ONLY) */}
            {/* ========================================================================= */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" /> Section 1: Current Posting (Read-Only)
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-mono">
                  Auto-Fetched from Profile
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Teacher Name:</span>
                  <span className="text-gov-darkText font-bold">{user?.name || 'Smt. Sunita Verma'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Employee ID:</span>
                  <span className="text-emerald-400 font-mono font-bold">{user?.employeeId || 'TCH-DEL-01'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Category & Subject:</span>
                  <span className="text-gov-darkText font-semibold">{teacherCategory} ({subject})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">School Name:</span>
                  <span className="text-gov-darkText font-semibold">{currentSchool}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Current District & State:</span>
                  <span className="text-gov-darkText font-semibold">{currentDistrict}, {currentState}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Years of Service:</span>
                  <span className="text-amber-400 font-bold">{yearsOfService} Years Active</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: PREFERRED TRANSFER LOCATION */}
            {/* ========================================================================= */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" /> Section 2: Preferred Transfer Location
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  Cascading Selection
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred State / UT *</label>
                  <select
                    value={prefState}
                    onChange={(e) => setPrefState(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  >
                    {Object.keys(INDIA_ADMINISTRATIVE_DATA).map((st, idx) => (
                      <option key={idx} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred District {!prefState && '(Select State First)'} *
                  </label>
                  <select
                    value={prefDistrict}
                    disabled={!prefState}
                    onChange={(e) => setPrefDistrict(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  >
                    {availableDistricts.map((dist, idx) => (
                      <option key={idx} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred City / Block {!prefDistrict && '(Select District First)'} *
                  </label>
                  <select
                    value={prefCity}
                    disabled={!prefDistrict}
                    onChange={(e) => setPrefCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  >
                    {availableCities.map((ct, idx) => (
                      <option key={idx} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred School Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarvodaya Kanya Vidyalaya"
                    value={prefSchool}
                    onChange={(e) => setPrefSchool(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-gov-darkText placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target PIN Code (Auto-Stored)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={prefPincode || '110017'}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-mono font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Target Coordinates (Auto-Stored for Haversine):
                </span>
                <span className="text-emerald-300 font-mono font-bold">
                  Lat: {prefCoords.lat.toFixed(4)}, Lng: {prefCoords.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 3: SEARCH RADIUS SLIDER */}
            {/* ========================================================================= */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-blue-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> Section 3: Preferred Search Radius (Km)
                </div>
                <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">
                  {searchRadiusKm} Km Selected
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  {RADIUS_OPTIONS.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSearchRadiusKm(r)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        searchRadiusKm === r
                          ? 'bg-emerald-600 text-gov-darkText border border-emerald-400'
                          : 'bg-slate-800 text-slate-400 hover:text-gov-darkText'
                      }`}
                    >
                      {r} km {r === 100 ? '(Default)' : ''}
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min="25"
                  max="150"
                  step="25"
                  value={searchRadiusKm}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (RADIUS_OPTIONS.includes(val)) {
                      setSearchRadiusKm(val);
                    }
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="p-3 bg-blue-950/60 border border-blue-700/50 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    <strong>Haversine Engine Rule:</strong> "Searching for compatible teachers within <strong>{searchRadiusKm} km</strong> radius of {prefDistrict}, {prefState}."
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 4: TRANSFER REASON */}
            {/* ========================================================================= */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Section 4: Transfer Reason
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reason Category *</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Family">Family / Caretaking</option>
                    <option value="Medical">Medical Condition</option>
                    <option value="Marriage">Spouse / Marriage Transfer</option>
                    <option value="Personal">Personal Preference</option>
                    <option value="Career Growth">Career Growth / Higher Studies</option>
                    <option value="Other">Other Specific Reason</option>
                  </select>
                </div>

                {reason === 'Other' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Specify Reason Details</label>
                    <textarea
                      rows={2}
                      placeholder="Specify your transfer reason..."
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3.5 px-6 rounded-xl text-xs flex items-center gap-2 border border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" /> Cancel & Return to Dashboard
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-gov-emeraldDark hover:from-emerald-500 hover:to-emerald-600 text-gov-darkText font-extrabold py-4 px-10 rounded-2xl text-xs shadow-xl shadow-emerald-950/60 flex items-center gap-2 transition-all hover:scale-105"
              >
                {loading ? 'Saving Preference...' : 'Save Transfer Request Preference'}
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
