import { Permission, UserRole, UserProfile } from '../../types';

export type AppPermission = Permission | 'tab.admin.view' | 'tab.profile.view' | 'tab.academics.view' | 'tab.examinations.view' | 'tab.hostel.view';

export const ALL_PERMISSIONS: Permission[] = [
  'circulars.view_public',
  'circulars.view_authenticated',
  'circulars.view_department',
  'circulars.view_confidential',
  'circulars.create',
  'circulars.publish',
  'circulars.manage',
  'attendance.view_self',
  'attendance.view_department',
  'attendance.manage',
  'academics.view_self',
  'academics.manage_grades',
  'academics.manage_curriculum',
  'research.view_self',
  'research.manage_rac',
  'research.manage_projects',
  'grievance.submit',
  'grievance.review',
  'grievance.resolve',
  'users.view',
  'users.manage',
  'rbac.manage_permissions',
  'system.config',
  'audit.view',
  'ai.public_knowledge',
  'ai.internal_knowledge',
  'ai.confidential_knowledge',
  'documents.download_public',
  'documents.download_restricted'
];

export const PERMISSION_CATEGORIES = {
  'Circulars': ALL_PERMISSIONS.filter(p => p.startsWith('circulars.')),
  'Attendance': ALL_PERMISSIONS.filter(p => p.startsWith('attendance.')),
  'Academics': ALL_PERMISSIONS.filter(p => p.startsWith('academics.')),
  'Research': ALL_PERMISSIONS.filter(p => p.startsWith('research.')),
  'Grievance': ALL_PERMISSIONS.filter(p => p.startsWith('grievance.')),
  'Admin': ALL_PERMISSIONS.filter(p => p.startsWith('users.') || p.startsWith('rbac.') || p.startsWith('system.') || p.startsWith('audit.')),
  'AI Knowledge': ALL_PERMISSIONS.filter(p => p.startsWith('ai.')),
  'Documents': ALL_PERMISSIONS.filter(p => p.startsWith('documents.'))
};

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [...ALL_PERMISSIONS],
  admin: ALL_PERMISSIONS.filter(p => !p.startsWith('rbac.') && !p.startsWith('audit.')),
  dept_admin: ['circulars.view_public', 'circulars.view_authenticated', 'circulars.view_department', 'circulars.create', 'circulars.publish', 'attendance.view_department', 'academics.manage_curriculum', 'users.view', 'grievance.review', 'ai.public_knowledge', 'ai.internal_knowledge', 'documents.download_public', 'documents.download_restricted'],
  faculty: ['circulars.view_public', 'circulars.view_authenticated', 'circulars.view_department', 'attendance.view_self', 'attendance.manage', 'academics.view_self', 'academics.manage_grades', 'research.manage_rac', 'ai.public_knowledge', 'ai.internal_knowledge', 'documents.download_public', 'documents.download_restricted'],
  scholar: ['circulars.view_public', 'circulars.view_authenticated', 'circulars.view_department', 'research.view_self', 'ai.public_knowledge', 'documents.download_public'],
  student: ['circulars.view_public', 'circulars.view_authenticated', 'circulars.view_department', 'attendance.view_self', 'academics.view_self', 'grievance.submit', 'ai.public_knowledge', 'documents.download_public'],
  guest: ['circulars.view_public', 'ai.public_knowledge', 'documents.download_public']
};

export const getUserEffectivePermissions = (user: UserProfile | null | undefined): Permission[] => {
  if (!user || !user.role) return DEFAULT_ROLE_PERMISSIONS['guest'];
  
  const basePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
  let effective = [...basePermissions];

  if (user.customPermissions) {
    user.customPermissions.forEach(p => {
      if (!effective.includes(p)) effective.push(p);
    });
  }

  if (user.revokedPermissions) {
    effective = effective.filter(p => !user.revokedPermissions!.includes(p));
  }

  return effective;
};

const TAB_PERMISSIONS: Record<string, AppPermission[]> = {
  super_admin: ['tab.admin.view', 'tab.profile.view', 'tab.academics.view', 'tab.examinations.view', 'tab.hostel.view'],
  admin: ['tab.admin.view', 'tab.profile.view', 'tab.academics.view', 'tab.examinations.view', 'tab.hostel.view'],
  dept_admin: ['tab.admin.view', 'tab.profile.view', 'tab.academics.view', 'tab.examinations.view'],
  faculty: ['tab.profile.view', 'tab.academics.view', 'tab.examinations.view'],
  scholar: ['tab.profile.view', 'tab.academics.view', 'tab.hostel.view'],
  student: ['tab.profile.view', 'tab.academics.view', 'tab.examinations.view', 'tab.hostel.view'],
  guest: []
};

export const hasPermission = (userOrRole: UserProfile | string | undefined | null, permission: AppPermission): boolean => {
  if (!userOrRole) return false;
  
  if (typeof userOrRole === 'object') {
    if (userOrRole.role === 'guest') return false;
    
    // Check if it's a tab permission
    if (permission.startsWith('tab.')) {
      return (TAB_PERMISSIONS[userOrRole.role] || []).includes(permission);
    }
    
    const effective = getUserEffectivePermissions(userOrRole);
    return effective.includes(permission as Permission);
  }
  
  // Handling role string directly
  const role = userOrRole.toLowerCase() as UserRole;
  if (role === 'guest') return false;
  
  if (permission.startsWith('tab.')) {
    return (TAB_PERMISSIONS[role] || []).includes(permission);
  }
  
  const perms = DEFAULT_ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission as Permission);
};

export const canAccessCircular = (circular: any, user: UserProfile | null | undefined): boolean => {
  if (circular.visibility === 'public') return true;
  
  if (!user || user.role === 'guest') return false;

  if (circular.visibility === 'authenticated') return true;

  if (circular.visibility === 'department_restricted') {
    return !!(user.department && circular.targetDepartments && circular.targetDepartments.includes(user.department));
  }

  if (circular.visibility === 'role_restricted') {
    return !!(user.role && circular.targetRoles && circular.targetRoles.includes(user.role));
  }

  if (circular.visibility === 'confidential') {
    return hasPermission(user, 'circulars.view_confidential' as any);
  }

  // Handle older schemas or missing visibility
  if (circular.targetRole && circular.targetRole !== 'ALL') {
    if (user.role.toUpperCase() !== circular.targetRole.toUpperCase()) return false;
  }

  return true;
};
