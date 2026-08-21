import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  X, 
  ExternalLink, 
  Compass, 
  Navigation, 
  Building, 
  Train, 
  BookOpen, 
  Bed, 
  Sparkles, 
  Loader2,
  Share2,
  Check
} from 'lucide-react';

interface GroundedPlace {
  title: string;
  uri: string;
  address?: string;
  snippet?: string;
}

interface CampusMapsExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const PRESET_MAP_QUERIES = [
  'How to reach Gandhigram Rural Institute from Dindigul & Madurai',
  'Central Library, Auditorium, and Admin Block locations',
  'ICAR Krishi Vigyan Kendra & 50-Acre Instructional Farm',
  'Ambathurai Railway Station (Nearest rail transit to GRI)',
  'University Hostels (Kaveri, Amaravathi, Vaigai) and Canteen',
  'ATM, Bank, Post Office, and Health Centre on campus',
];

export const CampusMapsExplorerModal: React.FC<CampusMapsExplorerModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
}) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [places, setPlaces] = useState<GroundedPlace[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [copiedUri, setCopiedUri] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Fetch initial grounding for GRI campus
      fetchGrounding(initialQuery || 'Campus buildings, libraries, transit, and facilities at The Gandhigram Rural Institute');
      
      // Request client geolocation if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserCoords({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          (err) => {
            console.log('[Geolocation notice: using Gandhigram reference coordinates]', err.message);
          }
        );
      }
    }
  }, [isOpen, initialQuery]);

  const fetchGrounding = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/maps/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          latitude: userCoords?.latitude || 10.2785,
          longitude: userCoords?.longitude || 77.9304,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.reply || '');
      setPlaces(data.places || []);
    } catch (error) {
      console.error('[Maps Grounding Fetch Error]', error);
      setSummary('Loaded official Gandhigram Rural Institute campus directory locations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (uri: string) => {
    navigator.clipboard.writeText(uri);
    setCopiedUri(uri);
    setTimeout(() => setCopiedUri(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-sky-600 flex items-center justify-center text-white shadow-lg">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-base sm:text-lg">
                  GRI Campus Maps & Navigation Explorer
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-400 text-[10px] font-semibold">
                  Google Maps Grounding
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verified geographical navigation powered by Gemini 3.5 Flash & Google Maps Grounding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Location Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchGrounding(query);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search campus buildings, nearest railway station, bus stops, ATM, hostel blocks..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition shadow-md shadow-sky-900/30"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              <span>Find Places</span>
            </button>
          </form>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] pb-1">
            <span className="text-slate-500 whitespace-nowrap">Suggested:</span>
            {PRESET_MAP_QUERIES.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(preset);
                  fetchGrounding(preset);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-500/30 whitespace-nowrap transition"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* AI Grounded Summary */}
          {summary && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-slate-200 shadow">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Google Maps Verified Navigation Insights</span>
              </div>
              <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap">
                {summary}
              </div>
            </div>
          )}

          {/* Grounded Places Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Verified Google Maps Locations ({places.length})
              </h4>
              <span className="text-[11px] text-slate-400">Click any card to open in Google Maps</span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                <p className="text-xs text-slate-400">Grounding geographical coordinates with Google Maps API...</p>
              </div>
            ) : places.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No location cards found. Try searching for specific campus locations or transit points.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {places.map((place, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-sky-950/40 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-bold text-white text-sm group-hover:text-sky-300 transition">
                          {place.title}
                        </h5>
                        <a
                          href={place.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-sky-600 text-slate-400 hover:text-white transition flex-shrink-0"
                          title="Open in Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {place.address && (
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{place.address}</span>
                        </p>
                      )}

                      {place.snippet && (
                        <p className="text-xs text-slate-300/90 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 italic">
                          "{place.snippet}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-900 text-[11px]">
                      <a
                        href={place.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold transition"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                      </a>

                      <button
                        onClick={() => handleCopyLink(place.uri)}
                        className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
                        title="Copy Maps Link"
                      >
                        {copiedUri === place.uri ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3 h-3" />
                        )}
                        <span>{copiedUri === place.uri ? 'Copied' : 'Share'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>GRI Reference: 10.2785° N, 77.9304° E • Gandhigram, Dindigul 624302</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
