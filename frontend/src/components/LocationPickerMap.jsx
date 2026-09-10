import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Search, Navigation, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

// Custom Leaflet Pin Icon
const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map Controller Component for Recentering
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
}

// Map Click Listener
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({
  initialLat = 28.6519,
  initialLng = 77.1910,
  initialAddress = '',
  initialState = '',
  initialDistrict = '',
  initialCity = '',
  initialPincode = '',
  onLocationChange,
}) {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const markerRef = useRef(null);

  // Update map position when external initial coordinates change (e.g. from state/district dropdown selection)
  useEffect(() => {
    if (initialLat && initialLng && (initialLat !== position.lat || initialLng !== position.lng)) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  useEffect(() => {
    reverseGeocode(position.lat, position.lng);
  }, [position]);

  // Reverse Geocoding with OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SevaParivartan-TeacherPortal/2.0 (contact@sevaparivartan.in)',
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const dispAddress = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        setAddress(dispAddress);

        if (onLocationChange) {
          onLocationChange({
            lat,
            lng,
            address: dispAddress,
            raw: data,
          });
        }
      }
    } catch (err) {
      console.warn('[Nominatim Reverse Geocode Fallback]', err.message);
      const fallbackAddr = initialAddress || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      setAddress(fallbackAddr);
      if (onLocationChange) {
        onLocationChange({
          lat,
          lng,
          address: fallbackAddr,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Draggable Marker Event Handlers
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition({ lat: newPos.lat, lng: newPos.lng });
        }
      },
    }),
    []
  );

  // Search Location via Nominatim Forward Geocoding
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.get(`/transfers/geocode-search?q=${encodeURIComponent(searchQuery)}`);
      if (res.data.success && res.data.results.length > 0) {
        setSearchResults(res.data.results);
      } else {
        // Fallback fetch
        const fetchRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
        );
        const data = await fetchRes.json();
        if (data.length > 0) {
          setSearchResults(
            data.map((d) => ({
              displayName: d.display_name,
              lat: parseFloat(d.lat),
              lon: parseFloat(d.lon),
            }))
          );
        } else {
          setErrorMsg('No matching locations found for query.');
        }
      }
    } catch {
      setErrorMsg('Location search unavailable. Pick location directly on the map.');
    } finally {
      setLoading(false);
    }
  };

  const selectSearchResult = (item) => {
    setPosition({ lat: item.lat, lng: item.lon });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleDetectCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        () => {
          setLoading(false);
          setErrorMsg('GPS access denied. Drag the pin on the map to set your school location.');
        }
      );
    }
  };

  return (
    <div className="bg-white border border-slate-700/80 rounded-2xl p-4 shadow-xl text-slate-200 space-y-3">
      {/* Search Bar with Autocomplete & GPS Detect */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            type="text"
            placeholder="Search school name, block, district or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-gov-darkText placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <button
            type="submit"
            className="absolute right-2 top-1.5 bg-emerald-600 hover:bg-emerald-500 text-gov-darkText text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        <button
          type="button"
          onClick={handleDetectCurrentLocation}
          className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          <Navigation className="w-3.5 h-3.5" /> Detect Location
        </button>
      </div>

      {/* Autocomplete Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-2 max-h-48 overflow-y-auto space-y-1">
          {searchResults.map((item, idx) => (
            <div
              key={idx}
              onClick={() => selectSearchResult(item)}
              className="p-2 hover:bg-slate-700 rounded-lg cursor-pointer text-xs flex items-center gap-2 text-slate-200"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{item.displayName}</span>
            </div>
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interactive Leaflet Map */}
      <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden relative border border-slate-700 shadow-inner">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={[position.lat, position.lng]}
            ref={markerRef}
            icon={pinIcon}
          >
            <Popup>
              <div className="text-xs font-sans">
                <strong className="text-gov-navy block font-bold">School Location (Draggable Pin)</strong>
                <p className="text-slate-600 mt-0.5">{address || 'Drag pin to adjust school coordinates'}</p>
              </div>
            </Popup>
          </Marker>
          <RecenterMap lat={position.lat} lng={position.lng} />
          <MapClickHandler onLocationSelect={(lat, lng) => setPosition({ lat, lng })} />
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-30 flex items-center justify-center text-xs font-semibold text-emerald-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Fetching OpenStreetMap Geocode...
          </div>
        )}
      </div>

      {/* Current Location Summary Bar */}
      <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-gov-darkText font-bold truncate">
              {initialCity || 'City'}, {initialDistrict || 'District'}, {initialState || 'State'}
            </span>
          </div>
          <span className="text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
            PIN: {initialPincode || '110001'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/80">
          <span className="truncate">Address: {address || 'School Location Tagged'}</span>
          <span className="text-slate-300 font-mono shrink-0 ml-2">
            Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
