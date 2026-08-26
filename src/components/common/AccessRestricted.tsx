import React from 'react';
import { useAppStore } from '../../core/store/appStore';
import { UserRole, Permission } from '../../types';
import { 
  ShieldAlert, Lock, LogIn, Home, UserCheck, HelpCircle, ArrowLeft, AlertTriangle, FileKey2
} from 'lucide-react';
import { usePermissions } from '../../core/auth/usePermissions';
import { AppPermission } from '../../core/auth/permissions';

export interface AccessRestrictedProps {
  title?: string;
  message?: string;
  resourceName?: string;
  requiredRole?: UserRole | UserRole[] | string;
  requiredPermission?: Permission | Permission[] | string;
  requiredScope?: string;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
  supportContact?: string;
  id?: string;
}

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

  const formatRequiredRoles = () => {
    if (!requiredRole) return null;
    if (Array.isArray(requiredRole)) {
      return requiredRole.map((r) => r.replace('_', ' ').toUpperCase()).join(' | ');
    }
    return String(requiredRole).replace('_', ' ').toUpperCase();
  };

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
      setLoginModalOpen(true);
    }
  };

  if (compact) {
    return (
      <div 
        id={id}
        className="rounded-[2rem] bg-white border border-[#E5EAE7] p-8 shadow-sm space-y-6 animate-fadeIn"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#BE123C] flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-[#1A1F1D] font-display">{title}</h4>
              <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FEF2F2] text-[#BE123C]">
                Scope Restricted
              </span>
            </div>
            <p className="text-sm text-[#5C6661] leading-relaxed">
              {displayMessage}
            </p>
            {resourceName && (
              <div className="text-xs text-[#5C6661] pt-2">
                Target Resource: <span className="font-mono text-[#0F4C3A] font-bold">{resourceName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5EAE7] text-sm">
          <div className="text-[#5C6661]">
            Current Identity: <span className="text-[#1A1F1D] font-bold capitalize">{currentUser.name}</span> ({currentUser.role})
          </div>
          <div className="flex items-center gap-3">
            {isGuest ? (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="px-6 py-2.5 rounded-full bg-[#0F4C3A] hover:bg-[#0A3327] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Unlock</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-[#F2F6F4] text-[#1A1F1D] border border-[#E5EAE7] font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={id}
      className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn text-center space-y-8"
    >
      <div className="bg-white border border-[#E5EAE7] rounded-[2rem] p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden">

        <div className="relative mx-auto w-24 h-24 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#BE123C]">
          <ShieldAlert className="w-10 h-10" />
          <div className="absolute 0 right-0 w-8 h-8 rounded-full bg-white border-2 border-[#BE123C] flex items-center justify-center text-[#BE123C]">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2F6F4] text-[#5C6661] text-xs font-bold uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4 text-[#B45309]" />
            <span>Institutional Access Control</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1A1F1D] tracking-tight">
            {title}
          </h2>

          {resourceName && (
            <div className="inline-block px-4 py-2 rounded-xl bg-[#F2F6F4] text-xs text-[#0F4C3A] font-bold font-mono">
              Target: {resourceName}
            </div>
          )}

          <p className="text-[#5C6661] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            {displayMessage}
          </p>
        </div>

        <div className="p-6 bg-[#FDFDFB] rounded-[1.5rem] border border-[#E5EAE7] text-left text-sm space-y-4">
          <div className="flex items-center justify-between font-bold text-[#1A1F1D] border-b border-[#E5EAE7] pb-3">
            <span className="flex items-center gap-2">
              <FileKey2 className="w-5 h-5 text-[#0F4C3A]" />
              <span>Session Authorization Context</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#F2F6F4] text-[#5C6661]">
              Policy Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[#5C6661] block text-xs mb-1 uppercase tracking-widest font-bold">Authenticated User</span>
              <span className="text-[#1A1F1D] font-bold">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-[#5C6661] block text-xs mb-1 uppercase tracking-widest font-bold">Active Role</span>
              <span className="text-[#0F4C3A] font-bold uppercase">{currentUser.role}</span>
            </div>
            <div>
              <span className="text-[#5C6661] block text-xs mb-1 uppercase tracking-widest font-bold">Department Scope</span>
              <span className="text-[#1A1F1D]">{currentUser.department || 'General Public'}</span>
            </div>
            <div>
              <span className="text-[#5C6661] block text-xs mb-1 uppercase tracking-widest font-bold">Account Status</span>
              <span className="text-[#0F4C3A] font-bold capitalize">{currentUser.approvalStatus || 'Active'}</span>
            </div>
          </div>

          {(requiredRole || requiredPermission || requiredScope) && (
            <div className="pt-4 border-t border-[#E5EAE7] space-y-2 text-sm">
              <div className="text-[#1A1F1D] font-bold mb-2">Required Access Criteria:</div>
              {requiredRole && (
                <div className="flex items-center gap-2">
                  <span className="text-[#5C6661]">Required Role:</span>
                  <span className="px-2 py-1 rounded bg-[#E5F0EB] text-[#0F4C3A] font-bold font-mono text-xs">
                    {formatRequiredRoles()}
                  </span>
                </div>
              )}
              {requiredPermission && (
                <div className="flex items-start gap-2">
                  <span className="text-[#5C6661] flex-shrink-0">Permission:</span>
                  <span className="text-[#1A1F1D] font-mono font-bold text-xs">
                    {formatRequiredPermissions()}
                  </span>
                </div>
              )}
              {requiredScope && (
                <div className="flex items-center gap-2">
                  <span className="text-[#5C6661]">Scope:</span>
                  <span className="text-[#1A1F1D] font-bold">{requiredScope}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            id="btn-access-restricted-primary"
            type="button"
            onClick={handlePrimaryAction}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0F4C3A] hover:bg-[#0A3327] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
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
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#F2F6F4] text-[#1A1F1D] border border-[#E5EAE7] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
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

        <div className="pt-6 border-t border-[#E5EAE7] flex items-center justify-center gap-2 text-sm text-[#5C6661]">
          <HelpCircle className="w-4 h-4" />
          <span>Need access authorization? Contact</span>
          <a href={`mailto:${supportContact}`} className="text-[#0F4C3A] hover:underline font-bold">
            {supportContact}
          </a>
        </div>
      </div>
    </div>
  );
};

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
