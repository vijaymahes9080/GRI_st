import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { ShieldCheck, Barcode, Cloud, CloudCheck, RefreshCw } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface DigitalIdCardProps {
  user: UserProfile;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ user }) => {
  const [isSynced, setIsSynced] = useState(true);
  const studentIdString = `GRI-INST-ID:${user.regNumber || 'GRI/2026/MCA/1042'} | Name:${user.name} | Dept:${user.department}`;

  useEffect(() => {
    const handleOnline = () => setIsSynced(true);
    const handleOffline = () => setIsSynced(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsSynced(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-emerald-700/30">
      {/* Background Watermark / Glow */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400 font-extrabold text-sm border border-white/20">
            GRI
          </div>
          <div>
            <h4 className="text-xs font-extrabold tracking-wider uppercase text-emerald-300">Gandhigram Rural Institute</h4>
            <p className="text-[10px] text-gray-300">Deemed to be University • Ministry of Education, Govt. of India</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Firestore Sync Badge */}
          <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
            isSynced 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSynced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {isSynced ? 'Firestore Synced' : 'Queued Offline'}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="flex gap-4 items-center mb-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-2xl font-black text-white shadow-lg overflow-hidden border-2 border-white/20">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.split(' ').map(n => n[0]).join('').substring(0, 2)
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-emerald-950 flex items-center justify-center text-[10px]">
            ✓
          </div>
        </div>

        <div className="space-y-1 flex-1">
          <h3 className="text-base font-extrabold tracking-tight text-white">{user.name}</h3>
          <p className="text-xs text-emerald-300 font-semibold">{user.regNumber || 'GRI/2026/MCA/1042'}</p>
          <p className="text-[11px] text-gray-300 line-clamp-1">{user.department}</p>
          <div className="flex gap-2 pt-1">
            <span className="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-bold text-gray-200">
              Sem {user.semester || 4}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-bold text-gray-200">
              CGPA {user.cgpa || 8.75}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Barcode and Dynamic QR code footer */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center justify-between">
        <div className="space-y-1.5 flex-1 pr-4">
          <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-semibold">
            <Barcode className="w-3.5 h-3.5" />
            <span>Digital Barcode ID</span>
          </div>
          {/* Simulated Barcode */}
          <div className="flex items-center gap-0.5 h-7 bg-white/90 rounded px-1">
            {[...Array(32)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-900 h-full"
                style={{
                  width: `${(i % 3 === 0 ? 3 : (i % 2 === 0 ? 2 : 1))}px`,
                  opacity: i % 7 === 0 ? 0.6 : 1,
                }}
              />
            ))}
          </div>
          <p className="text-[9px] text-gray-400 font-mono tracking-widest">||| | |||| || ||| || |||||| | |||</p>
        </div>

        {/* Dynamic QR Code Generator using qrcode.react */}
        <div className="bg-white p-1.5 rounded-xl shadow-md flex flex-col items-center justify-center">
          <QRCodeCanvas
            value={studentIdString}
            size={52}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="M"
            includeMargin={false}
          />
          <span className="text-[8px] text-slate-800 font-bold mt-1">SCAN ID</span>
        </div>
      </div>
    </div>
  );
};

