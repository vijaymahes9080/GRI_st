import React from 'react';
import { useAppStore } from '../../core/store/appStore';
import { UserRole, Permission } from '../../types';
import { 
  ShieldAlert, 
  Lock, 
  LogIn, 
  Home, 
  UserCheck, 
  HelpCircle, 
  ArrowLeft, 
  AlertTriangle,
  FileKey2,
  Building2,
  Mail
} from 'lucide-react';
import { usePermissions } from '../../core/auth/usePermissions';
import { AppPermission } from '../../core/auth/permissions';

export interface AccessRestrictedProps {
  /** Title of the restricted access message */
  title?: string;
  /** Primary description or explanation of the restriction */
  message?: string;
  /** The specific resource, page, or module being accessed */
  resourceName?: string;
  /** The role or roles required to access this resource */
  requiredRole?: UserRole | UserRole[] | string;
  /** The specific permission or permissions required */
  requiredPermission?: Permission | Permission[] | string;
  /** Explicit departmental or organisational scope required (e.g., 'Department: Computer Science') */
  requiredScope?: string;
  /** Optional custom action text for the primary button */
  primaryActionText?: string;
  /** Custom handler for the primary action button */
  onPrimaryAction?: () => void;
  /** Optional custom action text for the secondary button */
  secondaryActionText?: string;
  /** Custom handler for the secondary action button */
  onSecondaryAction?: () => void;
  /** Whether to render as an inline compact card or full-page banner */
  compact?: boolean;
  /** Support contact email or office */
  supportContact?: string;
  /** Unique HTML id */
  id?: string;
}

/**
 * Standardized Access Restricted component for GRI Institutional Portal.
 * Displays clear feedback and resolution pathways when a user attempts to
 * navigate to a view, route, or feature outside their authorized permission scope.
 */
export const AccessRestricted: React.FC<AccessRestrictedProps> = ({
  title = 'Access Restricted',
  message,
  resourceName,
  requiredRole,
  requiredPermission,
  requiredScope,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  compact = false,
  supportContact = 'samadhan@ruraluniv.ac.in',
  id = 'access-restricted-container',
}) => {
  const { currentUser, setTab, setLoginModalOpen } = useAppStore();

  const isGuest = currentUser.role === 'guest';

  // Format required roles into a readable string
  const formatRequiredRoles = () => {
    if (!requiredRole) return null;
    if (Array.isArray(requiredRole)) {
      return requiredRole.map((r) => r.replace('_', ' ').toUpperCase()).join(' | ');
    }
    return String(requiredRole).replace('_', ' ').toUpperCase();
  };

  // Format required permissions into a readable string
  const formatRequiredPermissions = () => {
    if (!requiredPermission) return null;
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.join(', ');
    }
    return String(requiredPermission);
  };

  const defaultMessage = isGuest
    ? 'This institutional service requires authentication with a verified Gandhigram Rural Institute Student or Staff account.'
    : 'Your active session profile does not hold the requisite authorization or departmental scope to view this institutional section.';

  const displayMessage = message || defaultMessage;

  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else if (isGuest) {
      setLoginModalOpen(true);
    } else {
      setTab('home');
    }
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else if (isGuest) {
      setTab('home');
    } else {
      setLoginModalOpen(true); // Allows switching or re-authenticating
    }
  };

  // Compact inline mode (for widgets, tab panels, or card sub-sections)
  if (compact) {
    return (
      <div 
        id={id}
        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4 animate-fadeIn"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white font-display">{title}</h4>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-emerald-300 border border-slate-700">
                Scope Restricted
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {displayMessage}
            </p>
            {resourceName && (
              <div className="text-[11px] text-slate-300 pt-1">
                Target Resource: <span className="font-mono text-emerald-400 font-semibold">{resourceName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="text-[11px] text-slate-500">
            Current Identity: <span className="text-slate-300 capitalize">{currentUser.name}</span> ({currentUser.role})
          </div>
          <div className="flex items-center gap-2">
            {isGuest ? (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Unlock</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition border border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full-page / Standalone banner mode
  return (
    <div 
      id={id}
      className="max-w-2xl mx-auto py-10 px-4 animate-fadeIn text-center space-y-6"
    >
      <div className="bg-slate-900/95 backdrop-blur border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Background ambient decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Security Shield Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-emerald-400 shadow-xl shadow-slate-950/50">
          <ShieldAlert className="w-10 h-10" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-emerald-600 flex items-center justify-center text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Institutional Access Control</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            {title}
          </h2>

          {resourceName && (
            <div className="inline-block px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-medium font-mono">
              Target: {resourceName}
            </div>
          )}

          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed pt-1">
            {displayMessage}
          </p>
        </div>

        {/* Context Details Card */}
        <div className="p-4 sm:p-5 bg-slate-950/90 rounded-2xl border border-slate-800 text-left text-xs space-y-3.5">
          <div className="flex items-center justify-between text-slate-400 font-semibold border-b border-slate-800/80 pb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <FileKey2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session Authorization Context</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
              Policy Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block">Authenticated User:</span>
              <span className="text-slate-200 font-medium">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Active Role:</span>
              <span className="text-emerald-400 font-mono font-bold uppercase">{currentUser.role}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Department Scope:</span>
              <span className="text-slate-200">{currentUser.department || 'General Public'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Account Status:</span>
              <span className="text-emerald-400 capitalize">{currentUser.approvalStatus || 'Active'}</span>
            </div>
          </div>

          {(requiredRole || requiredPermission || requiredScope) && (
            <div className="pt-2.5 border-t border-slate-800/80 text-[11px] space-y-1.5">
              <div className="text-slate-400 font-semibold">Required Access Criteria:</div>
              {requiredRole && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Required Role:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold">
                    {formatRequiredRoles()}
                  </span>
                </div>
              )}
              {requiredPermission && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 flex-shrink-0">Permission:</span>
                  <span className="text-slate-300 font-mono break-all">
                    {formatRequiredPermissions()}
                  </span>
                </div>
              )}
              {requiredScope && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Scope:</span>
                  <span className="text-slate-300">{requiredScope}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="btn-access-restricted-primary"
            type="button"
            onClick={handlePrimaryAction}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
          >
            {isGuest ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{primaryActionText || 'Sign In with Institutional ID'}</span>
              </>
            ) : (
              <>
                <Home className="w-4 h-4" />
                <span>{primaryActionText || 'Return to Dashboard'}</span>
              </>
            )}
          </button>

          <button
            id="btn-access-restricted-secondary"
            type="button"
            onClick={handleSecondaryAction}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            {isGuest ? (
              <>
                <Home className="w-4 h-4" />
                <span>{secondaryActionText || 'Explore Public Website'}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>{secondaryActionText || 'Switch User Identity'}</span>
              </>
            )}
          </button>
        </div>

        {/* Support helpdesk footnote */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Need access authorization? Contact Samadhan Grievance Cell at</span>
          <a href={`mailto:${supportContact}`} className="text-emerald-400 hover:underline font-medium">
            {supportContact}
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Route / Component protection wrapper.
 * Automatically checks whether the current active user possesses the required
 * role and/or permissions, rendering AccessRestricted if unauthorized.
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  resourceName?: string;
  fallbackMessage?: string;
  compact?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  resourceName,
  fallbackMessage,
  compact = false,
}) => {
  const { currentUser } = useAppStore();
  const { canAll } = usePermissions();

  // Role verification
  if (allowedRoles && allowedRoles.length > 0) {
    const isRoleAllowed = allowedRoles.includes(currentUser.role) || currentUser.role === 'super_admin';
    if (!isRoleAllowed) {
      return (
        <AccessRestricted
          resourceName={resourceName}
          requiredRole={allowedRoles}
          message={fallbackMessage}
          compact={compact}
        />
      );
    }
  }

  // Permissions verification
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAll = canAll(requiredPermissions as AppPermission[]);
    if (!hasAll) {
      return (
        <AccessRestricted
          resourceName={resourceName}
          requiredPermission={requiredPermissions}
          message={fallbackMessage}
          compact={compact}
        />
      );
    }
  }

  return <>{children}</>;
};
