import { useAppStore } from '../store/appStore';
import { hasPermission, AppPermission } from './permissions';

export const usePermissions = () => {
  const { currentUser, isAuthenticated } = useAppStore();

  const can = (permission: AppPermission): boolean => {
    if (!isAuthenticated || !currentUser) return false;
    return hasPermission(currentUser, permission);
  };

  const canAny = (permissions: AppPermission[]): boolean => {
    return permissions.some(p => can(p));
  };

  const canAll = (permissions: AppPermission[]): boolean => {
    return permissions.every(p => can(p));
  };

  return {
    can,
    canAny,
    canAll,
    isAuthenticated,
    user: currentUser,
  };
};
