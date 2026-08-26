import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { SAMPLE_USERS } from '../../core/data/griMasterData';
import { UserRole } from '../../types';
import { 
  User, CheckCircle, Clock, UserPlus, Check, Radio,
  KeyRound, ShieldCheck, Smartphone, Lock, CheckCircle2, LogOut
} from 'lucide-react';
import { EditUserContactModal } from '../admin/EditUserContactModal';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    loginAsUser, 
    setLoginModalOpen,
    doLogout,
    registerPendingUser, 
    isFirestoreLive,
    setPasswordChangeModalOpen,
    sendTestChannelVerification
  } = useAppStore();
  
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  // New user registration form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newDept, setNewDept] = useState('Department of Computer Science & Applications');
  const [newRegNo, setNewRegNo] = useState('');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleQuickTest = async (channel: 'SMS' | 'WHATSAPP' | 'EMAIL') => {
    setTestStatus(`Dispatching test ${channel}...`);
    try {
      await sendTestChannelVerification(currentUser.id, channel);
      setTestStatus(`Test ${channel} delivered to ${channel === 'EMAIL' ? currentUser.email : (currentUser.phone || 'registered phone')}`);
      setTimeout(() => setTestStatus(null), 3500);
    } catch (e) {
      setTestStatus(`Failed to send test ${channel}`);
      setTimeout(() => setTestStatus(null), 3000);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    await registerPendingUser({
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept,
      regNumber: newRegNo || undefined,
      phone: newPhone || undefined,
      phoneVerified: false,
      emailVerified: false,
      smsAlertsEnabled: true,
      whatsappAlertsEnabled: true,
      emailCircularsEnabled: true,
    });

    setNewName('');
    setNewEmail('');
    setNewRegNo('');
    setNewPhone('+91 ');
    setRegisteredSuccess(true);
    setTimeout(() => {
      setRegisteredSuccess(false);
      setShowRegisterForm(false);
    }, 3000);
  };

  const isDefaultPassword = currentUser.passwordStatus === 'default_temp' || currentUser.mustChangePasswordOnLogin;

  return (
    <div className="space-y-8 sm:space-y-12 pb-24 animate-fadeIn max-w-6xl mx-auto px-4 sm:px-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium text-[#1A1F1D] tracking-tight leading-[1.1]">
            Identity & <br/>
            <span className="text-black/30">Governance.</span>
          </h1>
          <p className="text-xl text-[#5C6661] font-light leading-relaxed max-w-2xl">
            Manage your institutional profile, communication channels, and security credentials.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5EAE7] text-sm text-[#5C6661] shadow-sm">
          <Radio className={`w-4 h-4 ${isFirestoreLive ? 'text-[#0F4C3A] animate-pulse' : 'text-[#B45309]'}`} />
          <span>Database: <strong className={isFirestoreLive ? 'text-[#0F4C3A]' : 'text-[#B45309]'}>{isFirestoreLive ? 'Live Firestore' : 'Active'}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Current User Profile Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F4C3A] p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] text-white space-y-8 shadow-xl relative overflow-hidden">
            
            {/* User Identify Info */}
            <div className="flex items-center gap-6">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-md" 
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white text-[#0F4C3A] flex items-center justify-center text-3xl font-display font-medium shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold font-display leading-snug">{currentUser.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 uppercase tracking-widest">
                    {currentUser.role}
                  </span>
                  <span className="text-sm font-mono text-white/70">
                    {currentUser.regNumber || currentUser.designation || 'ID Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Attributes */}
            <div className="space-y-4 text-sm bg-white/10 p-6 rounded-[1.5rem]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-white/70">Department</span>
                <span className="font-bold text-right max-w-[200px] truncate">{currentUser.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Verification Status</span>
                <span className={`font-bold capitalize flex items-center gap-2 ${
                  currentUser.approvalStatus === 'approved' ? 'text-[#34D399]' : 'text-[#FCD34D]'
                }`}>
                  {currentUser.approvalStatus === 'approved' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {currentUser.approvalStatus}
                </span>
              </div>
            </div>

            {/* Channels */}
            <div className="bg-white text-[#1A1F1D] p-6 rounded-[1.5rem] space-y-4 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[#0369A1]">
                  <Smartphone className="w-5 h-5" />
                  <h4 className="font-bold text-sm">Registered Channels</h4>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-3 py-1 rounded-full bg-[#F2F6F4] hover:bg-[#E5EAE7] text-[#5C6661] text-xs font-bold transition-colors"
                >
                  Edit Contacts
                </button>
              </div>

              {testStatus && (
                <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0369A1] text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" /> {testStatus}
                </div>
              )}

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#F2F6F4] flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] uppercase tracking-widest">SMS & WhatsApp</span>
                    <p className="font-mono text-sm font-bold mt-2">{currentUser.phone || '+91 98421 77321'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQuickTest('SMS')} className="flex-1 py-1.5 rounded-lg bg-white border border-[#E5EAE7] text-[#0369A1] text-xs font-bold hover:shadow-sm">Test SMS</button>
                    <button onClick={() => handleQuickTest('WHATSAPP')} className="flex-1 py-1.5 rounded-lg bg-[#E5F0EB] text-[#0F4C3A] text-xs font-bold hover:shadow-sm">Test WA</button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F2F6F4] flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#E5F0EB] text-[#0F4C3A] uppercase tracking-widest">Official Email</span>
                    <p className="text-sm font-bold mt-2 truncate">{currentUser.email}</p>
                  </div>
                  <button onClick={() => handleQuickTest('EMAIL')} className="w-full py-1.5 rounded-lg bg-white border border-[#E5EAE7] text-[#0F4C3A] text-xs font-bold hover:shadow-sm">Test Email</button>
                </div>
              </div>
            </div>

            {/* Password Status */}
            <div className={`p-6 rounded-[1.5rem] ${
              isDefaultPassword ? 'bg-[#FFFBEB] text-[#92400E]' : 'bg-[#E5F0EB] text-[#0F4C3A]'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm mb-1">{isDefaultPassword ? 'Provisional Password Active' : 'Private Password Set'}</h4>
                  <p className="text-xs opacity-80">{isDefaultPassword ? 'Please configure a private password.' : 'Account secured with custom credentials.'}</p>
                </div>
                <button
                  onClick={() => setPasswordChangeModalOpen(true)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 flex-shrink-0 transition-colors ${
                    isDefaultPassword ? 'bg-[#B45309] text-white hover:bg-[#92400E]' : 'bg-[#0F4C3A] text-white hover:bg-[#0A3327]'
                  }`}
                >
                  <Lock className="w-3 h-3" /> Change
                </button>
              </div>
              {isDefaultPassword && (
                <div className="mt-4 p-3 bg-white rounded-xl text-xs flex justify-between items-center shadow-sm">
                  <span className="font-medium">Current Provisional Key:</span>
                  <code className="font-mono font-bold bg-[#FFFBEB] px-2 py-1 rounded">{currentUser.tempPassword || 'GRI@Admin2026'}</code>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setLoginModalOpen(true)}
                className="w-full py-4 rounded-full bg-white text-[#0F4C3A] font-bold hover:bg-[#F2F6F4] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-5 h-5" /> Identity & Sign-In Gateway
              </button>

              {currentUser.role !== 'guest' && (
                <button
                  onClick={async () => {
                    await doLogout();
                    setTestStatus('Session purged & all tokens wiped successfully.');
                    setTimeout(() => setTestStatus(null), 4000);
                  }}
                  className="w-full py-4 rounded-full bg-[#BE123C] text-white font-bold hover:bg-[#9F1239] transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right 7 Cols: Persona Switcher & New Account Simulation */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-display font-medium text-[#1A1F1D]">Persona Switcher</h3>
                <p className="text-[#5C6661] mt-2">Test role permissions and workflows.</p>
              </div>
              <button
                onClick={() => setShowRegisterForm(!showRegisterForm)}
                className="px-6 py-3 rounded-full bg-[#0F4C3A] text-white font-bold text-sm flex items-center gap-2 hover:bg-[#0A3327] transition-colors shadow-md whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" /> Register New
              </button>
            </div>

            <div className="space-y-4">
              {SAMPLE_USERS.map((user) => {
                const isSelected = currentUser.id === user.id;
                const isUserDefault = user.passwordStatus === 'default_temp';

                return (
                  <div
                    key={user.id}
                    onClick={() => loginAsUser(user)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-[#0F4C3A] bg-[#E5F0EB] shadow-md'
                        : 'border-[#E5EAE7] bg-white hover:border-[#0F4C3A]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg font-display ${
                        isSelected ? 'bg-[#0F4C3A] text-white' : 'bg-[#F2F6F4] text-[#0F4C3A]'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-[#1A1F1D]">{user.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${isSelected ? 'bg-[#0F4C3A] text-white' : 'bg-[#E5EAE7] text-[#5C6661]'}`}>
                            {user.role}
                          </span>
                          {isUserDefault && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-[#FFFBEB] text-[#B45309]">
                              Provisional
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#5C6661] truncate max-w-[280px]">
                          {user.department} {user.phone ? `• ${user.phone}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      {isSelected ? (
                        <span className="w-8 h-8 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-[#0F4C3A]">Switch</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Registration Form */}
          {showRegisterForm && (
            <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-xl animate-fadeIn">
              <h3 className="text-2xl font-display font-medium text-[#1A1F1D] mb-8">
                Register New User
              </h3>

              {registeredSuccess && (
                <div className="mb-8 p-4 rounded-2xl bg-[#E5F0EB] text-[#0F4C3A] font-medium flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Account registered to Firestore. Pending Admin Approval.
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1A1F1D] mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      className="w-full bg-[#F2F6F4] rounded-xl p-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1A1F1D] mb-2">Email ID *</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      className="w-full bg-[#F2F6F4] rounded-xl p-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1A1F1D] mb-2">Role *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full bg-[#F2F6F4] rounded-xl p-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty Member</option>
                      <option value="scholar">Research Scholar</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1A1F1D] mb-2">Phone Number *</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      required
                      className="w-full bg-[#F2F6F4] rounded-xl p-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1A1F1D] mb-2">Register / Staff ID</label>
                  <input
                    type="text"
                    value={newRegNo}
                    onChange={(e) => setNewRegNo(e.target.value)}
                    className="w-full bg-[#F2F6F4] rounded-xl p-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#0F4C3A] hover:bg-[#0A3327] text-white font-bold text-lg transition-colors shadow-lg mt-4"
                >
                  Submit Registration
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <EditUserContactModal
        user={currentUser}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};
