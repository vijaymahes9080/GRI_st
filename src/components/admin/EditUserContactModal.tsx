import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useAppStore } from '../../core/store/appStore';
import { 
  Smartphone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  X, 
  Save
} from 'lucide-react';

interface EditUserContactModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormProps {
  user: UserProfile;
  onClose: () => void;
}

const ContactFormContent: React.FC<ContactFormProps> = ({ user, onClose }) => {
  const { updateUserContactChannels, sendTestChannelVerification } = useAppStore();

  const [phone, setPhone] = useState(user.phone || '+91 ');
  const [email, setEmail] = useState(user.email || '');
  const [alternateEmail, setAlternateEmail] = useState(user.alternateEmail || '');
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(user.smsAlertsEnabled !== false);
  const [whatsappAlertsEnabled, setWhatsappAlertsEnabled] = useState(user.whatsappAlertsEnabled !== false);
  const [emailCircularsEnabled, setEmailCircularsEnabled] = useState(user.emailCircularsEnabled !== false);

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testingChannel, setTestingChannel] = useState<'SMS' | 'WHATSAPP' | 'EMAIL' | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage({ type: 'error', text: 'Official institutional email is required.' });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await updateUserContactChannels(user.id, {
        phone: phone.trim(),
        email: email.trim(),
        alternateEmail: alternateEmail.trim() || undefined,
        smsAlertsEnabled,
        whatsappAlertsEnabled,
        emailCircularsEnabled,
      });

      setStatusMessage({ 
        type: 'success', 
        text: `Contact channels for ${user.name} successfully registered and confirmation notifications dispatched.` 
      });

      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update user contact channels.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestPing = async (channel: 'SMS' | 'WHATSAPP' | 'EMAIL') => {
    setTestingChannel(channel);
    try {
      const targetVal = channel === 'EMAIL' ? email : phone;
      await sendTestChannelVerification(user.id, channel, targetVal);
      setStatusMessage({ 
        type: 'success', 
        text: `Test ${channel} notification sent to ${targetVal}. Check communication log.` 
      });
    } catch {
      setStatusMessage({ type: 'error', text: `Failed to trigger test ${channel} ping.` });
    } finally {
      setTestingChannel(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Manage Communication Channels
            </h3>
            <p className="text-xs text-slate-400">
              User: <strong className="text-slate-200">{user.name}</strong> ({user.role})
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
          statusMessage.type === 'success'
            ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
            : 'bg-rose-950/70 border-rose-700 text-rose-300'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <X className="w-4 h-4 flex-shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Phone Section (SMS & WhatsApp) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              Mobile Phone (SMS & WhatsApp)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTestPing('SMS')}
                disabled={testingChannel !== null || !phone}
                className="px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 text-[11px] font-semibold flex items-center gap-1 transition"
              >
                <Send className="w-3 h-3" />
                {testingChannel === 'SMS' ? 'Sending SMS...' : 'Test SMS'}
              </button>
              <button
                type="button"
                onClick={() => handleTestPing('WHATSAPP')}
                disabled={testingChannel !== null || !phone}
                className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition"
              >
                <MessageSquare className="w-3 h-3" />
                {testingChannel === 'WHATSAPP' ? 'Sending WA...' : 'Test WhatsApp'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Registered Phone Number (with Country Code) *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98421 XXXXX"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono focus:border-indigo-500 outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Used for instant SMS alerts (TRAI DLT gateway) and WhatsApp automated circular bulletins.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Enable SMS Emergency Alerts</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={whatsappAlertsEnabled}
                onChange={(e) => setWhatsappAlertsEnabled(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-0"
              />
              <span>Enable WhatsApp Notices</span>
            </label>
          </div>
        </div>

        {/* Email Section */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              Institutional & Primary Email
            </span>
            <button
              type="button"
              onClick={() => handleTestPing('EMAIL')}
              disabled={testingChannel !== null || !email}
              className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition"
            >
              <Mail className="w-3 h-3" />
              {testingChannel === 'EMAIL' ? 'Sending Email...' : 'Test Email'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Primary / Institutional Email ID *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@ruraluniv.ac.in"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Alternate Email (Optional)
              </label>
              <input
                type="email"
                value={alternateEmail}
                onChange={(e) => setAlternateEmail(e.target.value)}
                placeholder="personal@gmail.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 pt-1">
            <input
              type="checkbox"
              checked={emailCircularsEnabled}
              onChange={(e) => setEmailCircularsEnabled(e.target.checked)}
              className="rounded border-slate-700 text-emerald-600 focus:ring-0"
            />
            <span>Send Digital Circulars & Examination Bulletins via Email</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 disabled:opacity-50 transition"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Registering Channels...' : 'Save & Register Channels'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const EditUserContactModal: React.FC<EditUserContactModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <ContactFormContent key={`${user.id}-${isOpen}`} user={user} onClose={onClose} />
    </div>
  );
};
