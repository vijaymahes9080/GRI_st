import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  ALL_PERMISSIONS, 
  PERMISSION_CATEGORIES, 
  DEFAULT_ROLE_PERMISSIONS, 
  getUserEffectivePermissions, 
  hasPermission 
} from '../../core/auth/permissions';
import { Permission, UserRole, UserProfile } from '../../types';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Users, 
  Key, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Layers, 
  Search, 
  Filter, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react';

export const RbacManagerView: React.FC = () => {
  const { 
    currentUser, 
    usersList, 
    updateUserRole, 
    updateUserCustomPermissions, 
    updateUserAcademicHierarchy,
    schools 
  } = useAppStore();

  const [selectedUserId, setSelectedUserId] = useState<string>(usersList[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users_permissions' | 'role_matrix' | 'hierarchy_builder'>('users_permissions');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Selected user
  const selectedUser = usersList.find((u) => u.id === selectedUserId) || usersList[0];

  // Editable hierarchy state
  const [editDept, setEditDept] = useState(selectedUser?.department || '');
  const [editSchoolName, setEditSchoolName] = useState(selectedUser?.schoolName || '');
  const [editProgCode, setEditProgCode] = useState(selectedUser?.programmeCode || '');
  const [editProgName, setEditProgName] = useState(selectedUser?.programmeName || '');
  const [editSemester, setEditSemester] = useState<number>(selectedUser?.semester || 1);
  const [editSection, setEditSection] = useState(selectedUser?.section || 'A');

  // Custom permissions buffer
  const [customPerms, setCustomPerms] = useState<Permission[]>(selectedUser?.customPermissions || []);
  const [revokedPerms, setRevokedPerms] = useState<Permission[]>(selectedUser?.revokedPermissions || []);

  // Sync state when selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      setEditDept(selectedUser.department || '');
      setEditSchoolName(selectedUser.schoolName || '');
      setEditProgCode(selectedUser.programmeCode || '');
      setEditProgName(selectedUser.programmeName || '');
      setEditSemester(selectedUser.semester || 1);
      setEditSection(selectedUser.section || 'A');
      setCustomPerms(selectedUser.customPermissions || []);
      setRevokedPerms(selectedUser.revokedPermissions || []);
    }
  }, [selectedUserId]);

  const effectivePermissions = selectedUser ? getUserEffectivePermissions(selectedUser) : [];

  const handleTogglePermission = (perm: Permission) => {
    const isDefault = DEFAULT_ROLE_PERMISSIONS[selectedUser.role]?.includes(perm);

    if (isDefault) {
      // Toggle revocation
      if (revokedPerms.includes(perm)) {
        setRevokedPerms(revokedPerms.filter((p) => p !== perm));
      } else {
        setRevokedPerms([...revokedPerms, perm]);
      }
    } else {
      // Toggle custom grant
      if (customPerms.includes(perm)) {
        setCustomPerms(customPerms.filter((p) => p !== perm));
      } else {
        setCustomPerms([...customPerms, perm]);
      }
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    await updateUserCustomPermissions(selectedUser.id, customPerms, revokedPerms);
    setSaveSuccessMsg(`Permissions updated successfully for ${selectedUser.name}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveHierarchy = async () => {
    if (!selectedUser) return;
    await updateUserAcademicHierarchy(selectedUser.id, {
      department: editDept,
      schoolName: editSchoolName,
      programmeCode: editProgCode || undefined,
      programmeName: editProgName || undefined,
      semester: editSemester,
      section: editSection,
    });
    setSaveSuccessMsg(`Academic Hierarchy updated for ${selectedUser.name}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.regNumber && u.regNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-600/40 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Granular Role-Based Access Control (RBAC) & Hierarchy Manager</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            Institutional Access Control & Identity Hierarchy
          </h2>
          <p className="text-xs text-slate-400">
            Define fine-grained permission scopes, department/school associations, and individualized privilege overrides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('users_permissions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'users_permissions'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            User Permissions
          </button>
          <button
            onClick={() => setActiveTab('hierarchy_builder')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'hierarchy_builder'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Academic Hierarchy
          </button>
          <button
            onClick={() => setActiveTab('role_matrix')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'role_matrix'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Role Matrix
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Tab: User Permissions */}
      {activeTab === 'users_permissions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: User Directory */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>University Directory ({filteredUsers.length})</span>
                </h3>
              </div>

              {/* Search & Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, roll no, email..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                  {['all', 'student', 'faculty', 'admin', 'dean', 'hod', 'exam_cell'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-2 py-0.5 rounded-lg font-semibold capitalize whitespace-nowrap transition ${
                        roleFilter === role
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                          : 'bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-800'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* User List */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredUsers.map((u) => {
                  const isSelected = u.id === selectedUserId;
                  const customCount = (u.customPermissions?.length || 0) + (u.revokedPermissions?.length || 0);

                  return (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">{u.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 capitalize">
                            {u.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{u.department}</p>
                        <p className="text-[10px] font-mono text-slate-500 truncate">{u.email}</p>
                      </div>

                      {customCount > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex-shrink-0">
                          {customCount} custom
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: User Permissions Inspector & Overrides */}
          <div className="lg:col-span-8 space-y-5">
            {selectedUser ? (
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
                {/* User Header & Role Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 capitalize">
                          {selectedUser.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {selectedUser.schoolName || 'School of Sciences'} • {selectedUser.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Change Base Role</span>
                      <select
                        value={selectedUser.role}
                        onChange={(e) => updateUserRole(selectedUser.id, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-700 text-xs text-emerald-400 rounded-xl px-3 py-1.5 focus:outline-none capitalize font-semibold"
                      >
                        {['student', 'faculty', 'admin', 'super_admin', 'dean', 'hod', 'exam_cell', 'guest'].map((r) => (
                          <option key={r} value={r}>
                            {r.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleSavePermissions}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Overrides</span>
                    </button>
                  </div>
                </div>

                {/* Effective Permissions Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Base Role Grants</span>
                    <strong className="text-sky-400 text-sm font-semibold">
                      {DEFAULT_ROLE_PERMISSIONS[selectedUser.role]?.length || 0} permissions
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Custom Grants (+)</span>
                    <strong className="text-emerald-400 text-sm font-semibold">
                      {customPerms.length} added
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Revocations (-)</span>
                    <strong className="text-rose-400 text-sm font-semibold">
                      {revokedPerms.length} revoked
                    </strong>
                  </div>
                </div>

                {/* Granular Permission Toggles by Category */}
                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Granular Permission Matrix</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PERMISSION_CATEGORIES.map((category) => (
                      <div key={category.name} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/90 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-xs font-bold text-slate-200">{category.name}</span>
                          <span className="text-[10px] text-slate-500">{category.permissions.length} actions</span>
                        </div>

                        <div className="space-y-1.5">
                          {category.permissions.map((perm) => {
                            const isBaseRole = DEFAULT_ROLE_PERMISSIONS[selectedUser.role]?.includes(perm);
                            const isCustomGranted = customPerms.includes(perm);
                            const isRevoked = revokedPerms.includes(perm);
                            const isEffective = (isBaseRole && !isRevoked) || isCustomGranted;

                            return (
                              <div
                                key={perm}
                                onClick={() => handleTogglePermission(perm)}
                                className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                                  isEffective
                                    ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-200'
                                    : 'bg-slate-900 border-slate-800/70 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                    isEffective ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                                  }`}>
                                    {isEffective ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                  </div>
                                  <span className="font-mono text-[11px] truncate">{perm}</span>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {isRevoked && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                                      Revoked
                                    </span>
                                  )}
                                  {isCustomGranted && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                                      Custom Grant
                                    </span>
                                  )}
                                  {isBaseRole && !isRevoked && (
                                    <span className="text-[9px] font-semibold text-slate-500">
                                      Base
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center text-slate-400">
                Select a user from the directory to inspect and customize permissions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Academic Hierarchy Builder */}
      {activeTab === 'hierarchy_builder' && selectedUser && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Academic Hierarchy Configuration: {selectedUser.name}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Configure School, Department, Programme, Semester, and Section to govern circular visibility and personalized dashboard widgets.
              </p>
            </div>

            <button
              onClick={handleSaveHierarchy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Hierarchy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">School of Study</label>
              <select
                value={editSchoolName}
                onChange={(e) => setEditSchoolName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                placeholder="e.g. Department of Computer Science & Applications"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Programme Name</label>
              <input
                type="text"
                value={editProgName}
                onChange={(e) => setEditProgName(e.target.value)}
                placeholder="e.g. Master of Computer Applications (MCA)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Programme Code</label>
              <input
                type="text"
                value={editProgCode}
                onChange={(e) => setEditProgCode(e.target.value)}
                placeholder="e.g. MCA, MSC_PHY, BTECH_CIVIL"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Semester / Academic Year</label>
              <input
                type="number"
                min={1}
                max={10}
                value={editSemester}
                onChange={(e) => setEditSemester(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Class Section</label>
              <input
                type="text"
                value={editSection}
                onChange={(e) => setEditSection(e.target.value)}
                placeholder="e.g. A, B, Regular, Self-Supporting"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Complete Role Permission Matrix */}
      {activeTab === 'role_matrix' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Complete Institutional Role Permission Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">
                Official institutional access control map across all user tiers:
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300">
                  <th className="p-3 font-semibold">Permission Action</th>
                  <th className="p-3 font-semibold text-center text-slate-400">Guest</th>
                  <th className="p-3 font-semibold text-center text-sky-400">Student</th>
                  <th className="p-3 font-semibold text-center text-emerald-400">Faculty</th>
                  <th className="p-3 font-semibold text-center text-teal-400">Dean / HoD</th>
                  <th className="p-3 font-semibold text-center text-rose-400">Exam Cell</th>
                  <th className="p-3 font-semibold text-center text-amber-400">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ALL_PERMISSIONS.map((perm) => (
                  <tr key={perm} className="hover:bg-slate-950/40">
                    <td className="p-2.5 font-mono text-[11px] text-slate-200">{perm}</td>
                    <td className="p-2.5 text-center">
                      {DEFAULT_ROLE_PERMISSIONS.guest.includes(perm) ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {DEFAULT_ROLE_PERMISSIONS.student.includes(perm) ? (
                        <Check className="w-3.5 h-3.5 text-sky-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {DEFAULT_ROLE_PERMISSIONS.faculty.includes(perm) ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {DEFAULT_ROLE_PERMISSIONS.dean.includes(perm) ? (
                        <Check className="w-3.5 h-3.5 text-teal-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {DEFAULT_ROLE_PERMISSIONS.exam_cell.includes(perm) ? (
                        <Check className="w-3.5 h-3.5 text-rose-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {DEFAULT_ROLE_PERMISSIONS.admin.includes(perm) ? (
                        <Check className="w-3.5 h-3.5 text-amber-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
