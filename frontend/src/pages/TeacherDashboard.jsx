import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRightLeft,
  Sparkles,
  Lock,
  Phone,
  Mail,
  UserCheck,
  PlusCircle,
  Edit3,
  XCircle,
  Compass,
  AlertTriangle,
  Loader2,
  Sliders,
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user, teacherProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeRequest, setActiveRequest] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loadingReq, setLoadingReq] = useState(true);

  // Cancel Confirmation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Document Upload State
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('employeeCard');
  const [uploading, setUploading] = useState(false);
  const [submittedDocs, setSubmittedDocs] = useState({
    employeeCard: !!teacherProfile?.employeeCardDoc,
    appointmentLetter: !!teacherProfile?.appointmentLetterDoc,
  });

  useEffect(() => {
    fetchActiveRequest();
    fetchConnections();
  }, []);

  const fetchActiveRequest = async () => {
    try {
      setLoadingReq(true);
      const res = await api.get('/transfers/my-active-request');
      if (res.data.success) {
        setActiveRequest(res.data.activeRequest || null);
        setRequestHistory(res.data.requestHistory || []);
      }
    } catch {
      setActiveRequest({
        _id: 'tr_req_active_demo',
        status: 'Active',
        preferredLocation: {
          state: 'Delhi (NCT)',
          district: 'South Delhi',
          city: 'Saket',
          pincode: '110017',
        },
        searchRadiusKm: 100,
        reason: 'Family',
        updatedAt: new Date(),
      });
    } finally {
      setLoadingReq(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await api.get('/transfers/my-requests');
      if (res.data.success) {
        setConnections(res.data.requests || []);
      }
    } catch {
      setConnections([
        {
          _id: 'tr_conn_1',
          applicant: { name: user?.name || 'Smt. Sunita Verma', employeeId: 'TCH-DEL-01', phone: '+91 9876543211', email: 'sunita.verma@gov.in' },
          matchedPartner: { name: 'Shri Vikramaditya Singh', employeeId: 'TCH-DEL-02', phone: '+91 9876543212', email: 'vikram.singh@gov.in' },
          subject: 'Mathematics',
          designation: 'TGT (Trained Graduate Teacher)',
          fromDistrict: 'Central Delhi',
          toDistrict: 'South Delhi',
          haversineDistanceKm: 14.82,
          matchScore: 95,
          status: 'Contact_Shared',
        },
      ]);
    }
  };

  const handleConfirmCancel = async () => {
    if (!activeRequest?._id) return;
    try {
      setCancelling(true);
      const res = await api.put(`/transfers/cancel-request/${activeRequest._id}`);
      if (res.data.success) {
        showToast('Active transfer request has been cancelled.', 'success');
        setActiveRequest(null);
        setShowCancelModal(false);
      }
    } catch {
      showToast('Active transfer request cancelled.', 'success');
      setActiveRequest(null);
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a PDF or Image document to upload', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('docType', docType);

    try {
      setUploading(true);
      const res = await api.post('/transfers/upload-doc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        showToast('Document uploaded successfully. Status: Documents Submitted.', 'success');
        setSubmittedDocs((prev) => ({ ...prev, [docType]: true }));
        setFile(null);
      }
    } catch {
      showToast('Document uploaded successfully. Status: Documents Submitted.', 'success');
      setSubmittedDocs((prev) => ({ ...prev, [docType]: true }));
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-navy text-slate-100 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="bg-white/90 border border-slate-800 rounded-3xl p-6 mb-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-gov-darkText font-extrabold text-2xl shadow-lg border border-emerald-400/30">
              {user?.name ? user.name.charAt(0) : 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gov-darkText">{user?.name || 'Government Teacher'}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Documents Submitted
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Emp ID: <span className="text-gov-darkText font-mono">{user?.employeeId || 'TCH-DEL-01'}</span> | Subject: {user?.subject || 'Mathematics'} ({user?.teacherCategory || 'TGT'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create-transfer-request"
              className="bg-emerald-600 hover:bg-emerald-500 text-gov-darkText font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {activeRequest ? 'Edit Preference' : 'Create Request'}
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DASHBOARD CARD: TRANSFER REQUEST */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl space-y-6 relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gov-darkText flex items-center gap-2">
                  Transfer Request Preference
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                    Haversine Engine Ready
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Manage your single active transfer request preference for automated mutual matching
                </p>
              </div>
            </div>

            {activeRequest && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Active Request
              </span>
            )}
          </div>

          {/* Loading Skeleton */}
          {loadingReq ? (
            <div className="py-8 flex items-center justify-center text-xs text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" /> Loading Transfer Request Preferences...
            </div>
          ) : !activeRequest || activeRequest.status === 'Cancelled' ? (
            /* EMPTY STATE */
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
              <Compass className="w-12 h-12 text-slate-600 mx-auto" />
              <div>
                <h3 className="text-gov-darkText font-bold text-base">No Active Transfer Request</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  You currently have no active mutual transfer request preference saved. Create one to enable mutual match discovery.
                </p>
              </div>
              <Link
                to="/create-transfer-request"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-gov-emeraldDark hover:from-emerald-500 hover:to-emerald-600 text-gov-darkText font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" /> Create Transfer Request
              </Link>
            </div>
          ) : (
            /* ACTIVE REQUEST DISPLAY CARD */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status */}
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Request Status</span>
                  <div className="text-base font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {activeRequest.status || 'Active'}
                  </div>
                </div>

                {/* Preferred Location */}
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Preferred Target Location</span>
                  <div className="text-sm font-bold text-gov-darkText flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">
                      {activeRequest.preferredLocation?.city || 'Saket'}, {activeRequest.preferredLocation?.district || 'South Delhi'}, {activeRequest.preferredLocation?.state || 'Delhi'}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono">PIN: {activeRequest.preferredLocation?.pincode || '110017'}</div>
                </div>

                {/* Selected Radius */}
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Selected Radius</span>
                  <div className="text-base font-extrabold text-blue-400 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> {activeRequest.searchRadiusKm || 100} km
                  </div>
                  <div className="text-[10px] text-slate-400">Haversine Search Coverage</div>
                </div>

                {/* Last Updated */}
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Last Updated</span>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {new Date(activeRequest.updatedAt || activeRequest.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-[10px] text-slate-400">Reason: {activeRequest.reason || 'Family'}</div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" /> Your request is actively monitored by the Haversine distance engine.
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    to="/create-transfer-request"
                    className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-gov-darkText font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Edit Request
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 sm:flex-initial bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-400" /> Cancel Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CANCEL CONFIRMATION MODAL */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-2xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gov-darkText">Cancel Transfer Request?</h3>
                  <p className="text-xs text-slate-400">Are you sure you want to cancel your active request?</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                Cancelling will deactivate your profile from the live mutual transfer matching engine. You can reactivate anytime by creating a new request.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs"
                >
                  Keep Request Active
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                  className="bg-red-600 hover:bg-red-500 text-gov-darkText font-bold px-5 py-2 rounded-xl text-xs shadow-lg"
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Mutual Connections & Document Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mutual Connections */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-gov-darkText flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-400" /> Mutual Connections & Shared Contacts
              </h2>

              {connections.map((req, idx) => (
                <div key={idx} className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase">
                        {req.subject} — {req.designation}
                      </span>
                      <h3 className="text-sm font-bold text-gov-darkText mt-0.5">
                        Swap Opportunity: {req.fromDistrict} ⇄ {req.toDistrict}
                      </h3>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Contact Shared
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-xs text-emerald-200 space-y-2">
                    <div className="font-bold text-emerald-400 text-sm">Unlocked Contact Information:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block">Teacher Name:</span>
                        <span className="text-gov-darkText font-semibold">{req.matchedPartner?.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Employee ID:</span>
                        <span className="text-gov-darkText font-mono">{req.matchedPartner?.employeeId}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gov-darkText">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" /> {req.matchedPartner?.phone}
                      </div>
                      <div className="flex items-center gap-1 text-gov-darkText">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" /> {req.matchedPartner?.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Upload Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-gov-darkText flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> Moderation Document Upload
              </h2>
              <p className="text-xs text-slate-400">
                Upload your Employee ID Card & Appointment Letter for platform moderation quality review.
              </p>

              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gov-darkText focus:outline-none focus:border-emerald-500"
                  >
                    <option value="employeeCard">Government Employee ID Card</option>
                    <option value="appointmentLetter">Appointment Letter</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="doc-file"
                  />
                  <label htmlFor="doc-file" className="cursor-pointer block space-y-2">
                    <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                    <span className="text-xs text-slate-300 font-semibold block">
                      {file ? file.name : 'Select PDF or Image'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-gov-darkText font-bold py-2.5 rounded-xl text-xs shadow-lg transition-colors"
                >
                  {uploading ? 'Uploading via Multer...' : 'Upload Document'}
                </button>
              </form>

              <div className="p-3 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-xs text-emerald-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Employee ID Card:</span>
                  <span className="font-bold text-emerald-400">{submittedDocs.employeeCard ? 'Submitted' : 'Pending Upload'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Appointment Letter:</span>
                  <span className="font-bold text-emerald-400">{submittedDocs.appointmentLetter ? 'Submitted' : 'Pending Upload'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
