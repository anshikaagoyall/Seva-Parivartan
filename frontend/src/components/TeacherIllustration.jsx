import React from 'react';
import { GraduationCap, MapPin, Award, CheckCircle2, ArrowRightLeft, Sparkles, School } from 'lucide-react';

export default function TeacherIllustration() {
  return (
    <div className="relative w-full max-w-xl mx-auto py-4">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl -z-10 animate-pulse-subtle"></div>
      <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-blue-500/15 rounded-full blur-2xl -z-10"></div>

      {/* Main Glassmorphic Container */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
        {/* Floating Top Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
              Live Mutual Transfer Match Engine
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Distance Optimized
          </span>
        </div>

        {/* 2-Teacher Mutual Swap Visual Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* Teacher A Card */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 relative group hover:border-emerald-500/50 transition-all shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Smt. Sunita Verma</h4>
                <p className="text-xs text-blue-400 font-medium">TGT Mathematics</p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-300">
                  <School className="w-3 h-3 text-amber-400" /> Govt. Sr. Sec. School
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/70 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Current:</span>
                <span className="text-white font-semibold flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-red-400" /> Central Delhi
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Desired Swap:</span>
                <span className="text-emerald-300 font-bold">South Delhi</span>
              </div>
            </div>
          </div>

          {/* Central Animated Mutual Swap Icon */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 border-2 border-slate-900 shadow-xl items-center justify-center text-white animate-float-slow">
            <ArrowRightLeft className="w-5 h-5 text-amber-300" />
          </div>

          {/* Teacher B Card */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 relative group hover:border-emerald-500/50 transition-all shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Shri Vikramaditya</h4>
                <p className="text-xs text-blue-400 font-medium">TGT Mathematics</p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-300">
                  <School className="w-3 h-3 text-amber-400" /> Sarvodaya Kanya Saket
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/70 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Current:</span>
                <span className="text-white font-semibold flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-red-400" /> South Delhi
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Desired Swap:</span>
                <span className="text-emerald-300 font-bold">Central Delhi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Banner */}
        <div className="mt-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-white font-bold">100% Reciprocal Match Found</span>
              <p className="text-[10px] text-emerald-300">Subject: Maths | Rank: TGT | Dist: 14.8 km</p>
            </div>
          </div>
          <span className="bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-xs">
            95% Score
          </span>
        </div>

        {/* Verification Footer Badge */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Verified Employee ID: TCH-2026-88
          </span>
          <span className="text-emerald-400 font-semibold">Ready for NOC Issuance</span>
        </div>
      </div>
    </div>
  );
}
