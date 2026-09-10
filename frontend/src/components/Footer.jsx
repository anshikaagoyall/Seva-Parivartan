import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Phone, Mail, MapPin, Scale, AlertTriangle, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-gov-mediumText border-t border-gov-grayBorder">
      {/* Top Banner Ribbon */}
      <div className="bg-gray-50 px-4 py-8 border-b border-gov-grayBorder">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="p-3 bg-emerald-100 text-gov-emerald rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-gov-darkText font-semibold text-sm">Documents Submitted</h4>
              <p className="text-xs text-gov-mediumText">Employee ID & Appointment Letter</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-gov-darkText font-semibold text-sm">Haversine Distance</h4>
              <p className="text-xs text-gov-mediumText">Inter-district spherical distance</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-gov-darkText font-semibold text-sm">Independent Facilitator</h4>
              <p className="text-xs text-gov-mediumText">Does not issue NOCs or transfers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 border border-purple-200">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-gov-darkText font-semibold text-sm">Platform Desk</h4>
              <p className="text-xs text-gov-mediumText">support@sevaparivartan.in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gov-emerald flex items-center justify-center text-gov-darkText font-bold shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gov-navy tracking-tight">
              SEVA <span className="text-gov-emerald">PARIVARTAN</span>
            </span>
          </div>
          <p className="text-xs text-gov-mediumText leading-relaxed mb-4">
            An independent mutual transfer discovery platform helping verified government teachers connect with compatible colleagues.
          </p>
          <div className="p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-[11px] text-amber-700">
            <strong>Disclaimer:</strong> Official transfers remain subject to state government procedures. Seva Parivartan does not approve transfers or issue NOCs.
          </div>
        </div>

        <div>
          <h3 className="text-gov-darkText font-bold text-sm mb-4 border-b border-gov-grayBorder pb-2">Quick Navigation</h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/find-match" className="text-gov-mediumText hover:text-gov-emerald transition-colors">Find Mutual Transfer Match</Link></li>
            <li><a href="/#how-it-works" className="text-gov-mediumText hover:text-gov-emerald transition-colors">How Discovery Works</a></li>
            <li><a href="/#features" className="text-gov-mediumText hover:text-gov-emerald transition-colors">Platform Features</a></li>
            <li><Link to="/login" className="text-gov-mediumText hover:text-gov-emerald transition-colors">Teacher Sign In</Link></li>
            <li><Link to="/login" className="text-gov-mediumText hover:text-gov-emerald transition-colors">Moderator Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-gov-darkText font-bold text-sm mb-4 border-b border-gov-grayBorder pb-2">Legal & Policies</h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/disclaimer" className="text-amber-600 hover:underline">Non-Government Disclaimer</Link></li>
            <li><Link to="/privacy" className="text-gov-mediumText hover:text-gov-emerald transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="text-gov-mediumText hover:text-gov-emerald transition-colors">Privacy & Masking Policy</Link></li>
            <li><a href="/#faq" className="text-gov-mediumText hover:text-gov-emerald transition-colors">Frequently Asked Questions</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-gov-darkText font-bold text-sm mb-4 border-b border-gov-grayBorder pb-2">Support & Assistance</h3>
          <p className="text-xs text-gov-mediumText mb-3">
            For technical queries or profile moderation reports:
          </p>
          <div className="space-y-2 text-xs text-gov-mediumText">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gov-emerald" />
              <span>support@sevaparivartan.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-gov-emerald" />
              <span>Independent Platform Cell</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-gray-100 py-4 px-4 border-t border-gov-grayBorder text-xs text-gov-mediumText text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            © 2026 Seva Parivartan. Independent Teacher Mutual Transfer Facilitator.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/terms" className="hover:text-gov-darkText">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-gov-darkText">Privacy Policy</Link>
            <span>•</span>
            <Link to="/disclaimer" className="text-amber-600 hover:underline">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
