import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { UserRole } from '../../types';
import { DEFAULT_GENERAL_PASSWORD } from '../../core/data/griMasterData';
import { 
  UserPlus, 
  X, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building2, 
  Key, 
  CheckCircle2, 
  Send,
  Smartphone,
  MessageSquare
} from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { addNewUserByAdmin } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Applications');
  const [regNumber, setRegNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [autoApproveAndDispatch, setAutoApproveAndDispatch] = useState(true);
  const [generalPassword, setGeneralPassword] = useState(DEFAULT_GENERAL_PASSWORD);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      await addNewUserByAdmin({
        name,
        email,
        phone,
        role,
        department,
        regNumber: role === 'student' || role === 'scholar' ? regNumber : undefined,
        designation: role === 'faculty' || role === 'admin' ? designation : undefined,
        approvalStatus: autoApproveAndDispatch ? 'approved' : 'pending',
        tempPassword: generalPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setName('');
        setEmail('');
        setPhone('+91 ');
        setRegNumber('');
        setDesignation('');
      }, 1800);
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="add-user-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        id="add-user-dialog"
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
              <UserPlus className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">Add New University Member</h3>
              <p className="text-xs text-slate-300">
                Enroll student, faculty, scholar, or administrator into GRI Registry
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
                Member Registered Successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {autoApproveAndDispatch 
                  ? 'Account is activated and credentials with provisional password have been dispatched via SMS, WhatsApp, and Email.'
                  : 'Account placed in pending queue awaiting verification.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    id="new-user-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. S. Meenakshi"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Official / Personal Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      id="new-user-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@ruraluniv.ac.in"
                      className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Role Category *
                  </label>
                  <select
                    id="new-user-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="scholar">Research Scholar (Ph.D.)</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Phone (for SMS & WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      id="new-user-phone"
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98421 XXXXX"
                      className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Department / Centre *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      id="new-user-department"
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science & Applications"
                      className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* ID or Designation */}
                {role === 'student' || role === 'scholar' ? (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Register / Enrollment Number
                    </label>
                    <input
                      id="new-user-regno"
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="e.g. 2026MCA102"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ) : (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Designation / Position
                    </label>
                    <input
                      id="new-user-designation"
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Associate Professor / Joint Registrar"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* General Provisional Password */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-500" />
                    Provisional General Password:
                  </span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                    {generalPassword}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  The user will be required to change this to their private password on initial login.
                </p>
              </div>

              {/* Auto Approve & Dispatch Toggle */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproveAndDispatch}
                  onChange={(e) => setAutoApproveAndDispatch(e.target.checked)}
                  className="mt-0.5 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300 block">
                    Approve immediately & dispatch SMS, WhatsApp, and Email notices
                  </span>
                  <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                    Sends access instructions and provisional password directly to user's registered phone and email.
                  </span>
                </div>
              </label>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs tracking-wide shadow-md flex items-center gap-2"
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      {autoApproveAndDispatch ? 'Add, Approve & Dispatch' : 'Add to Pending Queue'}
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
