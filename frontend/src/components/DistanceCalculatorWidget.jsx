import React, { useState } from 'react';
import { Calculator, MapPin, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const DEMO_LOCATIONS = [
  { name: 'Central Delhi (Karol Bagh)', lat: 28.6519, lon: 77.1910 },
  { name: 'South Delhi (Saket)', lat: 28.5244, lon: 77.2188 },
  { name: 'North West Delhi (Rohini)', lat: 28.7041, lon: 77.1025 },
  { name: 'South West Delhi (Vasant Kunj)', lat: 28.5293, lon: 77.1539 },
  { name: 'East Delhi (Mayur Vihar)', lat: 28.6083, lon: 77.2942 },
  { name: 'Noida Sector 62', lat: 28.6280, lon: 77.3649 },
  { name: 'Gurugram Cyber City', lat: 28.4950, lon: 77.0890 },
];

export default function DistanceCalculatorWidget() {
  const [loc1, setLoc1] = useState(DEMO_LOCATIONS[0]);
  const [loc2, setLoc2] = useState(DEMO_LOCATIONS[1]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateDistance = async () => {
    try {
      setLoading(true);
      const res = await api.post('/transfers/calculate-distance', {
        lat1: loc1.lat,
        lon1: loc1.lon,
        lat2: loc2.lat,
        lon2: loc2.lon,
        locationName1: loc1.name,
        locationName2: loc2.name,
      });

      if (res.data.success) {
        setResult(res.data);
      }
    } catch {
      // Local fallback calculation if backend API call fails
      const R = 6371;
      const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
      const dLon = ((loc2.lon - loc1.lon) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((loc1.lat * Math.PI) / 180) *
          Math.cos((loc2.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = Math.round(R * c * 100) / 100;
      setResult({
        distanceKm: dist,
        distanceMiles: Math.round(dist * 0.621371 * 100) / 100,
        location1: loc1.name,
        location2: loc2.name,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gov-grayBorder rounded-2xl p-6 shadow-md text-gov-darkText">
      <div className="flex items-center gap-3 mb-5 border-b border-gov-grayBorder pb-3">
        <div className="p-2.5 rounded-xl bg-emerald-100 text-gov-emerald border border-emerald-300">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gov-navy flex items-center gap-2">
            Find Nearby Locations
            <span className="text-[10px] bg-emerald-100 text-gov-emerald font-bold px-2 py-0.5 rounded-md border border-emerald-300">
              Tool
            </span>
          </h3>
          <p className="text-xs text-gov-mediumText">
            See the distance between two school locations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-gov-darkText mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gov-emerald" /> Your Current Location
          </label>
          <select
            value={loc1.name}
            onChange={(e) => {
              const selected = DEMO_LOCATIONS.find((l) => l.name === e.target.value);
              if (selected) setLoc1(selected);
            }}
            className="w-full bg-white border border-gov-grayBorder rounded-xl px-4 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-gov-emerald focus:ring-1 focus:ring-emerald-100"
          >
            {DEMO_LOCATIONS.map((loc, idx) => (
              <option key={idx} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gov-darkText mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" /> Target Location
          </label>
          <select
            value={loc2.name}
            onChange={(e) => {
              const selected = DEMO_LOCATIONS.find((l) => l.name === e.target.value);
              if (selected) setLoc2(selected);
            }}
            className="w-full bg-white border border-gov-grayBorder rounded-xl px-4 py-2.5 text-xs text-gov-darkText focus:outline-none focus:border-gov-emerald focus:ring-1 focus:ring-emerald-100"
          >
            {DEMO_LOCATIONS.map((loc, idx) => (
              <option key={idx} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={calculateDistance}
        disabled={loading}
        className="w-full bg-gradient-to-r from-gov-emerald to-gov-emeraldDark hover:from-gov-emeraldDark hover:to-gov-emerald text-gov-darkText font-bold py-3 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        {loading ? 'Calculating...' : 'Calculate Distance'}
      </button>

      {result && (
        <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 animate-fade-in">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <span className="text-gov-mediumText">Route:</span>
            <span className="text-gov-darkText font-semibold flex items-center gap-1">
              {result.location1} <ArrowRight className="w-3 h-3 text-gov-emerald" /> {result.location2}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center">
              <span className="text-[10px] text-gov-mediumText uppercase font-bold block">Kilometers</span>
              <span className="text-2xl font-black text-gov-emerald">{result.distanceKm} km</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center">
              <span className="text-[10px] text-gov-mediumText uppercase font-bold block">Miles</span>
              <span className="text-2xl font-black text-blue-600">{result.distanceMiles} mi</span>
            </div>
          </div>

          <div className="text-[11px] text-gov-mediumText pt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-gov-emerald shrink-0" />
            <span>
              Locations are automatically calculated to find the nearest match.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
