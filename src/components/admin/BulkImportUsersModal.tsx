import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Shield, 
  Key, 
  Copy, 
  Check, 
  AlertCircle,
  Database
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { UserRole } from '../../types';

interface BulkImportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_JSON_DATA = [
  {
    "name": "Dr. S. Meenakshi",
    "email": "meenakshi.s@ruraluniv.ac.in",
    "role": "faculty",
    "department": "Department of Chemistry",
    "designation": "Professor & Dean",
    "phone": "+91 98421 11223",
    "password": "GRI@Meenakshi2026"
  },
  {
    "name": "R. Selvakumar",
    "email": "selvakumar.r@ruraluniv.ac.in",
    "role": "student",
    "department": "Department of Computer Science & Applications",
    "regNumber": "2024MCA1022",
    "phone": "+91 97890 22334",
    "semester": 3,
    "cgpa": 8.85
  },
  {
    "name": "A. Rajeshwari",
    "email": "rajeshwari.a@ruraluniv.ac.in",
    "role": "scholar",
    "department": "School of Agriculture & Rural Development",
    "regNumber": "2023PHDAG008",
    "phone": "+91 94432 33445"
  },
  {
    "name": "V. Balamurugan",
    "email": "balamurugan.v@ruraluniv.ac.in",
    "role": "staff",
    "department": "Controller of Examinations (CoE)",
    "designation": "Superintendent",
    "phone": "+91 94860 44556"
  }
];

export const BulkImportUsersModal: React.FC<BulkImportUsersModalProps> = ({ isOpen, onClose }) => {
  const { bulkImportUsers } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jsonText, setJsonText] = useState<string>('');
  const [defaultPassword, setDefaultPassword] = useState<string>('GRI@Admin2026');
  const [autoApprove, setAutoApprove] = useState<boolean>(true);
  
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  
  const [parseError, setParseError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{
    validCount: number;
    errorCount: number;
    errors: { index: number; email?: string; name?: string; message: string }[];
    validatedUsers: any[];
  } | null>(null);

  const [importSummary, setImportSummary] = useState<{
    importedCount: number;
    success: boolean;
  } | null>(null);

  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoadSample = () => {
    setJsonText(JSON.stringify(SAMPLE_JSON_DATA, null, 2));
    setParseError(null);
    setValidationResult(null);
    setImportSummary(null);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_JSON_DATA, null, 2));
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      setParseError(null);
      setValidationResult(null);
      setImportSummary(null);
    };
    reader.readAsText(file);
  };

  const handleValidate = () => {
    setParseError(null);
    setImportSummary(null);

    if (!jsonText.trim()) {
      setParseError('Please paste JSON data or load a sample file to proceed.');
      return;
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (err: any) {
      setParseError(`JSON Syntax Error: ${err.message}. Please verify quotes and commas.`);
      return;
    }

    if (!Array.isArray(parsedData)) {
      setParseError('JSON root must be an array of user objects: [ { ... }, { ... } ]');
      return;
    }

    if (parsedData.length === 0) {
      setParseError('The JSON array is empty. Please provide at least one user record.');
      return;
    }

    setIsValidating(true);

    const allowedRoles: UserRole[] = ['student', 'faculty', 'admin', 'staff', 'scholar', 'alumni', 'super_admin'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors: any[] = [];
    const validatedUsers: any[] = [];
    const seenEmails = new Set<string>();

    parsedData.forEach((row: any, idx: number) => {
      const rowNum = idx + 1;
      if (!row || typeof row !== 'object') {
        errors.push({ index: idx, message: `Row ${rowNum}: Record must be an object.` });
        return;
      }

      const name = (row.name || '').trim();
      const email = (row.email || '').trim().toLowerCase();
      const role = (row.role || '').toString().trim().toLowerCase() as UserRole;
      const department = (row.department || '').trim();
      const pwd = (row.password || row.tempPassword || defaultPassword).trim();

      if (!name || name.length < 2) {
        errors.push({ index: idx, email, name, message: `Row ${rowNum}: Name is required (minimum 2 chars).` });
        return;
      }
      if (!email || !emailRegex.test(email)) {
        errors.push({ index: idx, email, name, message: `Row ${rowNum}: Invalid email address "${email}".` });
        return;
      }
      if (seenEmails.has(email)) {
        errors.push({ index: idx, email, name, message: `Row ${rowNum}: Duplicate email "${email}" inside JSON batch.` });
        return;
      }
      seenEmails.add(email);

      if (!allowedRoles.includes(role)) {
        errors.push({ index: idx, email, name, message: `Row ${rowNum}: Invalid role "${role}". Allowed: ${allowedRoles.join(', ')}` });
        return;
      }
      if (!department) {
        errors.push({ index: idx, email, name, message: `Row ${rowNum}: Department is required.` });
        return;
      }
      if (pwd && pwd.length < 6) {
        errors.push({ index: idx, email, name, message: `Row ${rowNum}: Password must be at least 6 characters.` });
        return;
      }

      validatedUsers.push({
        ...row,
        name,
        email,
        role,
        department,
        password: pwd,
      });
    });

    setValidationResult({
      validCount: validatedUsers.length,
      errorCount: errors.length,
      errors,
      validatedUsers,
    });
    setIsValidating(false);
  };

  const handleExecuteImport = async () => {
    if (!validationResult || validationResult.validatedUsers.length === 0) {
      handleValidate();
      return;
    }

    setIsImporting(true);
    try {
      const result = await bulkImportUsers({
        users: validationResult.validatedUsers,
        autoApprove,
        defaultPassword,
      });

      setImportSummary({
        importedCount: result.validCount,
        success: result.success,
      });
    } catch (err: any) {
      setParseError(err.message || 'Import failed unexpectedly.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Bulk User Import (JSON)</h2>
              <p className="text-xs text-slate-400">Validate roles, credentials & batch-insert directly into GRI Master Directory & Firestore</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Options Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                Default Temporary Password (Min 6 chars)
              </label>
              <input 
                type="text"
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                placeholder="GRI@Admin2026"
                className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">Applied if individual user JSON record omits a specific password</p>
            </div>

            <div className="flex flex-col justify-between">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Institutional Approval Policy
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">Auto-approve imported users immediately</span>
              </label>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Load Sample JSON Template
              </button>
              <button
                type="button"
                onClick={handleCopySample}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTemplate ? 'Copied Template!' : 'Copy Template'}
              </button>
            </div>

            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".json,application/json" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                Upload .json File
              </button>
            </div>
          </div>

          {/* JSON Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                Paste JSON Configuration
                <span className="text-[11px] font-normal text-slate-500">(Array of user objects)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {jsonText ? `${jsonText.split('\n').length} lines` : 'Empty'}
              </span>
            </div>
            <textarea
              rows={9}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setParseError(null);
                setValidationResult(null);
                setImportSummary(null);
              }}
              placeholder={`[\n  {\n    "name": "Dr. S. Meenakshi",\n    "email": "meenakshi.s@ruraluniv.ac.in",\n    "role": "faculty",\n    "department": "Department of Chemistry"\n  }\n]`}
              className="w-full text-xs font-mono p-3.5 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Syntax Error Box */}
          {parseError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Validation Issue Detected</p>
                <p className="mt-0.5 text-red-600">{parseError}</p>
              </div>
            </div>
          )}

          {/* Validation Report Table */}
          {validationResult && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Pre-Import Verification Summary:</span>
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    {validationResult.validCount} Valid
                  </span>
                  {validationResult.errorCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-100 text-red-800">
                      {validationResult.errorCount} Errors
                    </span>
                  )}
                </div>
              </div>

              {/* Per-row Errors */}
              {validationResult.errors.length > 0 && (
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2.5 bg-red-50/80 border border-red-200 rounded-lg text-xs">
                  {validationResult.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-red-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span>{err.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Valid Preview List */}
              {validationResult.validatedUsers.length > 0 && (
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Department</th>
                        <th className="p-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {validationResult.validatedUsers.map((u, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 font-medium text-slate-900">{u.name}</td>
                          <td className="p-2 text-slate-600 font-mono text-[11px]">{u.email}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-2 text-slate-600 truncate max-w-[140px]">{u.department}</td>
                          <td className="p-2 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Ready
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Successful Import Outcome Banner */}
          {importSummary && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Bulk Import Successfully Completed!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    {importSummary.importedCount} user accounts were securely validated and written to Firestore & local state.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Close & View Table
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            Batch Write supports up to 500 records per transaction
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleValidate}
              disabled={isValidating || !jsonText.trim()}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              {isValidating ? 'Validating...' : 'Validate Schema'}
            </button>

            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={isImporting || !validationResult || validationResult.validatedUsers.length === 0}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Writing to Database...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Commit {validationResult?.validatedUsers.length ? `(${validationResult.validatedUsers.length})` : ''} to Firestore
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
