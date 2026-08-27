import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { User, LogOut, Settings, ShieldCheck, Mail, Phone, Book, QrCode } from 'lucide-react';
import { AccessRestricted } from '../common/AccessRestricted';
import { DigitalIdCard } from '../common/DigitalIdCard';
import { AttendanceHeatmap } from '../common/AttendanceHeatmap';
import { QRCodeScannerModal } from '../common/QRCodeScannerModal';

export const ProfileView: React.FC = () => {
  const { currentUser, setLoginModalOpen, doLogout, setTab } = useAppStore();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  if (currentUser.role === 'guest') {
    return (
      <div className="p-5">
        <AccessRestricted
          title="Authentication Required"
          message="Please sign in to view your profile."
          resourceName="User Profile"
          primaryActionText="Sign In"
          onPrimaryAction={() => setLoginModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 px-5 pt-4 pb-24 max-w-md mx-auto">
      
      {/* 1. Digital ID Card Component */}
      <DigitalIdCard user={currentUser} />

      {/* QR Code Scanner Trigger Button */}
      <button
        onClick={() => setIsScannerOpen(true)}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02]"
      >
        <QrCode className="w-5 h-5" />
        <span>Open QR Classroom & Event Scanner</span>
      </button>

      {/* 2. D3.js Attendance Heatmap */}
      {currentUser.role === 'student' && <AttendanceHeatmap />}

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Academic Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Department</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.department}</p>
              </div>
            </div>
            {currentUser.regNumber && (
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Registration No.</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.regNumber}</p>
                </div>
              </div>
            )}
            {currentUser.cgpa && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">%</div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">CGPA</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.cgpa}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.phone || '+91 - Not Added'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {currentUser.role === 'admin' || currentUser.role === 'super_admin' ? (
            <button 
              onClick={() => setTab('admin')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900 dark:text-white text-sm">Admin Dashboard</span>
              </div>
            </button>
          ) : null}
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              <span className="font-bold text-gray-900 dark:text-white text-sm">Settings</span>
            </div>
          </button>
          <button 
            onClick={() => { doLogout(); setTab('home'); }}
            className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm">Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      <QRCodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
};
