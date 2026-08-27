import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { QrCode, X, CheckCircle2, Camera, MapPin, Sparkles } from 'lucide-react';

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, logAdminAction } = useAppStore();
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [checkedInVenue, setCheckedInVenue] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  if (!isOpen) return null;

  const handleCheckIn = async (venueName: string, codeId: string) => {
    setScanning(true);
    setTimeout(async () => {
      setScanning(false);
      setCheckedInVenue(venueName);
      setFlash(true);
      setTimeout(() => setFlash(false), 500);

      // Trigger haptic feedback if supported
      try {
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch {}

      // Sync to admin audit log in real-time
      await logAdminAction(
        'CREATE',
        'ATTENDANCE_CHECKIN',
        codeId,
        `Check-in: ${venueName}`,
        `Student ${currentUser.name} (${currentUser.regNumber || currentUser.email}) checked into ${venueName} via QR Code scanner at ${new Date().toLocaleTimeString()}`
      );
    }, 1000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleCheckIn(`Classroom/Event [${manualCode.toUpperCase()}]`, manualCode);
  };

  const resetAndClose = () => {
    setCheckedInVenue(null);
    setManualCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className={`border border-gray-100 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center transition-all duration-300 ${
        flash ? 'bg-emerald-50 dark:bg-emerald-950/80 ring-4 ring-emerald-400 scale-105' : 'bg-white dark:bg-slate-900'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">QR Check-In Scanner</h3>
          </div>
          <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {checkedInVenue ? (
          <div className="py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Check-In Successful!</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{checkedInVenue}</p>
              <p className="text-[11px] text-gray-400 mt-2">Recorded and synced to Admin Audit Log in real-time.</p>
            </div>
            <button
              onClick={() => setCheckedInVenue(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-900/20"
            >
              Scan Another Code
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Simulated Camera Viewfinder */}
            <div className="relative h-48 bg-slate-950 rounded-2xl border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center overflow-hidden group">
              {scanning ? (
                <div className="space-y-2 text-emerald-400">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold">Verifying QR Signature...</p>
                </div>
              ) : (
                <>
                  <Camera className="w-10 h-10 text-emerald-500/60 mb-2 animate-pulse" />
                  <p className="text-xs text-gray-400">Position classroom or event QR code within frame</p>
                  <div className="absolute inset-0 border-[3px] border-emerald-500/30 rounded-2xl pointer-events-none" />
                </>
              )}
            </div>

            {/* Quick Demo QR Presets */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Demo Check-In Presets</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCheckIn('Room C-204 (Data Structures)', 'C204')}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-left hover:border-emerald-500 transition text-xs"
                >
                  <p className="font-bold text-gray-900 dark:text-white">Room C-204</p>
                  <p className="text-[10px] text-emerald-600">Data Structures</p>
                </button>
                <button
                  onClick={() => handleCheckIn('Auditorium (Tech Fest 2026)', 'AUD-TF')}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-left hover:border-emerald-500 transition text-xs"
                >
                  <p className="font-bold text-gray-900 dark:text-white">Auditorium</p>
                  <p className="text-[10px] text-emerald-600">Tech Fest 2026</p>
                </button>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="pt-2 border-t border-gray-100 dark:border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Or enter room/event code..."
                  className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs"
                >
                  Check In
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
