import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../../types';
import { 
  UserCheck, 
  Ban, 
  Trash2, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Loader2,
  ShieldAlert
} from 'lucide-react';

export type BulkActionType = 'approve' | 'suspend' | 'delete';

interface BulkConfirmModalProps {
  isOpen: boolean;
  actionType: BulkActionType | null;
  selectedUsers: UserProfile[];
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isProcessing?: boolean;
}

export const BulkConfirmModal: React.FC<BulkConfirmModalProps> = ({
  isOpen,
  actionType,
  selectedUsers,
  onClose,
  onConfirm,
  isProcessing = false,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [confirmedDestructive, setConfirmedDestructive] = useState(false);

  const handleClose = useCallback(() => {
    setFilterQuery('');
    setConfirmedDestructive(false);
    onClose();
  }, [onClose]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, handleClose]);

  if (!isOpen || !actionType) return null;

  const count = selectedUsers.length;

  const filteredPreview = selectedUsers.filter((u) =>
    u.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(filterQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (u.regNumber && u.regNumber.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const getActionConfig = () => {
    switch (actionType) {
      case 'approve':
        return {
          title: 'Confirm Bulk Account Approval',
          subtitle: `Grant active status and portal access to ${count} selected user${count > 1 ? 's' : ''}.`,
          icon: <UserCheck className="w-6 h-6 text-emerald-400" />,
          accentBg: 'bg-emerald-950/80 border-emerald-600/40 text-emerald-300',
          badgeBg: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40',
          buttonLabel: `Approve ${count} Account${count > 1 ? 's' : ''}`,
          description: `You are about to approve ${count} institutional account${count > 1 ? 's' : ''}. These users will immediately receive verified access to the GRI Portal, circulars, and academic services.`,
          requiresCheckbox: false,
        };
      case 'suspend':
        return {
          title: 'Confirm Bulk Account Suspension',
          subtitle: `Temporarily revoke portal access for ${count} selected user${count > 1 ? 's' : ''}.`,
          icon: <Ban className="w-6 h-6 text-amber-400" />,
          accentBg: 'bg-amber-950/80 border-amber-600/40 text-amber-300',
          badgeBg: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
          buttonBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40',
          buttonLabel: `Suspend ${count} Account${count > 1 ? 's' : ''}`,
          description: `You are about to suspend ${count} account${count > 1 ? 's' : ''}. Suspended users will be restricted from accessing internal university dashboards and services until an administrator reinstates them.`,
          requiresCheckbox: false,
        };
      case 'delete':
        return {
          title: 'Confirm Bulk Permanent Deletion',
          subtitle: `Permanently remove ${count} user record${count > 1 ? 's' : ''} from the database.`,
          icon: <Trash2 className="w-6 h-6 text-rose-400" />,
          accentBg: 'bg-rose-950/80 border-rose-600/40 text-rose-300',
          badgeBg: 'bg-rose-900/60 text-rose-300 border-rose-700/50',
          buttonBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40',
          buttonLabel: `Permanently Delete ${count} User${count > 1 ? 's' : ''}`,
          description: `Warning: This action is permanent and IRREVERSIBLE. ${count} user account${count > 1 ? 's' : ''} and their associated profile records will be permanently erased from Cloud Firestore.`,
          requiresCheckbox: true,
        };
    }
  };

  const config = getActionConfig();
  const isSubmitDisabled = isProcessing || (config.requiresCheckbox && !confirmedDestructive);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          handleClose();
        }
      }}
    >
      <div 
        className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${config.accentBg} flex-shrink-0`}>
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="modal-title" className="text-lg font-bold font-display text-white">
                  {config.title}
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
                  {count} Selected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {config.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isProcessing}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs">
          {/* Action Notice Box */}
          <div className={`p-4 rounded-2xl border ${config.accentBg} space-y-2`}>
            <div className="flex items-start gap-2.5">
              {actionType === 'delete' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  {actionType === 'delete' ? 'Destructive Operation Warning' : 'Action Details'}
                </div>
                <p className="leading-relaxed opacity-90">
                  {config.description}
                </p>
              </div>
            </div>
          </div>

          {/* User Review List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <span>Affected Users & Profiles</span>
                <span className="text-slate-500 font-normal">({count} total)</span>
              </div>

              {count > 3 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search in selected..."
                    className="bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-36 sm:w-44"
                  />
                </div>
              )}
            </div>

            {/* Scrollable list */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto divide-y divide-slate-800/80">
              {filteredPreview.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs">
                  No selected users match your search query.
                </div>
              ) : (
                filteredPreview.map((user) => (
                  <div key={user.id} className="p-2.5 sm:px-3.5 flex items-center justify-between gap-3 hover:bg-slate-900/50 transition">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                        {user.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-lg object-cover" 
                          />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 truncate flex items-center gap-1.5 font-mono">
                          <span>{user.email}</span>
                          {user.regNumber && <span>• {user.regNumber}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-slate-400 hidden sm:inline-block max-w-[120px] truncate" title={user.department}>
                        {user.department}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize border border-slate-700">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mandatory Checkbox for Destructive Delete */}
          {config.requiresCheckbox && (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-900/60 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="confirmDestructiveCheck"
                checked={confirmedDestructive}
                onChange={(e) => setConfirmedDestructive(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-rose-700 bg-slate-950 text-rose-600 focus:ring-0 cursor-pointer accent-rose-600"
              />
              <label 
                htmlFor="confirmDestructiveCheck" 
                className="text-xs text-rose-200 cursor-pointer leading-tight select-none"
              >
                I confirm that I want to permanently delete these <strong>{count}</strong> user accounts and understand that this action cannot be reversed.
              </label>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitDisabled}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${config.buttonBg}`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {actionType === 'approve' && <CheckCircle2 className="w-4 h-4" />}
                {actionType === 'suspend' && <Ban className="w-4 h-4" />}
                {actionType === 'delete' && <Trash2 className="w-4 h-4" />}
                <span>{config.buttonLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
