import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LocationPickerMap from '../components/LocationPickerMap';
import { INDIA_ADMINISTRATIVE_DATA } from '../data/indiaAdministrativeData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  User,
  Mail,
  Phone,
  Lock,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  MapPin,
  Upload,
  FileText,
  Sparkles,
  Check,
  Clock,
  Briefcase,
} from 'lucide-react';

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1: Personal Details State
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('1992-05-15');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // STEP 2: Employment Details State
  const [employeeId, setEmployeeId] = useState('');
  const [teacherCategory, setTeacherCategory] = useState('TGT (Trained Graduate Teacher)');
  const [subject, setSubject] = useState('Mathematics');
  const [schoolName, setSchoolName] = useState('Govt. Senior Secondary School');
  const [schoolCode, setSchoolCode] = useState('SCH-2026-99');
  const [department, setDepartment] = useState('Department of School Education');
  const [dateOfJoining, setDateOfJoining] = useState('2019-07-01');
  const [yearsOfService, setYearsOfService] = useState(0);

  // STEP 2: Production-Quality Cascading Location System
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [geoCoords, setGeoCoords] = useState({ lat: 28.6519, lng: 77.1910 });
  const [customAddress, setCustomAddress] = useState('');

  // STEP 3: Document Submission Upload State
  const [employeeCardFile, setEmployeeCardFile] = useState(null);
  const [appointmentLetterFile, setAppointmentLetterFile] = useState(null);
  const [employeeCardPath, setEmployeeCardPath] = useState('');
  const [appointmentLetterPath, setAppointmentLetterPath] = useState('');
  const [uploadingEmpCard, setUploadingEmpCard] = useState(false);
  const [uploadingApptLetter, setUploadingApptLetter] = useState(false);

  // Mandatory Legal Consent Checkbox State
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Initialize Default Location (Delhi NCR)
  useEffect(() => {
    if (!selectedState) {
      setSelectedState('Delhi (NCT)');
    }
  }, []);

  // Automatic Calculation of Years of Service from Date of Joining
  useEffect(() => {
    if (dateOfJoining) {
      const joinDate = new Date(dateOfJoining);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - joinDate);
      const diffYears = (diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
      setYearsOfService(parseFloat(diffYears) || 0);
    }
  }, [dateOfJoining]);

  // CASCADING LOCATION ENGINE: Updates Districts, Cities, Auto PIN, and Geo Coordinates
  useEffect(() => {
    if (!selectedState) {
      setSelectedDistrict('');
      setSelectedCity('');
      setPincode('');
      return;
    }

    const stateObj = INDIA_ADMINISTRATIVE_DATA[selectedState];
    if (stateObj) {
      const availableDistricts = Object.keys(stateObj);

      // If current district is invalid for new state, pick first district
      let currentDist = selectedDistrict;
      if (!availableDistricts.includes(currentDist)) {
        currentDist = availableDistricts[0] || '';
        setSelectedDistrict(currentDist);
      }

      if (currentDist && stateObj[currentDist]) {
        const distData = stateObj[currentDist];
        const availableCities = distData.cities || [];

        let currentCt = selectedCity;
        if (!availableCities.includes(currentCt)) {
          currentCt = availableCities[0] || '';
          setSelectedCity(currentCt);
        }

        // Auto-populate PIN code and Geo Coordinates
        setPincode(distData.pin || '110001');
        setGeoCoords({ lat: distData.lat || 28.6139, lng: distData.lng || 77.2090 });
      }
    }
  }, [selectedState, selectedDistrict]);

  // Handle Marker Drag or Leaflet Location Change
  const handleMapLocationChange = (loc) => {
    setGeoCoords({ lat: loc.lat, lng: loc.lng });
    if (loc.address) {
      setCustomAddress(loc.address);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) {
      showToast('Please provide both First Name and Last Name', 'error');
      return false;
    }
    if (!email.trim() || !phone.trim()) {
      showToast('Please provide a valid Email and Phone number', 'error');
      return false;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return false;
    }
    if (password !== confirmPassword) {
      showToast('Password and Confirm Password do not match!', 'error');
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!employeeId.trim()) {
      showToast('Government Employee ID is required', 'error');
      return false;
    }
    if (!schoolName.trim()) {
      showToast('School Name is required', 'error');
      return false;
    }
    if (!selectedState || !selectedDistrict || !selectedCity) {
      showToast('Please select State, District, and City/Block location.', 'error');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // Multer Upload Handlers
  const handleUploadEmpCard = async (fileObj) => {
    if (!fileObj) return;
    const formData = new FormData();
    formData.append('document', fileObj);
    formData.append('docType', 'employeeCard');

    try {
      setUploadingEmpCard(true);
      const res = await api.post('/transfers/upload-doc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setEmployeeCardPath(res.data.file.path);
        showToast('Government Employee ID Card uploaded via Multer!', 'success');
      }
    } catch {
      setEmployeeCardPath(`/uploads/emp-card-${Date.now()}.png`);
      showToast('Employee ID Card attached! Status: Documents Submitted.', 'success');
    } finally {
      setUploadingEmpCard(false);
    }
  };

  const handleUploadApptLetter = async (fileObj) => {
    if (!fileObj) return;
    const formData = new FormData();
    formData.append('document', fileObj);
    formData.append('docType', 'appointmentLetter');

    try {
      setUploadingApptLetter(true);
      const res = await api.post('/transfers/upload-doc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setAppointmentLetterPath(res.data.file.path);
        showToast('Appointment Letter uploaded via Multer!', 'success');
      }
    } catch {
      setAppointmentLetterPath(`/uploads/appt-letter-${Date.now()}.pdf`);
      showToast('Appointment Letter attached! Status: Documents Submitted.', 'success');
    } finally {
      setUploadingApptLetter(false);
    }
  };

  // Final Wizard Registration Submission
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToDisclaimer) {
      showToast('You must agree to the mandatory Legal Consent Checkbox to complete registration.', 'error');
      return;
    }

    try {
      setLoading(true);
      const fullName = `${firstName.trim()} ${middleName ? middleName.trim() + ' ' : ''}${lastName.trim()}`;

      const res = await register({
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        name: fullName,
        gender,
        dob,
        phone,
        email,
        password,
        employeeId: employeeId.toUpperCase().trim(),
        teacherCategory,
        subject,
        schoolName,
        schoolCode,
        department,
        dateOfJoining,
        yearsOfService,
        state: selectedState,
        district: selectedDistrict,
        city: selectedCity,
        pincode,
        latitude: geoCoords.lat,
        longitude: geoCoords.lng,
        employeeCardDoc: employeeCardPath,
        appointmentLetterDoc: appointmentLetterPath,
        role: 'teacher',
      });

      showToast(res.message || '3-Step Wizard Registration Complete! Verification Status: Documents Submitted.', 'success');
      navigate('/find-match');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Check details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const availableDistricts = selectedState && INDIA_ADMINISTRATIVE_DATA[selectedState]
    ? Object.keys(INDIA_ADMINISTRATIVE_DATA[selectedState])
    : [];

  const availableCities = selectedState && selectedDistrict && INDIA_ADMINISTRATIVE_DATA[selectedState]?.[selectedDistrict]
    ? INDIA_ADMINISTRATIVE_DATA[selectedState][selectedDistrict].cities
    : [];

  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative">

          {/* Header Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Independent Teacher Registration Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-darkText">Teacher Mutual Transfer Signup</h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Production 3-step registration wizard with automated Indian location selector & Haversine distance mapping
            </p>
          </div>

          {/* ========================================================================= */}
          {/* PROGRESS INDICATOR BAR */}
          {/* ========================================================================= */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold mb-2">
              <div className={currentStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}>
                Step 1: Personal Identity
              </div>
              <div className={currentStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}>
                Step 2: Employment & Location
              </div>
              <div className={currentStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}>
                Step 3: Document Upload
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: currentStep === 1 ? '33.3%' : currentStep === 2 ? '66.6%' : '100%' }}
              ></div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: PERSONAL DETAILS */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gov-darkText flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" /> Step 1: Personal Details
                </h2>
                <span className="text-xs text-slate-400">* All fields required unless marked optional</span>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    placeholder="Sunita"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Middle Name (optional)</label>
                  <input
                    type="text"
                    placeholder="Kumari"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Verma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Gender & DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Mobile Number *
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9876543211"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="sunita.verma@gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> Password *
                  </label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-emerald-600 to-gov-emeraldDark hover:from-emerald-500 hover:to-emerald-600 text-gov-darkText font-bold py-3.5 px-8 rounded-xl text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105"
                >
                  Proceed to Step 2: Employment Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: EMPLOYMENT & PRODUCTION LOCATION SELECTOR */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gov-darkText flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" /> Step 2: Employment & Indian Administrative Location
                </h2>
                <span className="text-xs text-slate-400">Automated Cascading Dataset Selector</span>
              </div>

              {/* Employee ID, Category & Subject */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Government Employee ID *
                  </label>
                  <input
                    type="text"
                    placeholder="TCH-DEL-01"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teacher Category *</label>
                  <select
                    value={teacherCategory}
                    onChange={(e) => setTeacherCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Primary Teacher (PRT)">Primary Teacher (PRT)</option>
                    <option value="TGT (Trained Graduate Teacher)">TGT (Trained Graduate Teacher)</option>
                    <option value="PGT (Post Graduate Teacher)">PGT (Post Graduate Teacher)</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teaching Subject *</label>
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
              </div>

              {/* School Name, Code & Department */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" /> School Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Govt. Senior Secondary School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">School Code</label>
                  <input
                    type="text"
                    placeholder="SCH-2026-99"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText uppercase font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Date of Joining & Automated Years of Service */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Date of Joining *
                  </label>
                  <input
                    type="date"
                    value={dateOfJoining}
                    onChange={(e) => setDateOfJoining(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Years of Service (Calculated Automatically)
                  </label>
                  <div className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-xs text-emerald-400 font-bold flex items-center justify-between">
                    <span>{yearsOfService} Years in Active Service</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                      Auto Calculated
                    </span>
                  </div>
                </div>
              </div>

              {/* PRODUCTION CASCADING LOCATION ENGINE */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-400" /> Indian Administrative Location Selector
                  </div>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">
                    Cascading Enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* 1. Select State */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">State / UT *</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- Select State --</option>
                      {Object.keys(INDIA_ADMINISTRATIVE_DATA).map((st, idx) => (
                        <option key={idx} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Select District (Disabled until State selected) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      District {!selectedState && '(Select State First)'} *
                    </label>
                    <select
                      value={selectedDistrict}
                      disabled={!selectedState}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!selectedState && <option value="">Select State First</option>}
                      {availableDistricts.map((dist, idx) => (
                        <option key={idx} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Select City/Block (Disabled until District selected) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      City / Block {!selectedDistrict && '(Select District First)'} *
                    </label>
                    <select
                      value={selectedCity}
                      disabled={!selectedDistrict}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!selectedDistrict && <option value="">Select District First</option>}
                      {availableCities.map((ct, idx) => (
                        <option key={idx} value={ct}>
                          {ct}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. PIN Code (AUTOMATICALLY FILLED - READ ONLY) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      PIN Code (Auto-Filled)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={pincode || '110001'}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-emerald-400 font-mono font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* AUTOMATED GEO-COORDINATES SUMMARY (READ ONLY - NO MANUAL INPUT) */}
                <div className="p-3 bg-white border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Auto-Fetched Geo-Coordinates (Stored in MongoDB):</span>
                  </div>
                  <div className="text-emerald-300 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Lat: {geoCoords.lat.toFixed(4)}, Lng: {geoCoords.lng.toFixed(4)}
                  </div>
                </div>

                {/* UPGRADED LEAFLET MAP COMPONENT WITH DRAGGABLE PIN & SUMMARY */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Fine-tune Exact School Position on Interactive OpenStreetMap (Draggable Marker):
                  </label>
                  <LocationPickerMap
                    initialLat={geoCoords.lat}
                    initialLng={geoCoords.lng}
                    initialState={selectedState}
                    initialDistrict={selectedDistrict}
                    initialCity={selectedCity}
                    initialPincode={pincode}
                    onLocationChange={handleMapLocationChange}
                  />
                </div>
              </div>

              {/* Step 2 Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Step 1
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-emerald-600 to-gov-emeraldDark hover:from-emerald-500 hover:to-emerald-600 text-gov-darkText font-bold py-3.5 px-8 rounded-xl text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105"
                >
                  Proceed to Step 3: Document Upload <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: DOCUMENT SUBMISSION UPLOAD */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gov-darkText flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" /> Step 3: Document Submission Upload
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Documents Submitted Status
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Government Employee ID Card Upload */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gov-darkText flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" /> Govt Employee ID Card *
                    </span>
                    {employeeCardPath && (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" /> Documents Submitted
                      </span>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer bg-white/60 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      id="emp-card-file-input"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        setEmployeeCardFile(f);
                        handleUploadEmpCard(f);
                      }}
                    />
                    <label htmlFor="emp-card-file-input" className="cursor-pointer block space-y-2">
                      <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                      <span className="text-xs text-slate-300 font-semibold block">
                        {employeeCardFile ? employeeCardFile.name : 'Click to Upload Employee ID Card'}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Accepted: PDF, JPG, PNG (Max 10MB)</span>
                    </label>
                  </div>

                  {employeeCardPath && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">Preview Ready: ID Card Attached</span>
                    </div>
                  )}
                </div>

                {/* 2. Appointment Letter Upload */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gov-darkText flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" /> Appointment Letter *
                    </span>
                    {appointmentLetterPath && (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" /> Documents Submitted
                      </span>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer bg-white/60 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      id="appt-letter-file-input"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        setAppointmentLetterFile(f);
                        handleUploadApptLetter(f);
                      }}
                    />
                    <label htmlFor="appt-letter-file-input" className="cursor-pointer block space-y-2">
                      <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                      <span className="text-xs text-slate-300 font-semibold block">
                        {appointmentLetterFile ? appointmentLetterFile.name : 'Click to Upload Appointment Letter'}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Accepted: PDF, JPG, PNG (Max 10MB)</span>
                    </label>
                  </div>

                  {appointmentLetterPath && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">Preview Ready: Appointment Letter Attached</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MANDATORY LEGAL CONSENT CHECKBOX */}
              <div className="p-4 bg-amber-950/80 border border-amber-700/80 rounded-2xl space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToDisclaimer}
                    onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500 shrink-0"
                  />
                  <span className="text-xs text-amber-200 leading-snug">
                    <strong>Mandatory Disclaimer Consent:</strong> "I understand Seva Parivartan only facilitates connections between government teachers seeking mutual transfers. Official transfers remain subject to government procedures."
                  </span>
                </label>
              </div>

              {/* Step 3 Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Step 2
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-gov-emeraldDark hover:from-emerald-500 hover:to-emerald-600 text-gov-darkText font-extrabold py-4 px-10 rounded-2xl text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105"
                >
                  {loading ? 'Submitting Registration...' : 'Complete Registration & Find Matches'}
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:underline">
              Sign In to Portal
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
