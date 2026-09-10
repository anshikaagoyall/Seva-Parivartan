import React from 'react';
import { GraduationCap, MapPin, CheckCircle2, ArrowRightLeft, Lock, ShieldCheck } from 'lucide-react';

export default function MatchCard({ match, onConnect, isConnected }) {
  const { candidate, score, distanceKm, rationale, isDirectMatch, quality } = match;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white border border-gov-grayBorder rounded-2xl p-5 shadow-md hover:shadow-lg hover:border-gov-emerald/50 transition-all duration-300 relative group overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gov-emerald animate-pulse"></span>
          <span className="text-xs font-bold text-gov-emerald tracking-wider uppercase">
            {isDirectMatch ? 'Strong Match' : 'Possible Match'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 border border-blue-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-600" /> {distanceKm} km
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="w-20 h-20 relative">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={radius} stroke="#e5e7eb" strokeWidth="7" fill="transparent" />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={progress >= 90 ? '#059669' : progress >= 75 ? '#10b981' : progress >= 60 ? '#f59e0b' : '#d97706'}
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black text-gov-darkText">{score}</span>
            <span className="text-[9px] text-gov-mediumText">Match %</span>
          </div>
        </div>

        <div className="flex-1 ml-4">
          <div className="text-xs uppercase tracking-[0.18em] text-gov-mediumText">Match Quality</div>
          <div className="text-sm font-bold text-gov-darkText mt-1">{quality || 'Good'}</div>
          <div className="mt-2 text-[11px] text-gov-emerald">{score >= 90 ? 'Excellent' : score >= 75 ? 'Strong' : score >= 60 ? 'Good' : 'Possible'}</div>
        </div>
      </div>

      {/* Profile Main Header with Privacy Masking */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gov-emerald to-gov-emeraldDark flex items-center justify-center text-gov-darkText font-bold text-xl shadow-md border border-emerald-300 shrink-0">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gov-darkText group-hover:text-gov-emerald transition-colors flex items-center gap-2">
            {candidate.user?.name || 'Teacher Profile'}
            {!isConnected && (
              <span className="text-[10px] bg-gray-100 text-gov-mediumText border border-gov-grayBorder px-1.5 py-0.5 rounded font-mono flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> Private
              </span>
            )}
          </h3>
          <p className="text-xs text-gov-emerald font-semibold mt-0.5">
            {candidate.subject} — <span className="text-gov-mediumText font-normal">{candidate.designation}</span>
          </p>
          <p className="text-xs text-gov-mediumText mt-1 flex items-center gap-2">
            ID: <span className="text-gov-darkText font-mono">{candidate.user?.employeeId || 'TCH-***-88'}</span>
            <span className="text-[10px] text-gov-emerald font-semibold bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
              Verified
            </span>
          </p>
        </div>
      </div>

      {/* District & Location Details */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 mb-4 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gov-mediumText">Current Location:</span>
          <span className="text-gov-darkText font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-600" /> {candidate.currentDistrict}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-blue-200 pt-2">
          <span className="text-gov-mediumText">Desired Location:</span>
          <span className="text-gov-emerald font-bold">
            {Array.isArray(candidate.preferredDistricts)
              ? candidate.preferredDistricts.join(', ')
              : candidate.preferredDistricts}
          </span>
        </div>
      </div>

      {/* Privacy Guard Notice */}
      {!isConnected ? (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-700 mb-4 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Contact information is private until both teachers agree to connect.</span>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-gov-emerald mb-4 space-y-1">
          <div className="font-bold flex items-center gap-1 text-gov-emerald">
            <CheckCircle2 className="w-4 h-4" /> Contact Information (Connected)
          </div>
          <div>Phone: {candidate.user?.phone || '+91 9876543212'}</div>
          <div>Email: {candidate.user?.email || 'teacher@domain.in'}</div>
        </div>
      )}

      {/* Match Details */}
      <div className="space-y-1 mb-5 text-[11px] text-gov-mediumText">
        {rationale &&
          rationale.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-gov-emerald shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-gov-grayBorder">
        {isConnected ? (
          <div className="w-full bg-emerald-100 text-gov-emerald border border-emerald-300 font-bold py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gov-emerald" /> Connected
          </div>
        ) : (
          <button
            onClick={() => onConnect && onConnect(candidate)}
            className="w-full bg-gradient-to-r from-gov-emerald to-gov-emeraldDark hover:from-gov-emeraldDark hover:to-gov-emerald text-gov-darkText font-bold py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-300" /> Connect
          </button>
        )}
      </div>
    </div>
  );
}
