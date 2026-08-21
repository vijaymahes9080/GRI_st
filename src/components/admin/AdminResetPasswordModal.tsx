import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { UserProfile } from '../../types';
import { 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  X, 
  Clock, 
  Lock,
  UserCheck,
  Send,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface AdminResetPasswordModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminResetPasswordModal: React.FC<AdminResetPasswordModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { resetUserPasswordByAdmin, loginAsUser, setTab } = useAppStore();

  const [passwordMode, setPasswordMode] = useState<'auto' | 'custom' | 'standard'>('auto');
  const [customPassword, setCustomPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [expiryHours, setExpiryHours] = useState(24);
  const [resetReason, setResetReason] = useState('User requested reset via ICT Helpdesk');
  
  // Notification channels
  const [notifySms, setNotifySms] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    tempPassword: string;
    messagesCount: number;
  } | null>(null);

  // Generate high-entropy secure temporary password
  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowerChars = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*';

    let code = 'GRI#';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    code += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    code += symbols.charAt(Math.floor(Math.random() * symbols.length));
    code += Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedPassword(code);
  };

  useEffect(() => {
    if (isOpen) {
      generateSecurePassword();
      setSuccessResult(null);
      setPasswordMode('auto');
      setForcePasswordChange(true);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const effectivePassword = 
    passwordMode === 'auto' ? generatedPassword :
    passwordMode === 'custom' ? customPassword :
    'GRI@Admin2026';

  const isCustomValid = passwordMode !== 'custom' || customPassword.length >= 6;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(effectivePassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCustomValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const selectedChannels: ('SMS' | 'WHATSAPP' | 'EMAIL')[] = [];
      if (notifySms) selectedChannels.push('SMS');
      if (notifyWhatsApp) selectedChannels.push('WHATSAPP');
      if (notifyEmail) selectedChannels.push('EMAIL');

      const result = await resetUserPasswordByAdmin(user.id, effectivePassword, {
        expiryHours,
        notifyChannels: selectedChannels,
        forcePasswordChange,
        reason: resetReason,
      });

      setSuccessResult({
        tempPassword: result.tempPassword || effectivePassword,
        messagesCount: result.messagesCount || selectedChannels.length,
      });
    } catch (err) {
      console.error('Failed to reset user password:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestLogin = () => {
    if (!user) return;
    // Login as the user with updated temporary password to trigger the mandatory change password modal immediately
    loginAsUser({
      ...user,
      passwordStatus: 'default_temp',
      mustChangePasswordOnLogin: forcePasswordChange,
      tempPassword: successResult?.tempPassword || effectivePassword,
    });
    onClose();
  };

  return (
    <div id="admin-reset-password-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-900/60 p-5 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Admin-Initiated Password Reset
              </h3>
              <p className="text-xs text-amber-200/80">
                Generate secure temporary credentials with mandatory login password change
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Target User Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{user.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                <div className="text-[10px] text-slate-500">
                  {user.department} • <span className="uppercase text-emerald-400 font-bold">{user.role}</span>
                </div>
              </div>
            </div>
            <div className="text-right text-[11px]">
              <div className="text-slate-400">Registered Phone:</div>
              <div className="text-slate-200 font-mono font-semibold">{user.phone || '+91 98421 77321'}</div>
            </div>
          </div>

          {/* If Reset is Complete: Show Success Receipt */}
          {successResult ? (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-300 font-display">
                  One-Time Temporary Password Active!
                </h4>
                <p className="text-slate-300 text-xs max-w-md mx-auto">
                  The temporary credentials were saved and dispatched across {successResult.messagesCount} channels (SMS, WhatsApp, Email). The user will be required to change this upon their next login.
                </p>

                {/* Password Box */}
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-600/40 flex items-center justify-between max-w-sm mx-auto">
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-400 block">Generated Temporary Key:</span>
                    <span className="text-base font-bold text-amber-400 tracking-wider">
                      {successResult.tempPassword}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPassword}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleTestLogin}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Simulate Login as {user.name} & Test Flow</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleExecuteReset} className="space-y-5">
              
              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  1. Temporary Password Generation Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPasswordMode('auto')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      passwordMode === 'auto'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-md shadow-amber-950/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mb-1.5 text-amber-400" />
                    <div className="font-bold text-xs text-white">Auto-Generate</div>
                    <div className="text-[10px] text-slate-400">High-entropy one-time key</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPasswordMode('custom')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      passwordMode === 'custom'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-md shadow-amber-950/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Lock className="w-4 h-4 mb-1.5 text-sky-400" />
                    <div className="font-bold text-xs text-white">Custom Temp Key</div>
                    <div className="text-[10px] text-slate-400">Admin-defined password</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPasswordMode('standard')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      passwordMode === 'standard'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-md shadow-amber-950/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mb-1.5 text-emerald-400" />
                    <div className="font-bold text-xs text-white">GRI General Key</div>
                    <div className="text-[10px] text-slate-400">GRI@Admin2026</div>
                  </button>
                </div>
              </div>

              {/* Password Input / Generator Field */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Temporary Access Credential:</span>
                  {passwordMode === 'auto' && (
                    <button
                      type="button"
                      onClick={generateSecurePassword}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                  )}
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={
                      passwordMode === 'auto' ? generatedPassword :
                      passwordMode === 'custom' ? customPassword :
                      'GRI@Admin2026'
                    }
                    onChange={(e) => {
                      if (passwordMode === 'custom') setCustomPassword(e.target.value);
                    }}
                    readOnly={passwordMode !== 'custom'}
                    placeholder="Enter custom temporary password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-amber-400 tracking-wider focus:border-amber-500 outline-none pr-20"
                  />
                  <div className="absolute right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="p-1.5 text-slate-400 hover:text-white"
                      title="Copy temporary password"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>This key allows single-session entry and will be revoked once a permanent password is set.</span>
                </div>
              </div>

              {/* Policy & Enforcement Options */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  2. Security Policy & Expiry Enforcement
                </label>

                {/* Mandatory Password Change Checkbox */}
                <div 
                  onClick={() => setForcePasswordChange(!forcePasswordChange)}
                  className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/60 flex items-start gap-3 cursor-pointer hover:bg-amber-950/30 transition"
                >
                  <input
                    type="checkbox"
                    checked={forcePasswordChange}
                    onChange={(e) => setForcePasswordChange(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <strong className="text-amber-200 font-bold block text-xs">
                      Require mandatory password change upon next user login attempt
                    </strong>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      The portal will intercept the session immediately upon login, blocking access until the user defines their personal permanent password.
                    </span>
                  </div>
                </div>

                {/* Expiry Window & Reason Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                      Temporary Key Expiry Window:
                    </label>
                    <select
                      value={expiryHours}
                      onChange={(e) => setExpiryHours(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
                    >
                      <option value={12}>Valid for 12 Hours</option>
                      <option value={24}>Valid for 24 Hours (Standard)</option>
                      <option value={48}>Valid for 48 Hours</option>
                      <option value={168}>Valid for 7 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                      Audit Trail Reason:
                    </label>
                    <select
                      value={resetReason}
                      onChange={(e) => setResetReason(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
                    >
                      <option value="User requested reset via ICT Helpdesk">User requested reset via Helpdesk</option>
                      <option value="Forgotten credentials / Lost device">Forgotten credentials / Lost device</option>
                      <option value="Security audit / Periodic rotation">Security audit / Periodic rotation</option>
                      <option value="Account approval / Onboarding">Account approval / Onboarding</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Multi-Channel Notification Dispatch */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  3. Automated Multi-Channel Dispatch
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    notifySms ? 'bg-slate-950 border-emerald-600/50 text-white' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <input
                      type="checkbox"
                      checked={notifySms}
                      onChange={(e) => setNotifySms(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-600"
                    />
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-semibold">SMS Alert</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    notifyWhatsApp ? 'bg-slate-950 border-emerald-600/50 text-white' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <input
                      type="checkbox"
                      checked={notifyWhatsApp}
                      onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-600"
                    />
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-semibold">WhatsApp</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    notifyEmail ? 'bg-slate-950 border-emerald-600/50 text-white' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-600"
                    />
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-semibold">Official Email</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isCustomValid || isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-amber-900/30"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating & Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Issue Temporary Password & Dispatch</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
