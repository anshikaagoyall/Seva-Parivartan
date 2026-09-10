import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TeacherIllustration from '../components/TeacherIllustration';
import DistanceCalculatorWidget from '../components/DistanceCalculatorWidget';
import {
  Search,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Lock,
  Compass,
  Zap,
  RefreshCw,
  GraduationCap,
  ArrowRightLeft,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Does Seva Parivartan approve official teacher transfers or issue NOCs?',
      a: 'No. Seva Parivartan is an independent mutual transfer facilitation platform. We DO NOT approve transfers, issue NOCs, or process government applications. Our platform strictly helps verified teachers discover compatible mutual transfer partners and exchange contact details after mutual consent.',
    },
    {
      q: 'How does privacy masking work before mutual consent?',
      a: 'To protect teacher privacy, your full name, phone number, email address, and exact school name are masked. Other teachers can only see your masked Teacher ID, subject, designation rank, district, Haversine distance, and match score %.',
    },
    {
      q: 'When are contact details unlocked between teachers?',
      a: 'Contact details (phone number and email) are unlocked ONLY after BOTH teachers click "Request Contact Exchange" (establishing mutual interest). Once contact is shared, the platform responsibility ends and teachers can proceed to discuss official government applications.',
    },
    {
      q: 'What documents are required for account verification?',
      a: 'Teachers upload a copy of their Government Employee ID Card and Appointment Letter. Upon upload, your account displays "Documents Submitted". Note: These are for platform moderation quality only and do not constitute official government verification.',
    },
    {
      q: 'Is Seva Parivartan free to use for teachers?',
      a: 'Yes! Seva Parivartan is 100% free for verified government teachers seeking mutual transfer opportunities across India.',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gov-darkText selection:bg-emerald-500 selection:text-gov-darkText">
      <Navbar />

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-20 overflow-hidden border-b border-gov-grayBorder bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* NON-GOVERNMENT DISCLAIMER BANNER */}
          <div className="bg-blue-50 border border-blue-300 rounded-2xl p-4 text-xs text-blue-700 flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                <strong>Platform Disclaimer:</strong> Seva Parivartan facilitates mutual match discovery between government teachers. We do not approve transfers or issue NOCs. Official transfers remain subject to state government procedures.
              </span>
            </div>
            <Link to="/disclaimer" className="text-blue-600 font-bold hover:underline shrink-0 text-[11px]">
              Learn More
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-gov-emerald/40 text-xs font-bold text-gov-emerald shadow-sm">
                <ShieldCheck className="w-4 h-4 text-gov-emerald" />
                <span>Independent Government Mutual Transfer Discovery Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gov-navy tracking-tight leading-tight">
                Discover Compatible <span className="text-gov-emerald underline decoration-emerald-400/40 underline-offset-8">Mutual Transfer</span> Partners
              </h1>

              <p className="text-base sm:text-lg text-gov-mediumText max-w-2xl leading-relaxed">
                Connect with compatible government teachers across districts. Compute exact spherical distance via <strong className="text-gov-emerald font-semibold">Haversine Formula</strong>, search via <strong className="text-gov-emerald font-semibold">OpenStreetMap</strong>, and exchange contact details after mutual consent.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/find-match"
                  className="w-full sm:w-auto bg-gradient-to-r from-gov-emerald via-gov-emeraldLight to-gov-emeraldDark hover:from-gov-emeraldDark hover:to-gov-emerald text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg border border-gov-emerald/60 flex items-center justify-center gap-3 transition-all hover:scale-105 group"
                >
                  <Search className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Find Your Mutual Transfer Match</span>
                  <ArrowRight className="w-5 h-5 text-gov-darkText group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gov-darkText font-bold text-base px-6 py-4 rounded-2xl border border-gov-grayBorder flex items-center justify-center gap-2 transition-all"
                >
                  <GraduationCap className="w-5 h-5 text-gov-emerald" />
                  <span>Signup</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-gov-grayBorder grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <h4 className="text-2xl font-extrabold text-gov-navy">4,850+</h4>
                  <p className="text-xs text-gov-mediumText font-medium">Teachers Registered</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-gov-emerald">1,240+</h4>
                  <p className="text-xs text-gov-mediumText font-medium">Matches Discovered</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-amber-600">680+</h4>
                  <p className="text-xs text-gov-mediumText font-medium">Contacts Shared</p>
                </div>
              </div>
            </div>

            {/* Right Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <TeacherIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: HOW IT WORKS */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-gray-50 border-b border-gov-grayBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gov-emerald uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Platform Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gov-navy">How Seva Parivartan Works</h2>
            <p className="text-sm text-gov-mediumText">
              4 simple steps from anonymous discovery to consent-based contact exchange.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white border border-gov-grayBorder rounded-2xl p-6 relative group hover:border-gov-emerald/50 transition-all shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-gov-emerald font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gov-darkText mb-2">Register & Submit ID</h3>
              <p className="text-xs text-gov-mediumText leading-relaxed">
                Create your account and submit Employee ID & Appointment Letter for platform moderation.
              </p>
            </div>

            <div className="bg-white border border-gov-grayBorder rounded-2xl p-6 relative group hover:border-gov-emerald/50 transition-all shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gov-darkText mb-2">Anonymous Match</h3>
              <p className="text-xs text-gov-mediumText leading-relaxed">
                Our Haversine engine matches Subject, Cadre, and District reciprocity with masked privacy protection.
              </p>
            </div>

            <div className="bg-white border border-gov-grayBorder rounded-2xl p-6 relative group hover:border-gov-emerald/50 transition-all shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gov-darkText mb-2">Mutual Interest Consent</h3>
              <p className="text-xs text-gov-mediumText leading-relaxed">
                Both teachers click "Request Contact Exchange" to signal mutual interest in swapping districts.
              </p>
            </div>

            <div className="bg-white border border-gov-grayBorder rounded-2xl p-6 relative group hover:border-gov-emerald/50 transition-all shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-600 font-bold text-xl mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-gov-darkText mb-2">Contact Shared</h3>
              <p className="text-xs text-gov-mediumText leading-relaxed">
                Phone and email details unlock. Platform responsibility ends and teachers proceed with official state procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: WHY SEVA PARIVARTAN */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-b border-gov-grayBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-gov-emerald uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Independent Platform Benefits
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gov-navy leading-tight">
                Why Teachers Use Seva Parivartan
              </h2>
              <p className="text-sm text-gov-mediumText leading-relaxed">
                Finding mutual transfer colleagues manually across districts used to rely on word-of-mouth or unverified WhatsApp groups. Seva Parivartan provides a structured, privacy-protected discovery engine.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <Lock className="w-5 h-5 text-gov-emerald shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gov-darkText">Strict Privacy Masking</h4>
                    <p className="text-xs text-gov-mediumText">Personal phone numbers, emails, and exact school details remain hidden until mutual consent.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                  <Compass className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gov-darkText">Haversine Distance Optimization</h4>
                    <p className="text-xs text-gov-mediumText">Calculates precise inter-district travel distance between school locations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gov-darkText">Documents Submitted Badge</h4>
                    <p className="text-xs text-gov-mediumText">Moderators review Employee ID Cards & Appointment Letters to ensure platform quality.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <DistanceCalculatorWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: FEATURES */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-gray-50 border-b border-gov-grayBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gov-emerald uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Technology Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gov-navy">Platform Features</h2>
            <p className="text-sm text-gov-mediumText">
              Built with Node.js, Express, MongoDB, React (Vite), Tailwind CSS, OpenStreetMap, JWT, and Multer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gov-grayBorder rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-emerald-100 text-gov-emerald rounded-xl w-fit">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-darkText">OpenStreetMap Geocoding</h3>
              <p className="text-xs text-gov-mediumText leading-relaxed">
                Reverse geocoding via Nominatim API. Pin school district locations interactively on Leaflet maps.
              </p>
            </div>

            <div className="bg-white border border-gov-grayBorder rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-darkText">Haversine Distance Engine</h3>
              <p className="text-xs text-gov-mediumText leading-relaxed">
                Backend spherical distance math evaluating inter-district travel reduction between teacher locations.
              </p>
            </div>

            <div className="bg-white border border-gov-grayBorder rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-darkText">Multer Document Uploads</h3>
              <p className="text-xs text-gov-mediumText leading-relaxed">
                Multi-part upload engine handling Employee ID Cards & Appointment Letters for platform moderation review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MATCHING PROCESS */}
      {/* ========================================================================= */}
      <section id="matching-process" className="py-20 bg-white border-b border-gov-grayBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gov-emerald uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Matching Algorithm
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gov-navy">Discovery & Consent Rules</h2>
          </div>

          <div className="bg-gray-50 border border-gov-grayBorder rounded-3xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-5 rounded-2xl bg-white border border-gov-grayBorder shadow-sm">
                <div className="text-gov-emerald font-extrabold text-lg mb-1">Subject Compatibility</div>
                <p className="text-xs text-gov-mediumText">Identical teaching subjects required for reciprocal swap match.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gov-grayBorder shadow-sm">
                <div className="text-blue-600 font-extrabold text-lg mb-1">Cadre Rank Compatibility</div>
                <p className="text-xs text-gov-mediumText">PRT swaps with PRT, TGT with TGT, PGT with PGT.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gov-grayBorder shadow-sm">
                <div className="text-amber-600 font-extrabold text-lg mb-1">District Reciprocity</div>
                <p className="text-xs text-gov-mediumText">Teacher A desires B's district, Teacher B desires A's district.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: FAQ */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 bg-gray-50 border-b border-gov-grayBorder">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-gov-emerald uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gov-navy">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gov-grayBorder rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-gov-darkText hover:text-gov-emerald transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gov-emerald transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs text-gov-mediumText leading-relaxed border-t border-gov-grayBorder pt-3 bg-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
