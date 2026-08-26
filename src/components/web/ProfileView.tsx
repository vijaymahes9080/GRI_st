import React from 'react';
import { useAppStore } from '../../core/store/appStore';
import { User, LogOut, Settings, ShieldCheck, Mail, Phone, Book } from 'lucide-react';
import { AccessRestricted } from '../common/AccessRestricted';

export const ProfileView: React.FC = () => {
  const { currentUser, setLoginModalOpen, doLogout, setTab } = useAppStore();

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
    <div className="flex flex-col space-y-6 px-5 pt-4 pb-24  max-w-md mx-auto">
      
      <div className="flex flex-col items-center pt-4 pb-6">
        <div className="relative mb-4">
          {currentUser.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-50 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-800 ring-4 ring-emerald-50 shadow-lg">
              {currentUser.name.charAt(0)}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
        <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1">
          {currentUser.role}
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Academic Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Department</p>
                <p className="text-sm font-semibold text-gray-900">{currentUser.department}</p>
              </div>
            </div>
            {currentUser.regNumber && (
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Registration No.</p>
                  <p className="text-sm font-semibold text-gray-900">{currentUser.regNumber}</p>
                </div>
              </div>
            )}
            {currentUser.cgpa && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">%</div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">CGPA</p>
                  <p className="text-sm font-semibold text-gray-900">{currentUser.cgpa}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">{currentUser.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">{currentUser.phone || '+91 - Not Added'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {currentUser.role === 'admin' || currentUser.role === 'super_admin' ? (
            <button 
              onClick={() => setTab('admin')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900 text-sm">Admin Dashboard</span>
              </div>
            </button>
          ) : null}
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-900 text-sm">Settings</span>
            </div>
          </button>
          <button 
            onClick={() => { doLogout(); setTab('home'); }}
            className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
