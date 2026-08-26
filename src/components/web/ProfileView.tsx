import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { SAMPLE_USERS } from '../../core/data/griMasterData';
import { UserRole } from '../../types';
import { 
  User, 
  CheckCircle, 
  Clock, 
  UserPlus, 
  Check, 
  Radio,
  KeyRound,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  Lock,
  Mail,
  MessageSquare,
  Send,
  Save,
  CheckCircle2
} from 'lucide-react';
import { EditUserContactModal } from '../admin/EditUserContactModal';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    loginAsUser, 
    setLoginModalOpen,
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
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-semibold">
            <User className="w-3.5 h-3.5" />
            <span>Firebase Authentication & Institutional Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            User Profile & Communication Governance
          </h1>
          <p className="text-sm text-slate-400">
            Manage your registered phone (for SMS & WhatsApp), official email ID, security password, and institutional profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Radio className={`w-3.5 h-3.5 ${isFirestoreLive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span>Database: <strong className="text-emerald-400">{isFirestoreLive ? 'Live Firestore' : 'Active'}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Current User Card & Firebase Sign-in */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border border-emerald-400/40 shadow-lg" 
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-emerald-400/40">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-white leading-snug">{currentUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 capitalize">
                    {currentUser.role}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {currentUser.regNumber || currentUser.designation || 'ID Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Attributes */}
            <div className="space-y-3 text-xs text-slate-300 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-100 text-right truncate max-w-[200px]">
                  {currentUser.department}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verification Status:</span>
                <span className={`font-bold capitalize flex items-center gap-1 ${
                  currentUser.approvalStatus === 'approved' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {currentUser.approvalStatus === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {currentUser.approvalStatus}
                </span>
              </div>
            </div>

            {/* Registered Communication Channels (SMS, WhatsApp, Email) */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <h4 className="font-bold text-xs text-white">Registered Channels</h4>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition"
                >
                  Edit Contacts
                </button>
              </div>

              {testStatus && (
                <div className="p-2 rounded-lg bg-sky-950/70 border border-sky-800 text-sky-300 text-[11px] flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{testStatus}</span>
                </div>
              )}

              <div className="space-y-2 text-xs">
                {/* Phone: SMS & WhatsApp */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800">
                        SMS & WhatsApp Phone
                      </span>
                    </div>
                    <p className="font-mono text-slate-100 text-xs mt-1">
                      {currentUser.phone || '+91 98421 77321'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuickTest('SMS')}
                      title="Send test SMS notification"
                      className="p-1.5 rounded-lg bg-sky-900/40 hover:bg-sky-800/60 text-sky-300 text-[10px] font-semibold border border-sky-700/50"
                    >
                      Test SMS
                    </button>
                    <button
                      onClick={() => handleQuickTest('WHATSAPP')}
                      title="Send test WhatsApp notice"
                      className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 text-[10px] font-semibold border border-emerald-700/50"
                    >
                      Test WA
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Official Email ID
                    </span>
                    <p className="font-mono text-emerald-400 text-xs mt-1 truncate max-w-[180px]">
                      {currentUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleQuickTest('EMAIL')}
                    title="Send test email notification"
                    className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 text-[10px] font-semibold border border-emerald-700/50"
                  >
                    Test Email
                  </button>
                </div>
              </div>
            </div>

            {/* Password Status Card */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isDefaultPassword 
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-200' 
                : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${isDefaultPassword ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">
                      {isDefaultPassword ? 'Provisional Password Active' : 'User-Defined Password Active'}
                    </h4>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {isDefaultPassword 
                        ? 'Account requires private password configuration.' 
                        : 'Securely protected by custom credentials.'}
                    </p>
                  </div>
                </div>

                <button
                  id="open-change-password-btn"
                  onClick={() => setPasswordChangeModalOpen(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isDefaultPassword
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>{isDefaultPassword ? 'Set Private Password' : 'Change Password'}</span>
                </button>
              </div>

              {isDefaultPassword && (
                <div className="text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-amber-800/50 flex items-center justify-between">
                  <span>Current Provisional Key:</span>
                  <code className="font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded">
                    {currentUser.tempPassword || 'GRI@Admin2026'}
                  </code>
                </div>
              )}
            </div>

            {/* Academic stats for students */}
            {currentUser.role === 'student' && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CGPA</span>
                  <strong className="text-emerald-400 text-base">{currentUser.cgpa || 8.84}</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Attendance</span>
                  <strong className="text-sky-400 text-base">{currentUser.attendance || 91.2}%</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Semester</span>
                  <strong className="text-amber-400 text-base">Sem {currentUser.semester || 4}</strong>
                </div>
              </div>
            )}

            {/* Institutional Identity Gateway Action */}
            <div className="space-y-3 pt-2">
              <button
                id="btn-open-institutional-gateway-profile"
                onClick={() => setLoginModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950/40"
              >
                <Lock className="w-4 h-4" />
                <span>Institutional Identity & Sign-In Gateway</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Persona Switcher & New Account Simulation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Quick Institutional Persona Switcher
                </h3>
                <p className="text-xs text-slate-400">
                  Select a test identity below to test role permissions, contact channels, and password workflows:
                </p>
              </div>
              <button
                onClick={() => setShowRegisterForm(!showRegisterForm)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register New</span>
              </button>
            </div>

            <div className="space-y-3">
              {SAMPLE_USERS.map((user) => {
                const isSelected = currentUser.id === user.id;
                const isUserDefault = user.passwordStatus === 'default_temp';

                return (
                  <div
                    key={user.id}
                    onClick={() => loginAsUser(user)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{user.name}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 capitalize">
                            {user.role}
                          </span>
                          {isUserDefault && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                              Provisional Key
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[250px]">
                          {user.department} {user.phone ? `• ${user.phone}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isSelected ? (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 hover:text-slate-300">
                          Switch
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Registration Form */}
          {showRegisterForm && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Register New User (SMS, WhatsApp phone & Email ID to Firestore)
              </h3>

              {registeredSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Account registered with SMS, WhatsApp & Email in Firestore! Sent to Central Admin for verification.</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Ananya Ramesh"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Registered Email ID *</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="ananya@ruraluniv.ac.in"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500">For institutional circulars & notifications.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Role *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty Member</option>
                      <option value="scholar">Research Scholar</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Phone Number (for SMS & WhatsApp Notices) *
                    </label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91 98421 XXXXX"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500">Registered phone for SMS emergency & WhatsApp alerts.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Register / Staff ID</label>
                  <input
                    type="text"
                    value={newRegNo}
                    onChange={(e) => setNewRegNo(e.target.value)}
                    placeholder="2026GRI5012"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/40"
                >
                  Submit Registration for Admin Approval
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Edit Contacts Modal */}
      <EditUserContactModal
        user={currentUser}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

