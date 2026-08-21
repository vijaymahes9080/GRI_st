import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { BulkConfirmModal, BulkActionType } from './BulkConfirmModal';
import { AddUserModal } from '../admin/AddUserModal';
import { EditUserContactModal } from '../admin/EditUserContactModal';
import { CommunicationLogsView } from '../admin/CommunicationLogsView';
import { UserRole, UserProfile } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Bell, 
  RefreshCw, 
  Check, 
  X, 
  Send, 
  Database, 
  Activity, 
  Server,
  Lock,
  CheckSquare,
  Square,
  Trash2,
  Ban,
  Search,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  UserPlus,
  KeyRound,
  MessageSquare,
  Smartphone,
  Mail,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    currentUser, 
    usersList, 
    updateUserApproval,
    approveUserWithNotifications,
    bulkUpdateUserApproval,
    deleteUser,
    bulkDeleteUsers,
    addCircular, 
    isFirestoreLive,
    updateUserRole,
    resetUserPasswordByAdmin,
    resendApprovalMessages,
    dispatchedMessages
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'users' | 'messages' | 'compose' | 'sync' | 'telemetry'>('users');
  
  // Selection and Bulk Actions state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'approved' | 'pending' | 'suspended' | 'rejected'>('ALL');
  const [bulkFeedback, setBulkFeedback] = useState<string | null>(null);

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Edit User Contact Modal State
  const [editContactUser, setEditContactUser] = useState<UserProfile | null>(null);

  // Bulk Confirmation Modal State
  const [bulkActionModalType, setBulkActionModalType] = useState<BulkActionType | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Reset Password Confirmation State
  const [resetTargetUser, setResetTargetUser] = useState<{ id: string; name: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Circular Composer Form
  const [circTitle, setCircTitle] = useState('');
  const [circCategory, setCircCategory] = useState<'EXAM' | 'ADMISSIONS' | 'ACADEMIC' | 'OUTREACH' | 'TENDER' | 'CAREER' | 'ADMIN'>('ACADEMIC');
  const [circDesc, setCircDesc] = useState('');
  const [circTarget, setCircTarget] = useState<'ALL' | 'STUDENT' | 'FACULTY' | 'STAFF'>('ALL');
  const [circImportant, setCircImportant] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Sync state simulation
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Today at 09:30 AM (Auto)');

  const pendingUsers = usersList.filter(u => u.approvalStatus === 'pending');
  const selectedUsers = usersList.filter(u => selectedUserIds.includes(u.id));

  // Filtered users for the All Users table
  const filteredUsers = usersList.filter((u) => {
    const matchesStatus = userStatusFilter === 'ALL' || u.approvalStatus === userStatusFilter;
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.regNumber && u.regNumber.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(userSearchQuery));
    return matchesStatus && matchesSearch;
  });

  const isAllFilteredSelected = 
    filteredUsers.length > 0 && filteredUsers.every((u) => selectedUserIds.includes(u.id));

  const toggleSelectAll = () => {
    if (isAllFilteredSelected) {
      const filteredIds = new Set(filteredUsers.map(u => u.id));
      setSelectedUserIds((prev) => prev.filter(id => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredUsers.map(u => u.id);
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecuteBulkAction = async () => {
    if (!bulkActionModalType || selectedUserIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      const count = selectedUserIds.length;
      if (bulkActionModalType === 'approve') {
        await bulkUpdateUserApproval(selectedUserIds, 'approved');
        setBulkFeedback(`Successfully approved ${count} user account(s) and dispatched SMS, WhatsApp & Email credentials.`);
      } else if (bulkActionModalType === 'suspend') {
        await bulkUpdateUserApproval(selectedUserIds, 'suspended');
        setBulkFeedback(`Suspended ${count} user account(s).`);
      } else if (bulkActionModalType === 'delete') {
        await bulkDeleteUsers(selectedUserIds);
        setBulkFeedback(`Permanently deleted ${count} user account(s).`);
      }
      setSelectedUserIds([]);
      setBulkActionModalType(null);
      setTimeout(() => setBulkFeedback(null), 4000);
    } catch (err) {
      console.error('Error executing bulk action:', err);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleAdminResetPassword = async () => {
    if (!resetTargetUser) return;
    setIsResetting(true);
    try {
      await resetUserPasswordByAdmin(resetTargetUser.id);
      setBulkFeedback(`Reset password for ${resetTargetUser.name} to provisional key GRI@Admin2026. Notifications dispatched.`);
      setResetTargetUser(null);
      setTimeout(() => setBulkFeedback(null), 4000);
    } catch (e) {
      console.error('Error resetting password:', e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportUsersCSV = (usersToExport = filteredUsers) => {
    if (!usersToExport || usersToExport.length === 0) return;

    const headers = [
      'User ID',
      'Full Name',
      'Email Address',
      'Role',
      'Department',
      'Register / Roll Number',
      'Designation',
      'Approval Status',
      'Password Status',
      'Must Change Password On Login',
      'Phone Number',
      'Approved At',
      'Approved By',
      'Semester',
      'CGPA',
      'Attendance (%)'
    ];

    const escapeCsv = (val: string | number | boolean | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = usersToExport.map((u) => [
      escapeCsv(u.id),
      escapeCsv(u.name),
      escapeCsv(u.email),
      escapeCsv(u.role),
      escapeCsv(u.department),
      escapeCsv(u.regNumber || ''),
      escapeCsv(u.designation || ''),
      escapeCsv(u.approvalStatus),
      escapeCsv(u.passwordStatus || 'default_temp'),
      escapeCsv(u.mustChangePasswordOnLogin ? 'YES' : 'NO'),
      escapeCsv(u.phone || ''),
      escapeCsv(u.approvedAt || ''),
      escapeCsv(u.approvedBy || ''),
      escapeCsv(u.semester ?? ''),
      escapeCsv(u.cgpa ?? ''),
      escapeCsv(u.attendance ?? '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.setAttribute('href', url);
    link.setAttribute('download', `GRI_Users_Registry_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setBulkFeedback(`Successfully exported ${usersToExport.length} user record(s) as CSV.`);
    setTimeout(() => setBulkFeedback(null), 3500);
  };

  const handlePublishCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circTitle || !circDesc) return;

    addCircular({
      title: circTitle,
      category: circCategory,
      description: circDesc,
      publishDate: new Date().toISOString().split('T')[0],
      targetRole: circTarget,
      isImportant: circImportant,
      author: `${currentUser.name} (${currentUser.designation || currentUser.role})`,
    });

    setCircTitle('');
    setCircDesc('');
    setCircImportant(false);
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 4000);
  };

  const handleSyncWebsite = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Manual Sync)');
      alert('GRI University Central CMS synced: 6 new circulars parsed, 28 academic curricula verified.');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            GRI Central Administration Portal
          </h1>
          <p className="text-sm text-slate-400">
            Account approvals with multi-channel dispatch, user password governance, circular broadcasting, and Firestore sync.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="open-add-user-modal-btn"
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-900/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isFirestoreLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>Firestore: <strong className="text-emerald-400">{isFirestoreLive ? 'Live Real-Time' : 'Connecting'}</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Access: <strong>{currentUser.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'users', label: `Users & Credentials (${usersList.length} Total, ${pendingUsers.length} Pending)`, icon: <Users className="w-4 h-4" /> },
          { id: 'messages', label: `Multi-Channel Dispatches (${dispatchedMessages.length})`, icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'compose', label: 'Publish New Circular', icon: <Bell className="w-4 h-4" /> },
          { id: 'sync', label: 'University CMS Sync', icon: <Database className="w-4 h-4" /> },
          { id: 'telemetry', label: 'System Health & Security', icon: <Activity className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: User Approvals & All Users Table */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Feedback notification */}
          {bulkFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{bulkFeedback}</span>
              </div>
              <button onClick={() => setBulkFeedback(null)} className="text-emerald-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Pending Users Quick Cards Section */}
          {pendingUsers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  Pending Verification Requests ({pendingUsers.length})
                </h3>
                <span className="text-xs text-slate-400">Approving dispatches SMS, WhatsApp & Email with default key</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{user.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 capitalize">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-300 border border-slate-800">
                        {user.regNumber || 'Awaiting ID'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                      <div>Department: <strong>{user.department}</strong></div>
                      {user.designation && <div>Designation: <strong>{user.designation}</strong></div>}
                      {user.phone && <div className="text-slate-400">Phone: <strong className="text-slate-200">{user.phone}</strong></div>}
                      <div className="text-[11px] text-amber-400 flex items-center gap-1 pt-0.5">
                        <KeyRound className="w-3 h-3 text-amber-400" />
                        Provisional Password: <code className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 border border-amber-800/60">{user.tempPassword || 'GRI@Admin2026'}</code>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => approveUserWithNotifications(user.id)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-900/30"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve & Dispatch Credentials</span>
                      </button>
                      <button
                        onClick={() => updateUserApproval(user.id, 'rejected')}
                        className="py-2 px-3 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-rose-800 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Users Management Section with Checkboxes & Bulk Header Bar */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  All Institutional Users Directory ({usersList.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Manage roles, reset provisional passwords, and trigger SMS/WhatsApp/Email notifications.
                </p>
              </div>

              {/* Filter Tabs & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search name, email, roll no, phone..."
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-48 sm:w-60"
                  />
                </div>

                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1">
                  {(['ALL', 'approved', 'pending', 'suspended'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setUserStatusFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition ${
                        userStatusFilter === filter
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {filter === 'ALL' ? 'All Users' : filter}
                    </button>
                  ))}
                </div>

                {/* Export CSV Button */}
                <button
                  onClick={() => handleExportUsersCSV(filteredUsers)}
                  disabled={filteredUsers.length === 0}
                  title="Export current filtered user list as CSV"
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 font-bold text-xs flex items-center gap-1.5 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded-md border border-emerald-800/60">
                    {filteredUsers.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Bulk Action Header Bar (Appears when 1+ rows selected) */}
            {selectedUserIds.length > 0 && (
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>{selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected</span>
                  </div>
                  <button
                    onClick={() => setSelectedUserIds([])}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear selection</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleExportUsersCSV(selectedUsers)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                    title="Export selected users only"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export Selected ({selectedUsers.length})</span>
                  </button>

                  <button
                    onClick={() => setBulkActionModalType('approve')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-900/40"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve & Dispatch Selected</span>
                  </button>

                  <button
                    onClick={() => setBulkActionModalType('suspend')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Suspend Selected</span>
                  </button>

                  <button
                    onClick={() => setBulkActionModalType('delete')}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected</span>
                  </button>
                </div>
              </div>
            )}

            {/* Table Container */}
            <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="p-3.5 w-10 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition"
                        title={isAllFilteredSelected ? 'Deselect all' : 'Select all'}
                      >
                        {isAllFilteredSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5">Member Name & ID</th>
                    <th className="p-3.5">Role & Category</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Contact (Email & Phone)</th>
                    <th className="p-3.5">Password Status</th>
                    <th className="p-3.5">Approval</th>
                    <th className="p-3.5 text-right">Row Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        No user profiles match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isSelected = selectedUserIds.includes(u.id);
                      const isDefaultPass = u.passwordStatus === 'default_temp' || u.mustChangePasswordOnLogin;

                      return (
                        <tr 
                          key={u.id} 
                          className={`transition ${
                            isSelected 
                              ? 'bg-emerald-950/30 hover:bg-emerald-950/40' 
                              : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="p-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectUser(u.id)}
                              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0 cursor-pointer accent-emerald-600"
                            />
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                                {u.avatarUrl ? (
                                  <img src={u.avatarUrl} alt={u.name} className="w-full h-full rounded-lg object-cover" />
                                ) : (
                                  u.name.charAt(0)
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white">{u.name}</div>
                                <div className="text-[10px] font-mono text-slate-400">
                                  {u.regNumber || u.designation || 'ID: ' + u.id.slice(0, 8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={u.role}
                              onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                              className="capitalize px-2 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-semibold border border-slate-700 outline-none focus:border-indigo-500"
                            >
                              <option value="student">Student</option>
                              <option value="faculty">Faculty</option>
                              <option value="scholar">Scholar (Ph.D.)</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-slate-300 max-w-[160px] truncate" title={u.department}>
                            {u.department}
                          </td>
                          <td className="p-3.5">
                            <div className="text-[11px] font-mono text-slate-300 truncate max-w-[150px]" title={u.email}>
                              {u.email}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Smartphone className="w-3 h-3 text-slate-500" />
                              {u.phone || 'No phone'}
                            </div>
                          </td>
                          <td className="p-3.5">
                            {isDefaultPass ? (
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1 w-fit">
                                  <KeyRound className="w-3 h-3 text-amber-400" />
                                  Provisional Key Active
                                </span>
                                <span className="text-[9px] text-amber-400/80 block font-mono">
                                  {u.tempPassword || 'GRI@Admin2026'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1 w-fit">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                User-Defined Custom
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize inline-flex items-center gap-1 ${
                                u.approvalStatus === 'approved'
                                  ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
                                  : u.approvalStatus === 'pending'
                                  ? 'text-amber-400 bg-amber-950 border-amber-800'
                                  : u.approvalStatus === 'suspended'
                                  ? 'text-orange-400 bg-orange-950 border-orange-800'
                                  : 'text-rose-400 bg-rose-950 border-rose-800'
                              }`}
                            >
                              {u.approvalStatus === 'approved' && <Check className="w-3 h-3" />}
                              {u.approvalStatus === 'pending' && <AlertTriangle className="w-3 h-3" />}
                              {u.approvalStatus === 'suspended' && <Ban className="w-3 h-3" />}
                              {u.approvalStatus}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-1 justify-end">
                              {/* Approve Button */}
                              {u.approvalStatus !== 'approved' && (
                                <button
                                  onClick={() => approveUserWithNotifications(u.id)}
                                  title="Approve & Dispatch SMS/WhatsApp/Email Credentials"
                                  className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 transition"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Edit Communication Channels (SMS, WhatsApp, Email) */}
                              <button
                                onClick={() => setEditContactUser(u)}
                                title="Manage Registered Phone (SMS & WhatsApp) & Email Channels"
                                className="p-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800 transition"
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                              </button>

                              {/* Reset to Default Password */}
                              <button
                                onClick={() => setResetTargetUser({ id: u.id, name: u.name })}
                                title="Reset User Password to Provisional Key & Alert via SMS/Email"
                                className="p-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 transition"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              {/* Resend Notifications */}
                              <button
                                onClick={() => resendApprovalMessages(u.id)}
                                title="Re-dispatch Access Instructions & Credentials"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>

                              {/* Suspend Button */}
                              {u.approvalStatus !== 'suspended' && (
                                <button
                                  onClick={() => updateUserApproval(u.id, 'suspended')}
                                  title="Suspend User Access"
                                  className="p-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-400 border border-amber-800 transition"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete Button */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Permanently delete profile and records for ${u.name}?`)) {
                                    deleteUser(u.id);
                                  }
                                }}
                                title="Delete User"
                                className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Multi-Channel Communication Logs */}
      {activeTab === 'messages' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Dispatched Multi-Channel Communications
              </h3>
              <p className="text-xs text-slate-400">
                Live delivery logs for SMS, WhatsApp, and Institutional Email notifications triggered on account approvals and security events.
              </p>
            </div>
          </div>
          <CommunicationLogsView />
        </div>
      )}

      {/* Tab 2: Circular Composer */}
      {activeTab === 'compose' && (
        <div className="max-w-3xl mx-auto bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              Publish Official Circular / Press Release
            </h3>
            <p className="text-xs text-slate-400">
              Notices published here are immediately delivered to Student Feeds, Examination Portals, and SMS alerts.
            </p>
          </div>

          {publishedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Circular published successfully across the GRI University Network!</span>
            </div>
          )}

          <form onSubmit={handlePublishCircular} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Category</label>
                <select
                  value={circCategory}
                  onChange={(e) => setCircCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                >
                  <option value="EXAM">Examination (ESE)</option>
                  <option value="ADMISSIONS">Admissions 2026-27</option>
                  <option value="ACADEMIC">Academic & Curricula</option>
                  <option value="OUTREACH">Shanti Sena / Outreach</option>
                  <option value="TENDER">Tender Notice</option>
                  <option value="CAREER">Career Recruitment</option>
                  <option value="ADMIN">Administrative Order</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Target Audience</label>
                <select
                  value={circTarget}
                  onChange={(e) => setCircTarget(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Entire GRI Community (All)</option>
                  <option value="STUDENT">Enrolled Students Only</option>
                  <option value="FACULTY">Faculty & Research Scholars</option>
                  <option value="STAFF">Administrative Staff</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Circular Title / Subject</label>
              <input
                type="text"
                value={circTitle}
                onChange={(e) => setCircTitle(e.target.value)}
                placeholder="e.g., Schedule for Convocation 2026 Gown Distribution & Rehearsal"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Full Circular Content</label>
              <textarea
                value={circDesc}
                onChange={(e) => setCircDesc(e.target.value)}
                rows={5}
                placeholder="Provide full text of circular including dates, venues, deadlines, and reference numbers..."
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <input
                type="checkbox"
                id="importantCheckbox"
                checked={circImportant}
                onChange={(e) => setCircImportant(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-0"
              />
              <label htmlFor="importantCheckbox" className="text-slate-300 font-semibold cursor-pointer">
                Mark as High Priority / Urgent Notice (Broadcasts with red banner on Home)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/40"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Circular Instantly</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: University CMS Sync */}
      {activeTab === 'sync' && (
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Institutional Data & Web Crawler Ingestion
              </h3>
              <p className="text-xs text-slate-400">
                Synchronize circulars, exam schedules, and staff directories with official ruraluniv.ac.in
              </p>
            </div>

            <button
              onClick={handleSyncWebsite}
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-900/30"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing Feeds...' : 'Trigger Full Sync Now'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px]">Target Host</span>
              <strong className="text-slate-200">https://ruraluniv.ac.in</strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px]">Last Sync Timestamp</span>
              <strong className="text-emerald-400">{lastSyncTime}</strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px]">Sync Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Healthy & In Sync
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Telemetry & Security */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              API Gateway & Server Metrics
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Response Latency</span>
                <strong className="text-emerald-400">32 ms (Edge P99)</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Uptime (SLA)</span>
                <strong className="text-emerald-400">99.98%</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Database Engine</span>
                <strong className="text-slate-200">Cloud Firestore Persistent Store</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">AI Model Version</span>
                <strong className="text-amber-400">Gemini 2.5 Server-Side Intelligence</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Security & Audit Compliance
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Samarth ERP integration encrypted with TLS 1.3</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Role-Based Access Control (RBAC) enforced on CoE Exam records</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-channel SMS, WhatsApp & Email notifications audit logged</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />

      {/* Password Reset Confirmation Dialog */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Reset to Provisional Password?</h4>
                <p className="text-xs text-slate-400">Target User: <strong>{resetTargetUser.name}</strong></p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              This action will reset the user's password to the general provisional key <code className="text-indigo-300 font-mono font-bold">GRI@Admin2026</code>, set their flag to require a private password change on next login, and automatically dispatch SMS, WhatsApp, and Email alerts.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetTargetUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleAdminResetPassword}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-900/30"
              >
                {isResetting ? 'Resetting & Dispatching...' : 'Confirm Reset & Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      <BulkConfirmModal
        isOpen={!!bulkActionModalType}
        actionType={bulkActionModalType}
        selectedUsers={selectedUsers}
        onClose={() => setBulkActionModalType(null)}
        onConfirm={handleExecuteBulkAction}
        isProcessing={isBulkProcessing}
      />

      {/* Edit User Contact Channels Modal */}
      <EditUserContactModal
        user={editContactUser}
        isOpen={!!editContactUser}
        onClose={() => setEditContactUser(null)}
      />
    </div>
  );
};
