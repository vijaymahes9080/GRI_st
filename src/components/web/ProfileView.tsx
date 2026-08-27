import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  User, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Book, 
  QrCode, 
  Bell, 
  ChevronRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { AccessRestricted } from '../common/AccessRestricted';
import { DigitalIdCard } from '../common/DigitalIdCard';
import { AttendanceHeatmap } from '../common/AttendanceHeatmap';
import { QRCodeScannerModal } from '../common/QRCodeScannerModal';
import { ALL_NOTIFICATION_CATEGORIES, DEFAULT_SUBSCRIBED_CATEGORY_IDS } from '../../core/data/notificationCategories';

export const ProfileView: React.FC = () => {
  const { currentUser, setLoginModalOpen, doLogout, setTab } = useAppStore();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const subscribedCategoryIds = currentUser.notificationPreferences?.subscribedCategories || DEFAULT_SUBSCRIBED_CATEGORY_IDS;

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
    <div className="flex flex-col space-y-6 px-4 sm:px-6 pt-4 pb-24 max-w-xl mx-auto">
      
      {/* 1. Digital ID Card Component */}
      <DigitalIdCard user={currentUser} />

      {/* QR Code Scanner Trigger Button */}
      <button
        onClick={() => setIsScannerOpen(true)}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.01]"
      >
        <QrCode className="w-5 h-5" />
        <span>Open QR Classroom & Event Scanner</span>
      </button>

      {/* 2. D3.js Attendance Heatmap */}
      {currentUser.role === 'student' && <AttendanceHeatmap />}

      {/* 3. Subscribed Notification Categories Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
              Subscribed Alert Categories ({subscribedCategoryIds.length})
            </h3>
          </div>
          <button
            onClick={() => setTab('settings')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            Customize <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {ALL_NOTIFICATION_CATEGORIES.filter(c => subscribedCategoryIds.includes(c.id)).map((cat) => (
            <span
              key={cat.id}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${cat.bgLight}`}
            >
              {cat.shortName}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Academic Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Academic Details</h3>
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Department & School</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.department}</p>
              </div>
            </div>
            {currentUser.regNumber && (
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Registration / Roll No.</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.regNumber}</p>
                </div>
              </div>
            )}
            {currentUser.cgpa && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold text-sm">%</div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Cumulative CGPA</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.cgpa} (Semester {currentUser.semester || 4})</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Official Channels</h3>
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Institutional Email</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Emergency Mobile Number</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.phone || '+91 - Not Added'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation actions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
          {currentUser.role === 'admin' || currentUser.role === 'super_admin' ? (
            <button 
              onClick={() => setTab('admin')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900 dark:text-white text-sm">Admin Dashboard</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ) : null}

          <button 
            onClick={() => setTab('settings')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              <span className="font-bold text-gray-900 dark:text-white text-sm">Settings & Notification Subscriptions</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button 
            onClick={() => { doLogout(); setTab('home'); }}
            className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-600 dark:text-red-400"
          >
            <div className="flex items-center gap-3 font-bold text-sm">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>

      <QRCodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
};
