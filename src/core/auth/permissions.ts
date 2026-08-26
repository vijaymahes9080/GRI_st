import { Permission, UserProfile, UserRole, CircularItem, AiKnowledgeSource } from '../../types';

/**
 * Role-Based Access Control (RBAC) Default Permissions Matrix
 */
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
  'research.manage_projects',
  'research.manage_rac',
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
  'documents.download_restricted',
];

export const PERMISSION_CATEGORIES = [
  {
    name: 'Circulars & Announcements',
    permissions: [
      'circulars.view_public',
      'circulars.view_authenticated',
      'circulars.view_department',
      'circulars.view_confidential',
      'circulars.create',
      'circulars.publish',
      'circulars.manage',
    ] as Permission[],
  },
  {
    name: 'Attendance & Class Records',
    permissions: [
      'attendance.view_self',
      'attendance.view_department',
      'attendance.manage',
    ] as Permission[],
  },
  {
    name: 'Academics, Syllabus & Grades',
    permissions: [
      'academics.view_self',
      'academics.manage_grades',
      'academics.manage_curriculum',
    ] as Permission[],
  },
  {
    name: 'Research & Scholarly RAC',
    permissions: [
      'research.view_self',
      'research.manage_projects',
      'research.manage_rac',
    ] as Permission[],
  },
  {
    name: 'Grievance Redressal',
    permissions: [
      'grievance.submit',
      'grievance.review',
      'grievance.resolve',
    ] as Permission[],
  },
  {
    name: 'User Management & RBAC Control',
    permissions: [
      'users.view',
      'users.manage',
      'rbac.manage_permissions',
    ] as Permission[],
  },
  {
    name: 'System, Audit & AI Knowledge Access',
    permissions: [
      'system.config',
      'audit.view',
      'ai.public_knowledge',
      'ai.internal_knowledge',
      'ai.confidential_knowledge',
      'documents.download_public',
      'documents.download_restricted',
    ] as Permission[],
  },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: [
    'circulars.view_public',
    'ai.public_knowledge',
    'documents.download_public',
  ],
  student: [
    'circulars.view_public',
    'circulars.view_authenticated',
    'circulars.view_department',
    'attendance.view_self',
    'academics.view_self',
    'grievance.submit',
    'ai.public_knowledge',
    'ai.internal_knowledge',
    'documents.download_public',
    'documents.download_restricted',
  ],
  scholar: [
    'circulars.view_public',
    'circulars.view_authenticated',
    'circulars.view_department',
    'attendance.view_self',
    'academics.view_self',
    'research.view_self',
    'research.manage_rac',
    'grievance.submit',
    'ai.public_knowledge',
    'ai.internal_knowledge',
    'documents.download_public',
    'documents.download_restricted',
  ],
  faculty: [
    'circulars.view_public',
    'circulars.view_authenticated',
    'circulars.view_department',
    'circulars.create',
    'attendance.view_self',
    'attendance.view_department',
    'attendance.manage',
    'academics.view_self',
    'academics.manage_grades',
    'research.view_self',
    'research.manage_projects',
    'research.manage_rac',
    'grievance.submit',
    'grievance.review',
    'users.view',
    'ai.public_knowledge',
    'ai.internal_knowledge',
    'documents.download_public',
    'documents.download_restricted',
  ],
  dean: [
    'circulars.view_public',
    'circulars.view_authenticated',
    'circulars.view_department',
    'circulars.view_confidential',
    'circulars.create',
    'circulars.publish',
    'attendance.view_self',
    'attendance.view_department',
    'attendance.manage',
    'academics.view_self',
    'academics.manage_grades',
    'academics.manage_curriculum',
    'research.view_self',
    'research.manage_projects',
    'research.manage_rac',
    'grievance.submit',
    'grievance.review',
    'grievance.resolve',
    'users.view',
    'ai.public_knowledge',
    'ai.internal_knowledge',
    'documents.download_public',
    'documents.download_restricted',
  ],
  hod: [
    'circulars.view_public',
    'circulars.view_authenticated',
    'circulars.view_department',
    'circulars.create',
    'circulars.publish',
    'attendance.view_self',
    'attendance.view_department',
    'attendance.manage',
    'academics.view_self',
    'academics.manage_grades',
    'academics.manage_curriculum',
    'research.view_self',
    'research.manage_projects',
    'research.manage_rac',
    'grievance.submit',
    'grievance.review',
    'users.view',
    'ai.public_knowledge',
    'ai.internal_knowledge',
    'documents.download_public',
    'documents.download_restricted',
  ],
  exam_cell: [
    'circulars.view_public',
    'circulars.view_authenticated',
    'circulars.view_department',
    'circulars.view_confidential',
    'circulars.create',
    'circulars.publish',
    'attendance.view_department',
    'academics.manage_grades',
    'users.view',
    'ai.public_knowledge',
    'ai.internal_knowledge',
    'documents.download_public',
    'documents.download_restricted',
  ],
  dept_admin: [
    'circulars.view_public',
    'circulars.view_authenticated',
    'circulars.view_department',
    'circulars.create',
    'circulars.publish',
    'attendance.view_self',
    'attendance.view_department',
    'attendance.manage',
    'academics.view_self',
    'academics.manage_grades',
    'academics.manage_curriculum',
    'research.view_self',
    'research.manage_projects',
    'research.manage_rac',
    'grievance.submit',
    'grievance.review',
    'grievance.resolve',
    'users.view',
    'users.manage',
    'ai.public_knowledge',
    'ai.internal_knowledge',
    'documents.download_public',
    'documents.download_restricted',
  ],
  admin: [
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
    'research.manage_projects',
    'research.manage_rac',
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
    'documents.download_restricted',
  ],
  super_admin: [
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
    'research.manage_projects',
    'research.manage_rac',
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
    'documents.download_restricted',
  ],
};

export const ROLE_DEFAULT_PERMISSIONS = DEFAULT_ROLE_PERMISSIONS;

/**
 * Compute the effective permissions for a given user, factoring in their role,
 * custom grants, and revocations.
 */
export function getUserEffectivePermissions(user?: UserProfile | null): Permission[] {
  if (!user) {
    return ROLE_DEFAULT_PERMISSIONS.guest;
  }

  // Super admin always has all permissions
  if (user.role === 'super_admin' || user.role === 'admin') {
    return ROLE_DEFAULT_PERMISSIONS.admin;
  }

  const roleDefaults = ROLE_DEFAULT_PERMISSIONS[user.role] || ROLE_DEFAULT_PERMISSIONS.guest;
  const granted = new Set<Permission>(roleDefaults);

  // Add custom permissions
  if (user.customPermissions && Array.isArray(user.customPermissions)) {
    user.customPermissions.forEach((p) => granted.add(p));
  }

  // Remove revoked permissions
  if (user.revokedPermissions && Array.isArray(user.revokedPermissions)) {
    user.revokedPermissions.forEach((p) => granted.delete(p));
  }

  return Array.from(granted);
}

/**
 * Check if a user possesses a specific permission
 */
export function hasPermission(user: UserProfile | null | undefined, permission: Permission): boolean {
  if (!user) {
    return ROLE_DEFAULT_PERMISSIONS.guest.includes(permission);
  }

  if (user.role === 'admin' || user.role === 'super_admin') {
    return true;
  }

  const effective = getUserEffectivePermissions(user);
  return effective.includes(permission);
}

/**
 * Check if a user has ANY of the specified permissions
 */
export function hasAnyPermission(user: UserProfile | null | undefined, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(user, p));
}

/**
 * Check if a user has ALL of the specified permissions
 */
export function hasAllPermissions(user: UserProfile | null | undefined, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(user, p));
}

/**
 * Determine if a user is permitted to view a specific circular notice
 */
export function canAccessCircular(
  userOrCircular: UserProfile | CircularItem | null | undefined, 
  circularOrUser: CircularItem | UserProfile | null | undefined
): boolean {
  let user: UserProfile | null | undefined;
  let circular: CircularItem;

  if (userOrCircular && 'category' in userOrCircular && 'title' in userOrCircular) {
    circular = userOrCircular as CircularItem;
    user = circularOrUser as UserProfile | null | undefined;
  } else {
    user = userOrCircular as UserProfile | null | undefined;
    circular = circularOrUser as CircularItem;
  }

  if (!circular) return false;

  // Admin and Super Admin can view all circulars
  if (user && (user.role === 'admin' || user.role === 'super_admin')) {
    return true;
  }

  // Derive visibility
  const visibility = circular.visibility || (
    circular.category === 'ADMIN' ? 'CONFIDENTIAL_ADMIN' :
    circular.targetRole === 'ALL' || !circular.targetRole ? 'PUBLIC' : 'ROLE_RESTRICTED'
  );

  // 1. Public Circulars are accessible to everyone including guests
  if (visibility === 'PUBLIC') {
    return true;
  }

  // If user is guest or unauthenticated, cannot access non-public circulars
  if (!user || user.role === 'guest') {
    return false;
  }

  // 2. Authenticated circulars require signed-in university identity
  if (visibility === 'AUTHENTICATED') {
    return hasPermission(user, 'circulars.view_authenticated');
  }

  // 3. Role Restricted circulars
  if (visibility === 'ROLE_RESTRICTED') {
    if (circular.targetRoles && circular.targetRoles.length > 0) {
      return circular.targetRoles.includes(user.role);
    }
    if (circular.targetRole) {
      if (circular.targetRole === 'ALL') return true;
      if (circular.targetRole === 'STUDENT' && (user.role === 'student' || user.role === 'scholar')) return true;
      if (circular.targetRole === 'FACULTY' && user.role === 'faculty') return true;
      if (circular.targetRole === 'STAFF' && (user.role === 'faculty' || user.role === 'dept_admin')) return true;
    }
    return false;
  }

  // 4. Department Restricted circulars
  if (visibility === 'DEPARTMENT_RESTRICTED') {
    if (!hasPermission(user, 'circulars.view_department')) {
      return false;
    }
    if (circular.targetDepartments && circular.targetDepartments.length > 0) {
      return circular.targetDepartments.some(
        (d) => d.toLowerCase() === user.department.toLowerCase() || user.department.toLowerCase().includes(d.toLowerCase())
      );
    }
    return true;
  }

  // 5. Confidential Admin circulars
  if (visibility === 'CONFIDENTIAL_ADMIN') {
    return hasPermission(user, 'circulars.view_confidential');
  }

  return false;
}

/**
 * Filter AI Knowledge retrieval based on user role and permissions
 */
export function canAccessAiKnowledge(user: UserProfile | null | undefined, source: AiKnowledgeSource): boolean {
  if (user && (user.role === 'admin' || user.role === 'super_admin')) {
    return true;
  }

  const role = user?.role || 'guest';

  // Public topics accessible to all
  if (source.category === 'ADMISSIONS' || source.category === 'HISTORY' || source.category === 'GENERAL') {
    return true;
  }

  // Internal regulations, curriculum, hostels require authentication
  if (role === 'guest') {
    return false;
  }

  return true;
}

/**
 * Complete Permission Catalog for the Admin Access Control Manager
 */
export interface PermissionDefinition {
  id: Permission;
  label: string;
  category: 'Circulars' | 'Academics & Attendance' | 'Research' | 'Grievance' | 'User & RBAC Management' | 'AI & Documents';
  description: string;
}

export const PERMISSIONS_CATALOG: PermissionDefinition[] = [
  // Circulars
  {
    id: 'circulars.view_public',
    label: 'View Public Circulars',
    category: 'Circulars',
    description: 'Read open university announcements, public admission circulars, and tender notices.',
  },
  {
    id: 'circulars.view_authenticated',
    label: 'View Authenticated Circulars',
    category: 'Circulars',
    description: 'Read internal campus notices for registered students and employees.',
  },
  {
    id: 'circulars.view_department',
    label: 'View Department Circulars',
    category: 'Circulars',
    description: 'Read notices restricted to specific academic departments.',
  },
  {
    id: 'circulars.view_confidential',
    label: 'View Confidential Admin Circulars',
    category: 'Circulars',
    description: 'Access syndicate, executive council, and administrative confidential orders.',
  },
  {
    id: 'circulars.create',
    label: 'Create Circular Drafts',
    category: 'Circulars',
    description: 'Draft new departmental or university circulars for review.',
  },
  {
    id: 'circulars.publish',
    label: 'Publish Official Circulars',
    category: 'Circulars',
    description: 'Publish and dispatch circulars to students, faculty, and public channels.',
  },
  {
    id: 'circulars.manage',
    label: 'Full Circulars Management',
    category: 'Circulars',
    description: 'Edit, delete, archive, and target circular visibility metadata.',
  },

  // Academics & Attendance
  {
    id: 'attendance.view_self',
    label: 'View Own Attendance',
    category: 'Academics & Attendance',
    description: 'Check individual class attendance percentages and alerts.',
  },
  {
    id: 'attendance.view_department',
    label: 'View Department Attendance',
    category: 'Academics & Attendance',
    description: 'View class rosters and student attendance sheets in assigned department.',
  },
  {
    id: 'attendance.manage',
    label: 'Log & Update Attendance',
    category: 'Academics & Attendance',
    description: 'Submit daily lecture attendance and approve medical leave adjustments.',
  },
  {
    id: 'academics.view_self',
    label: 'View Own Academic Records',
    category: 'Academics & Attendance',
    description: 'Access enrolled courses, semester GPA, CGPA, and CIA internals.',
  },
  {
    id: 'academics.manage_grades',
    label: 'Enter CIA & Exam Marks',
    category: 'Academics & Attendance',
    description: 'Input Continuous Internal Assessment marks and grade sheets.',
  },
  {
    id: 'academics.manage_curriculum',
    label: 'Manage Curriculum & Syllabi',
    category: 'Academics & Attendance',
    description: 'Update department syllabus, credit structures, and CBCS offerings.',
  },

  // Research
  {
    id: 'research.view_self',
    label: 'View Research Portfolio',
    category: 'Research',
    description: 'Access research grants, publications, and doctoral milestones.',
  },
  {
    id: 'research.manage_rac',
    label: 'Manage RAC Semiannual Reviews',
    category: 'Research',
    description: 'Schedule and record Research Advisory Committee progress evaluations.',
  },
  {
    id: 'research.manage_projects',
    label: 'Manage Funded Projects',
    category: 'Research',
    description: 'Oversee external grants from DST, SERB, ICAR, CSIR, and MoE.',
  },

  // Grievance
  {
    id: 'grievance.submit',
    label: 'Submit Grievance Tickets',
    category: 'Grievance',
    description: 'Lodge formal complaints or academic requests to Samadhan Cell.',
  },
  {
    id: 'grievance.review',
    label: 'Review Department Grievances',
    category: 'Grievance',
    description: 'Examine and comment on student grievances in assigned department.',
  },
  {
    id: 'grievance.resolve',
    label: 'Resolve & Close Grievance Tickets',
    category: 'Grievance',
    description: 'Provide institutional decisions and formally close grievance files.',
  },

  // User & RBAC Management
  {
    id: 'users.view',
    label: 'View Directory Profiles',
    category: 'User & RBAC Management',
    description: 'Browse university faculty, scholar, and student profiles.',
  },
  {
    id: 'users.manage',
    label: 'Manage Users & Approvals',
    category: 'User & RBAC Management',
    description: 'Approve new user registrations, edit contacts, and reset credentials.',
  },
  {
    id: 'rbac.manage_permissions',
    label: 'Manage RBAC & Access Control',
    category: 'User & RBAC Management',
    description: 'Assign roles, custom permission grants, and department scopes.',
  },
  {
    id: 'system.config',
    label: 'System & Feature Flags',
    category: 'User & RBAC Management',
    description: 'Configure institutional settings, AI models, and feature switches.',
  },
  {
    id: 'audit.view',
    label: 'View Security Audit Logs',
    category: 'User & RBAC Management',
    description: 'Inspect timestamped audit logs of all administrative actions.',
  },

  // AI & Documents
  {
    id: 'ai.public_knowledge',
    label: 'Access Public AI Knowledge',
    category: 'AI & Documents',
    description: 'Interact with AI assistant on public university info, courses, and history.',
  },
  {
    id: 'ai.internal_knowledge',
    label: 'Access Internal AI Knowledge',
    category: 'AI & Documents',
    description: 'Query AI on internal syllabi, regulations, exam procedures, and hostel rules.',
  },
  {
    id: 'ai.confidential_knowledge',
    label: 'Access Confidential AI Knowledge',
    category: 'AI & Documents',
    description: 'Query administrative policies, governance resolutions, and financial rules.',
  },
  {
    id: 'documents.download_public',
    label: 'Download Public Documents',
    category: 'AI & Documents',
    description: 'Download prospectus, academic calendar, and public forms.',
  },
  {
    id: 'documents.download_restricted',
    label: 'Download Restricted Documents',
    category: 'AI & Documents',
    description: 'Download curriculum syllabi, examination hall tickets, and official certificates.',
  },
];
