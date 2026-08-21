import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';

export const ChangePasswordModal: React.FC = () => {
  const { 
    currentUser, 
    isPasswordChangeModalOpen, 
    setPasswordChangeModalOpen, 
    changeUserPassword 
  } = useAppStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isPasswordChangeModalOpen) return null;

  const isMandatory = currentUser.mustChangePasswordOnLogin;
  const isDefaultPassword = currentUser.passwordStatus === 'default_temp';

  // Password rules validation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isValid = hasMinLength && hasUppercase && hasNumber && hasSpecial && passwordsMatch;

  const getStrengthScore = () => {
    let score = 0;
    if (hasMinLength) score += 25;
    if (hasUppercase) score += 25;
    if (hasNumber) score += 25;
    if (hasSpecial) score += 25;
    return score;
  };

  const strengthScore = getStrengthScore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isValid) {
      setErrorMessage('Please satisfy all password security requirements before submitting.');
      return;
    }

    if (newPassword === (currentUser.tempPassword || 'GRI@Admin2026')) {
      setErrorMessage('Your new password cannot be the same as the provisional general password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await changeUserPassword(newPassword);
      setSuccessMessage('Password successfully updated! Confirmation alerts dispatched to SMS, WhatsApp, and Email.');
      setTimeout(() => {
        setSuccessMessage(null);
        setPasswordChangeModalOpen(false);
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="change-password-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        id="change-password-dialog"
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                <KeyRound className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif tracking-wide">
                  {isMandatory ? 'Set Your Private Password' : 'Change Account Password'}
                </h3>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  The Gandhigram Rural Institute • Information Security
                </p>
              </div>
            </div>

            {!isMandatory && (
              <button
                id="close-password-modal-btn"
                type="button"
                onClick={() => setPasswordChangeModalOpen(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Account Status Badge */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md font-medium text-emerald-100 border border-white/20">
              User: {currentUser.name} ({currentUser.role.toUpperCase()})
            </span>
            {isDefaultPassword && (
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Action Required: Provisional Default Active
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isMandatory && (
            <div className="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">First-Time Setup / Administrator Verification Notice:</strong>
                Your account was approved with the university general provisional password. To safeguard your academic and institutional records, please define your own private password now.
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold">{successMessage}</p>
                <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400/90 mt-1">
                  You can now log in securely using your new user-defined credentials anytime.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                New User-Defined Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="new-user-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a strong private password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    <span>Password Strength</span>
                    <span className={
                      strengthScore < 50 ? 'text-red-500 font-semibold' :
                      strengthScore < 100 ? 'text-amber-500 font-semibold' : 'text-emerald-600 font-bold'
                    }>
                      {strengthScore < 50 ? 'Weak' : strengthScore < 100 ? 'Moderate' : 'Strong & Compliant'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        strengthScore < 50 ? 'bg-red-500' :
                        strengthScore < 100 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${strengthScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="confirm-user-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your private password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </p>
              )}
            </div>

            {/* Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                GRI Security Policy Checklist:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-500' : 'text-slate-300'}`} />
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasUppercase ? 'text-emerald-500' : 'text-slate-300'}`} />
                  One uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-500' : 'text-slate-300'}`} />
                  One numerical digit
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasSpecial ? 'text-emerald-500' : 'text-slate-300'}`} />
                  One special symbol (@, #, $, etc.)
                </div>
              </div>
            </div>

            {/* Notification Channels Dispatch Preview */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Automatic Multi-Channel Confirmation on Save:
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  SMS to {currentUser.phone || '+91 98421 77321'}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  Email to {currentUser.email}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              {!isMandatory && (
                <button
                  id="cancel-password-btn"
                  type="button"
                  onClick={() => setPasswordChangeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                id="submit-password-change-btn"
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating & Dispatching Logs...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Save User-Defined Password & Activate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
