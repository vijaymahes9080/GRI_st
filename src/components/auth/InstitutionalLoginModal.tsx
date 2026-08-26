import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { SAMPLE_USERS, DEFAULT_GENERAL_PASSWORD } from '../../core/data/griMasterData';
import { UserRole, UserProfile } from '../../types';
import { GRIEmblem } from '../common/GRIEmblem';
import { 
  Building2, 
  GraduationCap, 
  Shield, 
  UserCheck, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  X,
  Compass,
  BookOpen,
  Briefcase
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const InstitutionalLoginModal: React.FC<Props> = ({ isOpen, onClose, initialRole }) => {
  const { 
    loginWithInstitutionalCredentials, 
    loginAsUser, 
    continueAsGuest,
    usersList 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'student_staff' | 'quick_personas' | 'guest'>('student_staff');
  const [identifier, setIdentifier] = useState(
    initialRole === 'admin' 
      ? 'admin@ruraluniv.ac.in' 
      : initialRole === 'faculty' 
      ? 'sundaram.cs@ruraluniv.ac.in' 
      : '22104018@ruraluniv.ac.in'
  );
  const [password, setPassword] = useState(DEFAULT_GENERAL_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInstitutionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your Institutional Registration No. / Email and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithInstitutionalCredentials(identifier.trim(), password);
      setSuccessMsg(`Welcome, ${user.name}! Authenticated with role: ${user.role.toUpperCase()}`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickPersona = (user: UserProfile) => {
    loginAsUser(user);
    setSuccessMsg(`Switched identity to ${user.name} (${user.role.toUpperCase()})`);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1F1D]/40 backdrop-blur-md animate-fadeIn">
      <div 
        id="gri-institutional-login-modal"
        className="relative w-full max-w-2xl bg-white border border-[#E5EAE7] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#E5F0EB] via-white to-white p-6 border-b border-[#E5EAE7] flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <GRIEmblem className="w-12 h-12 flex-shrink-0 drop-shadow-md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                  Institutional Identity Gateway
                </span>
                <span className="text-[10px] text-[#5C6661] font-mono">Samarth & ERP Portal</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#1A1F1D] mt-1 font-display">
                The Gandhigram Rural Institute
              </h2>
              <p className="text-xs text-[#5C6661]">
                (Deemed to be University) — NAAC 'A++' Grade
              </p>
            </div>
          </div>

          <button
            id="close-login-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#5C6661] hover:text-[#1A1F1D] hover:bg-[#F2F6F4] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5EAE7] bg-[#F2F6F4] px-6 pt-3 gap-2">
          <button
            id="tab-login-credentials"
            onClick={() => { setActiveTab('student_staff'); setErrorMsg(null); }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'student_staff'
                ? 'border-emerald-500 text-[#0F4C3A]'
                : 'border-transparent text-[#5C6661] hover:text-[#1A1F1D]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Student & Staff Sign-In</span>
          </button>

          <button
            id="tab-quick-personas"
            onClick={() => { setActiveTab('quick_personas'); setErrorMsg(null); }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'quick_personas'
                ? 'border-emerald-500 text-[#0F4C3A]'
                : 'border-transparent text-[#5C6661] hover:text-[#1A1F1D]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Identities</span>
          </button>

          <button
            id="tab-guest-portal"
            onClick={() => { setActiveTab('guest'); setErrorMsg(null); }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'guest'
                ? 'border-emerald-500 text-[#0F4C3A]'
                : 'border-transparent text-[#5C6661] hover:text-[#1A1F1D]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Guest Public Portal</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-semibold">Authentication Notice</p>
                <p className="text-[11px] text-rose-200/90 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0F4C3A] flex-shrink-0" />
              <p className="font-medium">{successMsg}</p>
            </div>
          )}

          {activeTab === 'student_staff' && (
            <form onSubmit={handleInstitutionalSubmit} className="space-y-4">
              <div className="bg-[#F2F6F4] p-4 rounded-2xl border border-[#E5EAE7] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1F1D] mb-1.5 flex items-center justify-between">
                    <span>Institutional ID / Email / Registration No.</span>
                    <span className="text-[10px] text-[#0F4C3A] font-normal">@ruraluniv.ac.in</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5C6661] absolute left-3.5 top-3" />
                    <input
                      id="input-login-identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 22104018@ruraluniv.ac.in or GRI-MCA-042"
                      required
                      className="w-full bg-white border border-[#E5EAE7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1A1F1D] placeholder:text-[#5C6661] focus:border-[#0F4C3A] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1F1D] mb-1.5 flex items-center justify-between">
                    <span>Institutional Password</span>
                    <span className="text-[10px] text-[#5C6661] font-mono">Default: {DEFAULT_GENERAL_PASSWORD}</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#5C6661] absolute left-3.5 top-3" />
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter institutional password"
                      required
                      className="w-full bg-white border border-[#E5EAE7] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1A1F1D] placeholder:text-[#5C6661] focus:border-[#0F4C3A] focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#5C6661] hover:text-[#1A1F1D] transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#5C6661] px-1">
                <span>Protected by Server RBAC & Audit Log</span>
                <span className="text-[#0F4C3A] hover:underline cursor-pointer">
                  Need Help? (ICT Desk Ext 371)
                </span>
              </div>

              <button
                id="btn-submit-institutional-login"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[#1A1F1D] font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950/40 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authenticate & Access Personalized Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-[#FDFDFB] border border-[#E5EAE7] text-[11px] text-[#5C6661]">
                <span className="font-semibold text-[#1A1F1D]">Note on Security Policy:</span> First-time logins using the provisional university key (<code className="text-[#0F4C3A] font-mono">GRI#2026</code>) will automatically trigger mandatory two-factor multi-channel password setup.
              </div>
            </form>
          )}

          {activeTab === 'quick_personas' && (
            <div className="space-y-3">
              <p className="text-xs text-[#1A1F1D]">
                Choose a pre-configured institutional role to immediately experience personalized dashboards, dynamic navigation, filtered circulars, and role-based permissions:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_USERS.map((user) => {
                  const roleColors = {
                    student: 'border-sky-500/40 bg-sky-950/20 text-sky-300',
                    faculty: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
                    admin: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
                    super_admin: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
                    exam_cell: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
                    dean: 'border-teal-500/40 bg-teal-950/20 text-teal-300',
                    hod: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
                    guest: 'border-[#E5EAE7] bg-[#FDFDFB] text-[#5C6661]',
                  }[user.role] || 'border-[#E5EAE7] bg-white text-[#1A1F1D]';

                  const RoleIcon = {
                    student: GraduationCap,
                    faculty: BookOpen,
                    admin: Shield,
                    super_admin: Shield,
                    exam_cell: Briefcase,
                    dean: Building2,
                    hod: Building2,
                    guest: Compass,
                  }[user.role] || UserCheck;

                  return (
                    <button
                      key={user.id}
                      id={`quick-persona-${user.id}`}
                      onClick={() => handleSelectQuickPersona(user)}
                      className="p-3 rounded-2xl border border-[#E5EAE7] hover:border-[#0F4C3A] bg-[#1A1F1D]/40 hover:bg-white text-left transition flex items-start gap-3 group"
                    >
                      <div className={`p-2 rounded-xl border ${roleColors} flex-shrink-0 mt-0.5`}>
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#1A1F1D] group-hover:text-emerald-300 truncate">
                            {user.name}
                          </h4>
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${roleColors}`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#5C6661] truncate mt-0.5">
                          {user.department}
                        </p>
                        <p className="text-[10px] font-mono text-[#5C6661] truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'guest' && (
            <div className="bg-[#1A1F1D]/40 p-5 rounded-2xl border border-[#E5EAE7] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-600/40 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1F1D]">Public Institutional Access</h3>
                  <p className="text-xs text-[#5C6661]">
                    Explore NAAC 'A++' academic programmes, public circulars, research projects, and campus facilities.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#1A1F1D] bg-[#F2F6F4] p-3.5 rounded-xl border border-[#E5EAE7]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C3A]" />
                  <span>View 7 Schools of Study & 28+ Academic Departments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C3A]" />
                  <span>Read General Public Notifications & Admission Announcements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C3A]" />
                  <span>Access Campus Navigation, Location Maps & AI Assistant for Public Queries</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C6661]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Internal student grades, confidential faculty circulars, and admin controls are restricted</span>
                </div>
              </div>

              <button
                id="btn-continue-as-guest-modal"
                onClick={handleGuestContinue}
                className="w-full py-3 px-4 rounded-xl bg-[#F2F6F4] hover:bg-[#E5EAE7] border border-[#E5EAE7] text-[#1A1F1D] font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Continue as Guest Visitor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FDFDFB] p-4 border-t border-[#E5EAE7] flex items-center justify-between text-xs text-[#5C6661]">
          <span>Gandhigram, Dindigul, Tamil Nadu 624302</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-semibold text-[#0F4C3A]">Direct Institutional Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
