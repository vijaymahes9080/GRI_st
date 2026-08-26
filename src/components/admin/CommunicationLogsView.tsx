import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { MessageChannel, MessageType } from '../../types';
import { ManageTemplatesModal } from './ManageTemplatesModal';
import { 
  MessageSquare, 
  Smartphone, 
  Mail, 
  Bell, 
  Search, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Send, 
  Filter,
  ShieldAlert,
  KeyRound,
  UserCheck,
  Sliders,
  BookmarkCheck
} from 'lucide-react';

export const CommunicationLogsView: React.FC = () => {
  const { dispatchedMessages, resendApprovalMessages } = useAppStore();

  const [channelFilter, setChannelFilter] = useState<'ALL' | MessageChannel>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | MessageType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isManageTemplatesOpen, setIsManageTemplatesOpen] = useState(false);

  const filteredLogs = dispatchedMessages.filter((msg) => {
    const matchesChannel = channelFilter === 'ALL' || msg.channel === channelFilter;
    const matchesType = typeFilter === 'ALL' || msg.type === typeFilter;
    const matchesSearch = 
      msg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.recipientEmail && msg.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (msg.recipientPhone && msg.recipientPhone.includes(searchQuery));
    return matchesChannel && matchesType && matchesSearch;
  });

  const handleResend = async (userId: string, userName: string) => {
    setResendingId(userId);
    try {
      await resendApprovalMessages(userId);
      setToastMessage(`Re-dispatched approval messages (SMS, WhatsApp, Email) to ${userName}`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (e) {
      console.error('Error re-dispatching messages:', e);
    } finally {
      setResendingId(null);
    }
  };

  const getChannelBadge = (channel: MessageChannel) => {
    switch (channel) {
      case 'SMS':
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px] flex items-center gap-1 border border-blue-200 dark:border-blue-800">
            <Smartphone className="w-3 h-3" />
            SMS Gateway
          </span>
        );
      case 'WHATSAPP':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
            <MessageSquare className="w-3 h-3" />
            WhatsApp Official
          </span>
        );
      case 'EMAIL':
        return (
          <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold text-[11px] flex items-center gap-1 border border-purple-200 dark:border-purple-800">
            <Mail className="w-3 h-3" />
            Institutional Email
          </span>
        );
      case 'IN_APP':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold text-[11px] flex items-center gap-1 border border-amber-200 dark:border-amber-800">
            <Bell className="w-3 h-3" />
            In-App Notice
          </span>
        );
    }
  };

  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'APPROVAL_NOTICE':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'PASSWORD_CHANGED':
        return <ShieldAlert className="w-4 h-4 text-blue-600" />;
      case 'PASSWORD_RESET':
        return <KeyRound className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card with Manage Templates Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>SMS, WhatsApp & Notification Dispatch Gateway</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit outbound multi-channel broadcasts, automated credential notices, and notification templates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="manage-notification-templates-btn"
            onClick={() => setIsManageTemplatesOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md shadow-indigo-900/20"
          >
            <Sliders className="w-4 h-4" />
            <span>Manage Templates</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Total Messages</span>
            <Send className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {dispatchedMessages.length}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">100% Delivery Success</span>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 text-xs mb-1">
            <span>SMS Dispatched</span>
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-bold text-blue-950 dark:text-blue-100">
            {dispatchedMessages.filter(m => m.channel === 'SMS').length}
          </p>
          <span className="text-[10px] text-blue-600 font-medium">TRAI DLT Registered</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs mb-1">
            <span>WhatsApp Alerts</span>
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-bold text-emerald-950 dark:text-emerald-100">
            {dispatchedMessages.filter(m => m.channel === 'WHATSAPP').length}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Meta Cloud Gateway</span>
        </div>

        <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 text-xs mb-1">
            <span>Institutional Emails</span>
            <Mail className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-bold text-purple-950 dark:text-purple-100">
            {dispatchedMessages.filter(m => m.channel === 'EMAIL').length}
          </p>
          <span className="text-[10px] text-purple-600 font-medium">SMTP Secure TLS</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="search-communication-logs"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipient, phone, or title..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Channel */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Channel:</span>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Channels</option>
              <option value="SMS">SMS Only</option>
              <option value="WHATSAPP">WhatsApp Only</option>
              <option value="EMAIL">Email Only</option>
              <option value="IN_APP">In-App Only</option>
            </select>
          </div>

          {/* Type */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Event:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Events</option>
              <option value="APPROVAL_NOTICE">Approval & Access Key</option>
              <option value="PASSWORD_CHANGED">Password Change Alert</option>
              <option value="PASSWORD_RESET">Password Reset Notice</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-medium">No communication logs match the filter criteria</p>
          </div>
        ) : (
          filteredLogs.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow space-y-3"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {getTypeIcon(msg.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {msg.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Recipient: <span className="font-semibold text-slate-700 dark:text-slate-300">{msg.userName}</span>
                      {msg.recipientPhone && ` • Phone: ${msg.recipientPhone}`}
                      {msg.recipientEmail && ` • Email: ${msg.recipientEmail}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {getChannelBadge(msg.channel)}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {msg.status}
                  </span>
                </div>
              </div>

              {/* Message Content Preview */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {msg.body}
              </div>

              {/* Footer / Meta */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Dispatched: {new Date(msg.sentAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleResend(msg.userId, msg.userName)}
                  disabled={resendingId === msg.userId}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${resendingId === msg.userId ? 'animate-spin' : ''}`} />
                  Re-Dispatch Alert
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manage Templates Modal */}
      <ManageTemplatesModal
        isOpen={isManageTemplatesOpen}
        onClose={() => setIsManageTemplatesOpen(false)}
      />
    </div>
  );
};
