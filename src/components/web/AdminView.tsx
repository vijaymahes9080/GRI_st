import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { BulkConfirmModal, BulkActionType } from './BulkConfirmModal';
import { AddUserModal } from '../admin/AddUserModal';
import { EditUserContactModal } from '../admin/EditUserContactModal';
import { BulkImportUsersModal } from '../admin/BulkImportUsersModal';
import { CommunicationLogsView } from '../admin/CommunicationLogsView';
import { CircularsManager } from '../admin/CircularsManager';
import { SchoolsDepartmentsManager } from '../admin/SchoolsDepartmentsManager';
import { EventsManager } from '../admin/EventsManager';
import { PlacementsManager } from '../admin/PlacementsManager';
import { ResearchManager } from '../admin/ResearchManager';
import { DocumentsManager } from '../admin/DocumentsManager';
import { FaqManager } from '../admin/FaqManager';
import { QuickLinksManager } from '../admin/QuickLinksManager';
import { DynamicPagesManager } from '../admin/DynamicPagesManager';
import { AiKnowledgeManager } from '../admin/AiKnowledgeManager';
import { SystemSettingsManager } from '../admin/SystemSettingsManager';
import { AuditLogsViewer } from '../admin/AuditLogsViewer';
import { GrievanceManager } from '../admin/GrievanceManager';
import { AdminResetPasswordModal } from '../admin/AdminResetPasswordModal';
import { RbacManagerView } from '../admin/RbacManagerView';
import { AccessRestricted } from '../common/AccessRestricted';
import { usePermissions } from '../../core/auth/usePermissions';
import { UserRole, UserProfile } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Bell, 
  Check, 
  X, 
  Activity, 
  CheckSquare, 
  Square, 
  Trash2, 
  Search, 
  UserCheck, 
  AlertTriangle, 
  FileSpreadsheet, 
  FileJson, 
  Upload, 
  UserPlus, 
  KeyRound, 
  MessageSquare, 
  Building2, 
  Calendar, 
  Briefcase, 
  FlaskConical, 
  FolderOpen, 
  HelpCircle, 
  Link2, 
  Layout, 
  Brain, 
  Sliders, 
  AlertCircle, 
  ChevronRight
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    currentUser, 
    usersList, 
    loginAsUser,
    setTab,
    approveUserWithNotifications,
    bulkUpdateUserApproval,
    deleteUser,
    bulkDeleteUsers,
    isFirestoreLive,
    updateUserRole,
    dispatchedMessages,
    circulars,
    schools,
    events,
    placements,
    researchProjects,
    documents,
    faqs,
    quickLinks,
    dynamicPages,
    aiKnowledgeSources,
    grievances,
    auditLogs
  } = useAppStore();

  const { can } = usePermissions();

  type AdminTab = 
    | 'overview' 
    | 'users' 
    | 'rbac'
    | 'circulars' 
    | 'academic' 
    | 'events' 
    | 'placements' 
    | 'research' 
    | 'documents' 
    | 'faqs' 
    | 'links' 
    | 'pages' 
    | 'ai_rag' 
    | 'grievances' 
    | 'settings' 
    | 'messages' 
    | 'audit';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Selection and Bulk Actions state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'approved' | 'pending' | 'suspended' | 'rejected'>('ALL');
  const [bulkFeedback, setBulkFeedback] = useState<string | null>(null);

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Bulk JSON Import Modal State
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);

  // Edit User Contact Modal State
  const [editContactUser, setEditContactUser] = useState<UserProfile | null>(null);

  // Bulk Confirmation Modal State
  const [bulkActionModalType, setBulkActionModalType] = useState<BulkActionType | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Reset Password Modal State
  const [resetTargetUser, setResetTargetUser] = useState<UserProfile | null>(null);

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

  const exportUsersCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Department', 'Reg/Emp Number', 'Status'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.phone || '',
      u.role,
      `"${u.department}"`,
      u.regNumber || '',
      u.approvalStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gri_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportUsersJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredUsers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gri_users_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Nav menu categories for modern side-drawer or tab bar
  const navTabs: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: Activity },
    { id: 'users', label: 'User Directory', icon: Users, badge: pendingUsers.length },
    { id: 'rbac', label: 'Access Control & RBAC Matrix', icon: ShieldCheck },
    { id: 'circulars', label: 'Circulars & Notices', icon: Bell, badge: circulars.length },
    { id: 'academic', label: 'Schools & Departments', icon: Building2, badge: schools.length },
    { id: 'events', label: 'Events & Seminars', icon: Calendar, badge: events.length },
    { id: 'placements', label: 'Placement Drives', icon: Briefcase, badge: placements.length },
    { id: 'research', label: 'Research Grants', icon: FlaskConical, badge: researchProjects.length },
    { id: 'documents', label: 'Document Archive', icon: FolderOpen, badge: documents.length },
    { id: 'faqs', label: 'FAQs Knowledge', icon: HelpCircle, badge: faqs.length },
    { id: 'links', label: 'Quick Links & Portals', icon: Link2, badge: quickLinks.length },
    { id: 'pages', label: 'Dynamic CMS Pages', icon: Layout, badge: dynamicPages.length },
    { id: 'ai_rag', label: 'Gemini RAG Indexing', icon: Brain, badge: aiKnowledgeSources.length },
    { id: 'grievances', label: 'Student Grievances', icon: AlertCircle, badge: grievances.filter(g => g.status === 'PENDING').length },
    { id: 'settings', label: 'System Settings', icon: Sliders },
    { id: 'messages', label: 'SMS / WhatsApp Logs', icon: MessageSquare, badge: dispatchedMessages.length },
    { id: 'audit', label: 'Security Audit Trail', icon: ShieldCheck, badge: auditLogs.length },
  ];

  const isAdminAuthorized = can('tab.admin.view');

  if (!isAdminAuthorized) {
    const adminUser = usersList.find(u => u.role === 'admin' || u.role === 'super_admin') || {
      id: 'USR-ADMIN-01',
      name: 'Dr. V. Ramanathan',
      email: 'admin.ict@ruraluniv.ac.in',
      role: 'admin' as const,
      department: 'Central Administration & ICT',
      approvalStatus: 'approved' as const,
      passwordStatus: 'user_defined' as const,
      mustChangePasswordOnLogin: false,
      phone: '+91 94433 12345',
      phoneVerified: true,
      emailVerified: true,
      smsAlertsEnabled: true,
      whatsappAlertsEnabled: true,
      emailCircularsEnabled: true,
    };

    return (
      <AccessRestricted
        title="Admin Control Center Restricted"
        resourceName="Institutional Central Administration & RBAC Control"
        requiredRole={['admin', 'super_admin', 'dept_admin']}
        requiredPermission="rbac.manage_permissions, system.config"
        requiredScope="Central University Administration / Department Leadership"
        message={`Your active session profile (${currentUser.name}, role: ${currentUser.role.toUpperCase()}) does not possess elevated institutional privileges to manage university master databases, users, or dispatch official circulars.`}
        primaryActionText={currentUser.role === 'guest' ? 'Sign In as Administrator' : 'Switch to Administrator Profile'}
        onPrimaryAction={() => loginAsUser(adminUser)}
        secondaryActionText="Return to Portal Home"
        onSecondaryAction={() => setTab('home')}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner: Master Identity & Real-Time Sync Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-64 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 flex items-center justify-center shadow-xl shadow-emerald-950/60">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 tracking-wider uppercase font-mono">
                  GRI Admin Control Center
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {currentUser.role}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white font-display mt-1">
                Centralized University Management System
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <strong>{currentUser.name}</strong> • Direct read/write to Firestore & Real-Time State
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs">
              <div className={`w-2.5 h-2.5 rounded-full ${isFirestoreLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <div className="text-left">
                <div className="text-slate-200 font-bold text-[11px] leading-tight">
                  {isFirestoreLive ? 'Cloud Database Synced' : 'Offline / Local Store'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Real-time Subscriptions Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {bulkFeedback && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{bulkFeedback}</span>
            </div>
            <button onClick={() => setBulkFeedback(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs Bar (Scrollable on mobile) */}
      <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 w-max min-w-full">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Users', count: usersList.length, icon: Users, tab: 'users', color: 'text-sky-400' },
              { label: 'Pending Approvals', count: pendingUsers.length, icon: UserCheck, tab: 'users', color: 'text-amber-400', alert: pendingUsers.length > 0 },
              { label: 'Live Circulars', count: circulars.length, icon: Bell, tab: 'circulars', color: 'text-emerald-400' },
              { label: 'Schools of Study', count: schools.length, icon: Building2, tab: 'academic', color: 'text-teal-400' },
              { label: 'Recruitment Drives', count: placements.length, icon: Briefcase, tab: 'placements', color: 'text-indigo-400' },
              { label: 'AI RAG Chunks', count: aiKnowledgeSources.length, icon: Brain, tab: 'ai_rag', color: 'text-purple-400' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTab(m.tab as AdminTab)}
                  className={`p-4 rounded-2xl bg-slate-900 border transition cursor-pointer hover:border-slate-700 space-y-1 ${
                    m.alert ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${m.color}`} />
                    {m.alert && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                  </div>
                  <div className="text-xl font-bold text-white font-mono mt-1">{m.count}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{m.label}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Pending Approvals Action Card */}
          {pendingUsers.length > 0 && (
            <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 p-5 rounded-3xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white font-display">
                    {pendingUsers.length} User Registration(s) Awaiting Administrative Approval
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('users')}
                  className="text-xs text-amber-300 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Review in Directory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pendingUsers.slice(0, 3).map((u) => (
                  <div key={u.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-xs">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email} • {u.role}</div>
                    </div>
                    <button
                      onClick={() => approveUserWithNotifications(u.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow"
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Hub Navigator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div
              onClick={() => setActiveTab('circulars')}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <Bell className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Circulars & Announcements</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Broadcast emergency alerts, ESE exam schedules, and circulars directly to student phones.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('academic')}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-950/80 border border-teal-800 flex items-center justify-center text-teal-400 group-hover:scale-105 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Schools, Depts & Faculty</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Manage GRI's 8+ Schools, 28+ Departments, Faculty Profiles, Degrees, and Curricula.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('ai_rag')}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Gemini RAG Knowledge Sources</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ingest official PDF documents and websites into the GRI AI Assistant vector database.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Users Directory & RBAC */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Bulk Actions Toolbar */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  University User Directory & Role-Based Access Control (RBAC)
                </h2>
                <p className="text-xs text-slate-400">
                  Manage student profiles, faculty credentials, staff roles, and approve new user account registrations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {can('users.manage') && (
                  <>
                    <button
                      onClick={() => setIsAddUserModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-900/40"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add New User</span>
                    </button>
                    <button
                      onClick={() => setIsBulkImportModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bulk Import</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Selection & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name, email, roll no, dept..."
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-full sm:w-72"
                  />
                </div>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="approved">Approved Only</option>
                  <option value="pending">Pending Approval</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {selectedUserIds.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {selectedUserIds.length} selected
                    </span>
                    <button
                      onClick={() => setBulkActionModalType('approve')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-bold"
                    >
                      Bulk Approve
                    </button>
                    <button
                      onClick={() => setBulkActionModalType('suspend')}
                      className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[11px] font-bold"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => setBulkActionModalType('delete')}
                      className="px-2.5 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[11px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                )}

                <button
                  onClick={exportUsersCSV}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                  title="Export Users as CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                </button>
                <button
                  onClick={exportUsersJSON}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                  title="Export Users as JSON"
                >
                  <FileJson className="w-3.5 h-3.5 text-sky-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs min-w-[600px] sm:min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="p-3.5 w-8">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600 transition">
                      {isAllFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </th>
                  <th className="p-3.5">User Identity</th>
                  <th className="p-3.5">Role & Department</th>
                  <th className="p-3.5 hidden sm:table-cell">Contact (SMS / WhatsApp)</th>
                  <th className="p-3.5 hidden sm:table-cell">Approval Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 sm:p-8 text-center text-slate-500">
                      No user accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelected = selectedUserIds.includes(user.id);
                    return (
                      <tr key={user.id} className={`hover:bg-slate-50 transition ${isSelected ? 'bg-emerald-50' : ''}`}>
                        <td className="p-3.5">
                          <button onClick={() => toggleSelectUser(user.id)} className="text-slate-400 hover:text-slate-600 transition">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                          {user.regNumber && (
                            <div className="text-[10px] text-slate-400 font-mono">Reg: {user.regNumber}</div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                            className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] font-bold text-slate-700 outline-none focus:border-emerald-500 shadow-sm"
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="FACULTY">FACULTY</option>
                            <option value="STAFF">STAFF</option>
                            <option value="ALUMNI">ALUMNI</option>
                            <option value="DEPARTMENT_ADMIN">DEPT ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER ADMIN</option>
                          </select>
                          <div className="text-[10px] text-slate-500 mt-1">{user.department}</div>
                        </td>
                        <td className="p-3.5 hidden sm:table-cell">
                          <div className="text-slate-700 font-mono text-[11px]">{user.phone || 'No phone'}</div>
                          <button
                            onClick={() => setEditContactUser(user)}
                            className="text-[10px] text-emerald-600 hover:underline mt-0.5"
                          >
                            Edit Contact
                          </button>
                        </td>
                        <td className="p-3.5 hidden sm:table-cell">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            user.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            user.approvalStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {user.approvalStatus || 'approved'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {user.approvalStatus === 'pending' && (
                              <button
                                onClick={() => approveUserWithNotifications(user.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm transition"
                                title="Approve & Send Credentials"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => setResetTargetUser(user)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition"
                              title="Admin-Initiated Password Reset (One-Time Key)"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete user ${user.name}?`)) deleteUser(user.id);
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                              title="Delete User"
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
      )}

      {/* TAB CONTENT: RBAC Access Control Matrix */}
      {activeTab === 'rbac' && <RbacManagerView />}

      {/* TAB CONTENT: Circulars & Announcements */}
      {activeTab === 'circulars' && <CircularsManager />}

      {/* TAB CONTENT: Schools & Departments */}
      {activeTab === 'academic' && <SchoolsDepartmentsManager />}

      {/* TAB CONTENT: Events */}
      {activeTab === 'events' && <EventsManager />}

      {/* TAB CONTENT: Placements */}
      {activeTab === 'placements' && <PlacementsManager />}

      {/* TAB CONTENT: Research */}
      {activeTab === 'research' && <ResearchManager />}

      {/* TAB CONTENT: Documents */}
      {activeTab === 'documents' && <DocumentsManager />}

      {/* TAB CONTENT: FAQs */}
      {activeTab === 'faqs' && <FaqManager />}

      {/* TAB CONTENT: Quick Links */}
      {activeTab === 'links' && <QuickLinksManager />}

      {/* TAB CONTENT: Dynamic CMS Pages */}
      {activeTab === 'pages' && <DynamicPagesManager />}

      {/* TAB CONTENT: Gemini RAG Indexing */}
      {activeTab === 'ai_rag' && <AiKnowledgeManager />}

      {/* TAB CONTENT: Student Grievances */}
      {activeTab === 'grievances' && <GrievanceManager />}

      {/* TAB CONTENT: System Settings & Flags */}
      {activeTab === 'settings' && <SystemSettingsManager />}

      {/* TAB CONTENT: Communication Logs */}
      {activeTab === 'messages' && <CommunicationLogsView />}

      {/* TAB CONTENT: Audit Trail */}
      {activeTab === 'audit' && <AuditLogsViewer />}

      {/* MODALS */}
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />
      <BulkImportUsersModal isOpen={isBulkImportModalOpen} onClose={() => setIsBulkImportModalOpen(false)} />
      <EditUserContactModal user={editContactUser} onClose={() => setEditContactUser(null)} />
      <AdminResetPasswordModal user={resetTargetUser} isOpen={!!resetTargetUser} onClose={() => setResetTargetUser(null)} />

      {/* Bulk Confirm Modal */}
      {bulkActionModalType && (
        <BulkConfirmModal
          actionType={bulkActionModalType}
          selectedUsers={selectedUsers}
          onConfirm={handleExecuteBulkAction}
          onClose={() => setBulkActionModalType(null)}
          isProcessing={isBulkProcessing}
        />
      )}
    </div>
  );
};
