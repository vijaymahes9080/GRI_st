import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  X, 
  FileText, 
  BookOpen, 
  Briefcase, 
  Building, 
  Bus, 
  DollarSign, 
  HelpCircle, 
  Download, 
  Printer, 
  Search, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Award,
  RefreshCw,
  CreditCard,
  Send,
  User,
  Phone,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { INSTITUTION_INFO, EXAM_SCHEDULE_MOCK, LIBRARY_CATALOG_MOCK, INITIAL_PLACEMENTS } from '../../core/data/griMasterData';

export type ServiceType = 'exam' | 'library' | 'certificates' | 'hostel' | 'transport' | 'fees' | 'grievance' | 'careers';

interface ServiceDetailModalProps {
  service: ServiceType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, isOpen, onClose }) => {
  const { currentUser, setLoginModalOpen, grievances, addGrievance } = useAppStore();

  // Internal tab states for each service
  const [examTab, setExamTab] = useState<'results' | 'hallticket' | 'timetable' | 'revaluation'>('results');
  const [libraryTab, setLibraryTab] = useState<'catalog' | 'borrowed' | 'eresources'>('catalog');
  const [certTab, setCertTab] = useState<'apply' | 'track'>('apply');
  const [hostelTab, setHostelTab] = useState<'outpass' | 'room' | 'mess'>('outpass');
  const [transportTab, setTransportTab] = useState<'routes' | 'pass' | 'livegps'>('routes');
  const [feesTab, setFeesTab] = useState<'dues' | 'pay' | 'history'>('dues');
  const [grievanceTab, setGrievanceTab] = useState<'submit' | 'track'>('submit');
  const [careerTab, setCareerTab] = useState<'drives' | 'applications' | 'resume'>('drives');

  // Search & filter states
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState('ALL');
  const [reservedBooks, setReservedBooks] = useState<string[]>([]);
  const [appliedDrives, setAppliedDrives] = useState<string[]>(['plc-1']);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Form states
  const [outpassReason, setOutpassReason] = useState('');
  const [outpassDestination, setOutpassDestination] = useState('');
  const [outpassDate, setOutpassDate] = useState('2026-08-28');
  const [outpassTime, setOutpassTime] = useState('17:30');
  const [outpassSubmitted, setOutpassSubmitted] = useState(false);

  const [certType, setCertType] = useState('Bonafide Certificate');
  const [certPurpose, setCertPurpose] = useState('Higher Studies / Passport Application');
  const [certDelivery, setCertDelivery] = useState('Digital e-Sanad & DigiLocker');
  const [certAppId, setCertAppId] = useState<string | null>(null);

  const [grievanceCategory, setGrievanceCategory] = useState<'ACADEMIC' | 'HOSTEL' | 'INFRASTRUCTURE' | 'TRANSPORT' | 'FINANCE' | 'GENERAL'>('ACADEMIC');
  const [grievanceSubject, setGrievanceSubject] = useState('');
  const [grievanceDescription, setGrievanceDescription] = useState('');
  const [grievanceAnonymous, setGrievanceAnonymous] = useState(false);

  const [selectedFeeHead, setSelectedFeeHead] = useState<'exam' | 'hostel' | 'all'>('all');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  if (!isOpen || !service) return null;

  const showNotificationToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleReserveBook = (bookId: string, title: string) => {
    if (reservedBooks.includes(bookId)) {
      setReservedBooks(reservedBooks.filter(id => id !== bookId));
      showNotificationToast(`Reservation cancelled for "${title}"`);
    } else {
      setReservedBooks([...reservedBooks, bookId]);
      showNotificationToast(`Book "${title}" reserved. Please collect within 24 hours from Circulation Desk.`);
    }
  };

  const handleApplyDrive = (driveId: string, company: string) => {
    if (appliedDrives.includes(driveId)) {
      showNotificationToast(`You have already applied for ${company}`);
    } else {
      setAppliedDrives([...appliedDrives, driveId]);
      showNotificationToast(`Application submitted successfully for ${company}! Hall ticket & test slot will be emailed.`);
    }
  };

  const handleOutpassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outpassReason.trim() || !outpassDestination.trim()) {
      alert('Please fill out all required out-pass fields.');
      return;
    }
    setOutpassSubmitted(true);
    showNotificationToast('Out-Pass request submitted! Instant notification dispatched to Warden & Parent for digital signoff.');
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `GRI-SANAD-${Math.floor(100000 + Math.random() * 900000)}`;
    setCertAppId(generatedId);
    setCertTab('track');
    showNotificationToast(`Application registered with ID ${generatedId}. Verified e-Sanad link generated.`);
  };

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceSubject.trim() || !grievanceDescription.trim()) {
      alert('Please provide both subject and description.');
      return;
    }

    try {
      await addGrievance({
        userId: currentUser.id,
        userName: grievanceAnonymous ? 'Anonymous Student' : currentUser.name,
        userRole: currentUser.role,
        category: grievanceCategory,
        subject: grievanceSubject,
        description: grievanceDescription,
        priority: 'MEDIUM',
      });
      setGrievanceSubject('');
      setGrievanceDescription('');
      setGrievanceTab('track');
      showNotificationToast('Samadhan Grievance ticket created. Assigned to Grievance Redressal Cell.');
    } catch (err) {
      console.warn('Grievance submission error:', err);
    }
  };

  const handlePayFees = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentCompleted(true);
      showNotificationToast('Payment of ₹6,050 successful! Official GRI e-Receipt generated with TXN_GRI_99218841.');
    }, 1200);
  };

  // Service configuration details
  const serviceConfigs: Record<ServiceType, { title: string; subtitle: string; icon: React.ReactNode; color: string; bg: string }> = {
    exam: {
      title: 'Examinations & Results',
      subtitle: 'Office of the Controller of Examinations (CoE)',
      icon: <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
    },
    library: {
      title: 'Library Catalog & E-Resources',
      subtitle: 'Central Library Dr. Radhakrishnan Memorial Wing',
      icon: <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
    },
    certificates: {
      title: 'Certificates & e-Sanad Portal',
      subtitle: 'Academic Section & DigiLocker Attestation',
      icon: <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
    },
    hostel: {
      title: 'Hostel & Campus Living',
      subtitle: 'Chief Warden Office & Digital Gate Pass',
      icon: <Building className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
    },
    transport: {
      title: 'Transport Schedule & Bus Pass',
      subtitle: 'University Transport Fleet & Live Tracking',
      icon: <Bus className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
    },
    fees: {
      title: 'Fee Payment & e-Receipts',
      subtitle: 'Finance & Accounts Branch (SBI e-Pay / UPI)',
      icon: <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800'
    },
    grievance: {
      title: 'Samadhan Grievance Redressal',
      subtitle: 'UGC Grievance Cell & Anti-Ragging Helpdesk',
      icon: <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
    },
    careers: {
      title: 'Placements & Careers Cell',
      subtitle: 'Center for Training, Placement & Career Guidance',
      icon: <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800'
    }
  };

  const currentConfig = serviceConfigs[service];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-850 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${currentConfig.bg}`}>
              {currentConfig.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{currentConfig.title}</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">{currentConfig.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action toast feedback */}
        {actionSuccessMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-200 dark:border-emerald-800 px-5 py-2.5 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* ======================================================== */}
          {/* 1. EXAMINATIONS & RESULTS */}
          {/* ======================================================== */}
          {service === 'exam' && (
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                  { id: 'results', label: 'Marks & CGPA' },
                  { id: 'hallticket', label: 'Hall Ticket' },
                  { id: 'timetable', label: 'Timetable' },
                  { id: 'revaluation', label: 'Revaluation' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setExamTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      examTab === t.id
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {examTab === 'results' && (
                <div className="space-y-4">
                  {/* Summary Metric Card */}
                  <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 bg-blue-800/60 px-2.5 py-0.5 rounded-md">
                          Semester V (Nov/Dec 2025 ESE)
                        </span>
                        <h4 className="text-xl font-bold mt-1">{currentUser.name}</h4>
                        <p className="text-xs text-blue-200">{currentUser.regNumber || '2024GRI1042'} • {currentUser.department}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-blue-300 font-medium">SGPA</span>
                        <div className="text-3xl font-black text-white">{currentUser.cgpa || 8.84}</div>
                        <span className="text-[10px] text-emerald-300 font-semibold">Status: Passed (1st Class)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-800/60 text-center text-xs">
                      <div>
                        <span className="text-blue-300 text-[10px]">Credits Earned</span>
                        <p className="font-bold text-white">24 / 24</p>
                      </div>
                      <div>
                        <span className="text-blue-300 text-[10px]">Cumulative CGPA</span>
                        <p className="font-bold text-white">8.72</p>
                      </div>
                      <div>
                        <span className="text-blue-300 text-[10px]">Dept Rank</span>
                        <p className="font-bold text-emerald-400">#03 of 58</p>
                      </div>
                    </div>
                  </div>

                  {/* Subject breakdown table */}
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">Subject Breakdown</span>
                      <span className="text-[11px] text-gray-500 dark:text-slate-400">CBCS Grading</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
                      {[
                        { code: 'MCA-401', name: 'Cloud Computing & Distributed Systems', credits: 4, cia: '23/25', ese: '68/75', total: 91, grade: 'O', status: 'Pass' },
                        { code: 'MCA-402', name: 'Deep Learning & Applied Neural Networks', credits: 4, cia: '22/25', ese: '65/75', total: 87, grade: 'A+', status: 'Pass' },
                        { code: 'MCA-403', name: 'Network Security & Cryptography', credits: 3, cia: '24/25', ese: '62/75', total: 86, grade: 'A+', status: 'Pass' },
                        { code: 'MCA-404', name: 'Major Project Dissertation', credits: 8, cia: '48/50', ese: '46/50', total: 94, grade: 'O', status: 'Pass' },
                        { code: 'EXT-102', name: 'Nai Talim: Rural Community Practicum', credits: 2, cia: '24/25', ese: '23/25', total: 47, grade: 'O', status: 'Pass' },
                      ].map((sub, i) => (
                        <div key={i} className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/40">
                          <div className="flex-1 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">{sub.code}</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{sub.name}</span>
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                              Credits: {sub.credits} • CIA: {sub.cia} • ESE: {sub.ese} • Total: {sub.total}/100
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              {sub.grade}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => showNotificationToast('Downloading Official Digital Marksheet (PDF) with Controller of Examinations QR signature...')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Semester Statement of Marks (PDF)</span>
                  </button>
                </div>
              )}

              {examTab === 'hallticket' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl p-5 bg-gray-50/50 dark:bg-slate-800/30">
                    <div className="text-center pb-4 border-b border-gray-200 dark:border-slate-700">
                      <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">THE GANDHIGRAM RURAL INSTITUTE</p>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">End Semester Examinations (ESE) Hall Ticket</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">May / June 2026 Regular Sessions</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-4 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Candidate Name</span>
                        <p className="font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Register Number</span>
                        <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{currentUser.regNumber || '2024GRI1042'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Centre Code</span>
                        <p className="font-semibold text-gray-900 dark:text-white">01 - Main Academic Block</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Attendance Eligibility</span>
                        <p className="font-bold text-emerald-600">88.4% (Eligible)</p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-gray-800 dark:text-slate-200" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">AES-256 CoE QR Token</p>
                          <p className="text-[10px] text-gray-500">Scan at entrance for biometric verification</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showNotificationToast('Generating Hall Ticket PDF...');
                      window.print();
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save Hall Ticket (PDF)</span>
                  </button>
                </div>
              )}

              {examTab === 'timetable' && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Upcoming ESE Examination Schedule</span>
                    <span className="text-blue-600 font-bold">{EXAM_SCHEDULE_MOCK.length} Papers Scheduled</span>
                  </div>

                  <div className="space-y-2">
                    {EXAM_SCHEDULE_MOCK.map((ex, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-600 text-xs">{ex.courseCode}</span>
                            <span className="font-bold text-xs text-gray-900 dark:text-white">{ex.subjectTitle}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                              <Calendar className="w-3 h-3" /> {ex.examDate}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {ex.session}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {ex.hall}
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                          {ex.degree}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {examTab === 'revaluation' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-bold">Revaluation & Paper Photocopy Guidelines</p>
                    <p className="text-[11px]">Fee for Revaluation: ₹500 per paper • Fee for Photocopy: ₹300 per paper. Applications accepted within 10 days of results declaration.</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Select Course Subject</label>
                      <select className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
                        <option>MCA-402 - Deep Learning & Applied Neural Networks (Grade: A+)</option>
                        <option>MCA-403 - Network Security & Cryptography (Grade: A+)</option>
                        <option>MCA-401 - Cloud Computing & Distributed Systems (Grade: O)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Request Service Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="p-3 rounded-xl border border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="revType" defaultChecked />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">Revaluation</p>
                            <p className="text-[10px] text-gray-500">₹500 / course</p>
                          </div>
                        </label>
                        <label className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="revType" />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">Answer Photocopy</p>
                            <p className="text-[10px] text-gray-500">₹300 / course</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => showNotificationToast('Revaluation application submitted! Token #REV-2026-8819 generated. Proceed to Fee Payment tab to clear the challan.')}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                    >
                      Submit Revaluation Request (₹500)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. LIBRARY CATALOG */}
          {/* ======================================================== */}
          {service === 'library' && (
            <div className="space-y-5">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                  { id: 'catalog', label: 'Search 180,000+ Books' },
                  { id: 'borrowed', label: 'My Loans (2)' },
                  { id: 'eresources', label: 'E-Journals & UGC' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLibraryTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      libraryTab === t.id
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {libraryTab === 'catalog' && (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search title, author, ISBN, or call number..."
                      value={librarySearch}
                      onChange={(e) => setLibrarySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Book list */}
                  <div className="space-y-3">
                    {LIBRARY_CATALOG_MOCK.filter(b => 
                      !librarySearch || 
                      b.title.toLowerCase().includes(librarySearch.toLowerCase()) || 
                      b.author.toLowerCase().includes(librarySearch.toLowerCase()) ||
                      b.category.toLowerCase().includes(librarySearch.toLowerCase())
                    ).map((book) => {
                      const isReserved = reservedBooks.includes(book.id);
                      return (
                        <div key={book.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                                {book.category}
                              </span>
                              <span className="text-[11px] font-mono text-gray-400">Call: {book.callNumber}</span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">{book.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Author: <span className="font-semibold text-gray-700 dark:text-slate-300">{book.author}</span></p>
                            <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-purple-500" /> {book.location}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
                            <span className="text-xs font-semibold text-emerald-600">
                              {book.copiesAvailable} of {book.totalCopies} Available
                            </span>
                            <button
                              onClick={() => handleReserveBook(book.id, book.title)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isReserved 
                                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/20'
                              }`}
                            >
                              {isReserved ? 'Cancel Hold' : 'Reserve Book'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {libraryTab === 'borrowed' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <p className="font-bold">Active Member: {currentUser.name} (ID: {currentUser.regNumber || '2024GRI1042'})</p>
                    <p className="text-[11px]">Maximum quota: 4 Books • Overdue Fine Balance: ₹0.00</p>
                  </div>

                  {[
                    { title: 'An Autobiography: My Experiments with Truth', author: 'M.K. Gandhi', borrowedDate: '2026-08-15', dueDate: '2026-09-14', barcode: 'GRI-LIB-88910', daysLeft: 18 },
                    { title: 'Deep Learning with Python & PyTorch', author: 'Francois Chollet', borrowedDate: '2026-08-20', dueDate: '2026-09-19', barcode: 'GRI-LIB-44102', daysLeft: 23 },
                  ].map((loan, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{loan.title}</h4>
                        <p className="text-gray-500 text-xs mt-0.5">{loan.author} • Barcode: {loan.barcode}</p>
                        <div className="mt-1 text-[11px] text-gray-400">
                          Due Date: <span className="font-bold text-purple-600">{loan.dueDate}</span> ({loan.daysLeft} days remaining)
                        </div>
                      </div>
                      <button
                        onClick={() => showNotificationToast(`Loan renewed for 14 additional days. New Due Date: 2026-10-03.`)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 font-bold text-xs text-gray-800 dark:text-slate-200"
                      >
                        Renew Loan
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {libraryTab === 'eresources' && (
                <div className="space-y-3 text-xs">
                  <p className="text-gray-500 dark:text-slate-400">High-speed IP-authenticated access to national research repositories:</p>
                  {[
                    { name: 'INFLIBNET e-ShodhSindhu', desc: '10,000+ peer-reviewed e-journals and academic publications', url: 'https://ess.inflibnet.ac.in' },
                    { name: 'Shodhganga Ph.D. Repository', desc: '400,000+ full-text Indian doctoral dissertations', url: 'https://shodhganga.inflibnet.ac.in' },
                    { name: 'IEEE Xplore Digital Library', desc: 'Computer science, electronics & power engineering journals', url: 'https://ieeexplore.ieee.org' },
                    { name: 'National Digital Library of India (NDLI)', desc: 'Learning resources for all academic disciplines', url: 'https://ndl.iitkgp.ac.in' },
                  ].map((res, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{res.name}</h4>
                        <p className="text-gray-500 text-xs mt-0.5">{res.desc}</p>
                      </div>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-xl hover:bg-purple-100 shrink-0 ml-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. CERTIFICATES (e-SANAD) */}
          {/* ======================================================== */}
          {service === 'certificates' && (
            <div className="space-y-5">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                  { id: 'apply', label: 'Apply for Certificate' },
                  { id: 'track', label: 'Track Applications (1)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCertTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      certTab === t.id
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {certTab === 'apply' && (
                <form onSubmit={handleCertSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Select Certificate Type</label>
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option>Bonafide Certificate (Student Status)</option>
                      <option>Medium of Instruction Certificate (English)</option>
                      <option>Course Completion Certificate</option>
                      <option>Conduct & Character Certificate</option>
                      <option>Transfer Certificate (TC)</option>
                      <option>Consolidated Grade Transcript (Official)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Purpose of Application</label>
                    <input
                      type="text"
                      value={certPurpose}
                      onChange={(e) => setCertPurpose(e.target.value)}
                      placeholder="e.g. Higher Education, Passport, Education Loan, Visa"
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Delivery / Attestation Channel</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="p-3 rounded-xl border border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="certDel" 
                          checked={certDelivery === 'Digital e-Sanad & DigiLocker'}
                          onChange={() => setCertDelivery('Digital e-Sanad & DigiLocker')}
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">e-Sanad & DigiLocker</p>
                          <p className="text-[10px] text-gray-500">Instant PDF (Signed)</p>
                        </div>
                      </label>
                      <label className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="certDel"
                          checked={certDelivery === 'Physical Counter Pickup'}
                          onChange={() => setCertDelivery('Physical Counter Pickup')}
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Counter Pickup</p>
                          <p className="text-[10px] text-gray-500">Dean Office (2 Days)</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300">
                    <p className="font-semibold">Candidate: <span className="text-gray-900 dark:text-white font-bold">{currentUser.name}</span></p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Register No: {currentUser.regNumber || '2024GRI1042'} • Department: {currentUser.department}</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    Submit Certificate Application (Free)
                  </button>
                </form>
              )}

              {certTab === 'track' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-emerald-600 text-xs">
                        {certAppId || 'GRI-SANAD-884910'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                        DIGITALLY SIGNED
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Bonafide Certificate (Academic 2026-27)</h4>
                      <p className="text-gray-500 text-[11px] mt-0.5">Applied: Aug 26, 2026 • Purpose: Passport & Visa Verification</p>
                    </div>

                    {/* Stepper */}
                    <div className="pt-2 border-t border-gray-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 1. Application Submitted & Verified
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 2. Head of Department Approved
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 3. Registrar e-Signature Affixed
                      </div>
                    </div>

                    <button
                      onClick={() => showNotificationToast('Downloading Verified Bonafide Certificate PDF with Ministry of Education QR code...')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 mt-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download e-Signed Certificate (PDF)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. HOSTEL & CAMPUS LIVING */}
          {/* ======================================================== */}
          {service === 'hostel' && (
            <div className="space-y-5">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                  { id: 'outpass', label: 'Digital Out-Pass' },
                  { id: 'room', label: 'Room & Warden' },
                  { id: 'mess', label: 'Mess Menu' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setHostelTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      hostelTab === t.id
                        ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {hostelTab === 'outpass' && (
                <div className="space-y-4">
                  {/* Gate Security QR Pass */}
                  <div className="bg-gradient-to-br from-rose-900 to-slate-900 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300 bg-rose-800/80 px-2 py-0.5 rounded">
                          GRI HOSTEL DIGITAL GATE PASS
                        </span>
                        <h4 className="text-base font-bold mt-1.5">{currentUser.name}</h4>
                        <p className="text-xs text-rose-200">{currentUser.hostelBlock || 'Kaveri Block'} • Room {currentUser.roomNo || '204'}</p>
                      </div>
                      <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center">
                        <QrCode className="w-14 h-14 text-slate-900" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-rose-800/60 text-xs">
                      <div>
                        <span className="text-rose-300 text-[10px]">Pass Status</span>
                        <p className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Warden
                        </p>
                      </div>
                      <div>
                        <span className="text-rose-300 text-[10px]">Valid Until</span>
                        <p className="font-bold text-white">Aug 30, 2026 (08:30 PM)</p>
                      </div>
                    </div>
                  </div>

                  {/* New Outpass Request Form */}
                  <form onSubmit={handleOutpassSubmit} className="space-y-3 text-xs bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-gray-900 dark:text-white">Request New Leave / Out-Pass</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-gray-600 dark:text-slate-300 block mb-1">Departure Date</label>
                        <input
                          type="date"
                          value={outpassDate}
                          onChange={(e) => setOutpassDate(e.target.value)}
                          className="w-full p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-600 dark:text-slate-300 block mb-1">Departure Time</label>
                        <input
                          type="time"
                          value={outpassTime}
                          onChange={(e) => setOutpassTime(e.target.value)}
                          className="w-full p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-gray-600 dark:text-slate-300 block mb-1">Destination Address / Home Town</label>
                      <input
                        type="text"
                        placeholder="e.g. Madurai, Anna Nagar / Native Town"
                        value={outpassDestination}
                        onChange={(e) => setOutpassDestination(e.target.value)}
                        className="w-full p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-600 dark:text-slate-300 block mb-1">Reason for Leave</label>
                      <input
                        type="text"
                        placeholder="e.g. Family Function / Medical Appointment / Weekend Visit"
                        value={outpassReason}
                        onChange={(e) => setOutpassReason(e.target.value)}
                        className="w-full p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm shadow-rose-600/20"
                    >
                      Submit Out-Pass Request
                    </button>
                  </form>
                </div>
              )}

              {hostelTab === 'room' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Resident Allocation Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-gray-600 dark:text-slate-300">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Hostel Block</span>
                        <p className="font-bold text-gray-900 dark:text-white">Kaveri Men's Hostel (Block B)</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Room Number</span>
                        <p className="font-bold text-gray-900 dark:text-white">Room 204 (Bed 2)</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Resident Warden</span>
                        <p className="font-bold text-gray-900 dark:text-white">Dr. M. Senthilvel</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Caretaker Contact</span>
                        <p className="font-bold text-rose-600">+91 94421 88301</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hostelTab === 'mess' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
                    Pure Vegetarian Dining Hall • Timings: BF (7:30 - 9:00 AM) • Lunch (12:30 - 2:00 PM) • Dinner (7:30 - 9:00 PM)
                  </div>
                  <div className="space-y-2">
                    {[
                      { day: 'Monday', menu: 'Idli, Sambar, Coconut Chutney | Meals, Sambar, Poriyal, Curd | Chappathi, Dal, Rice' },
                      { day: 'Tuesday', menu: 'Pongal, Vada, Chutney | Variety Rice (Lemon/Tomato), Appalam | Poori, Potato Masala' },
                      { day: 'Wednesday', menu: 'Dosa, Tomato Chutney | Full Meals, Karakuzhambu, Kootu | Veg Biryani, Raitha' },
                      { day: 'Thursday', menu: 'Rava Kichadi, Sambar | Sambar Rice, Potato Fry, Curd | Chappathi, Paneer Butter' },
                      { day: 'Friday', menu: 'Poori, Chenna Masala | Special Feast Meals, Payasam | Idiyappam, Coconut Milk' },
                    ].map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                        <span className="font-bold text-rose-600">{m.day}</span>
                        <p className="text-gray-600 dark:text-slate-300 text-[11px] mt-0.5">{m.menu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. TRANSPORT SCHEDULE */}
          {/* ======================================================== */}
          {service === 'transport' && (
            <div className="space-y-5">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                  { id: 'routes', label: 'Bus Routes (6)' },
                  { id: 'pass', label: 'My Bus Pass' },
                  { id: 'livegps', label: 'Live GPS' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTransportTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      transportTab === t.id
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {transportTab === 'routes' && (
                <div className="space-y-3 text-xs">
                  {[
                    { no: 'Route 1 (Madurai)', name: 'Periyar Bus Stand → Mattuthavani → GRI Campus', dep: '07:15 AM', bus: 'TN-57-N-2018', driver: 'M. Karuppasamy (+91 98421 11201)' },
                    { no: 'Route 2 (Dindigul)', name: 'Dindigul Bus Stand → Collectorate → Ambathurai → GRI', dep: '08:00 AM', bus: 'TN-57-N-2022', driver: 'S. Murugesan (+91 94431 33402)' },
                    { no: 'Route 3 (Chinnalapatti)', name: 'Chinnalapatti Main → Gandhigram Rural Gate', dep: '08:20 AM', bus: 'TN-57-N-2025', driver: 'K. Rajendran (+91 98942 55603)' },
                    { no: 'Route 4 (Batlagundu)', name: 'Batlagundu Stand → Nilakottai → GRI Campus', dep: '07:30 AM', bus: 'TN-57-N-2030', driver: 'T. Ganesan (+91 97861 77804)' },
                  ].map((rt, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">{rt.no}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                          Departure: {rt.dep}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs">{rt.name}</p>
                      <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-gray-100 dark:border-slate-800">
                        <span>Bus No: {rt.bus}</span>
                        <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-slate-300">
                          <Phone className="w-3 h-3 text-amber-500" /> {rt.driver}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {transportTab === 'pass' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-amber-600 to-amber-900 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200 bg-amber-800/80 px-2 py-0.5 rounded">
                          SEMESTER BUS PASS 2026-27
                        </span>
                        <h4 className="text-base font-bold mt-1.5">{currentUser.name}</h4>
                        <p className="text-xs text-amber-100">Route 2: Dindigul Central → GRI</p>
                      </div>
                      <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center">
                        <QrCode className="w-14 h-14 text-slate-900" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-500/60 text-xs">
                      <div>
                        <span className="text-amber-200 text-[10px]">Pass Status</span>
                        <p className="font-bold text-white">Active & Paid (₹3,200)</p>
                      </div>
                      <div>
                        <span className="text-amber-200 text-[10px]">Valid Thru</span>
                        <p className="font-bold text-white">Dec 31, 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {transportTab === 'livegps' && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-bold text-gray-900 dark:text-white">Route 2 (TN-57-N-2022) Live Track</span>
                    </div>
                    <span className="text-emerald-600 font-bold">Speed: 42 km/h</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl space-y-1">
                    <p className="text-gray-700 dark:text-slate-300 font-medium">Current Location: <span className="font-bold">Ambathurai Toll Gate Junction</span></p>
                    <p className="text-gray-500 text-[11px]">Next Stop: University Main Entrance Arch • Distance: 2.1 km • ETA: 6 Mins</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. FEE PAYMENT */}
          {/* ======================================================== */}
          {service === 'fees' && (
            <div className="space-y-5">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                  { id: 'dues', label: 'Fee Dues (₹6,050)' },
                  { id: 'pay', label: 'Instant Pay' },
                  { id: 'history', label: 'Receipt History' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFeesTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      feesTab === t.id
                        ? 'bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {feesTab === 'dues' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">Semester VI Academic Dues</h4>
                        <p className="text-gray-500 text-[11px]">Due Date: September 15, 2026</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Total Due</span>
                        <div className="text-lg font-black text-rose-600">₹6,050</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800">
                        <span className="text-gray-600 dark:text-slate-400">Tuition & Development Fee</span>
                        <span className="font-bold text-emerald-600">₹18,500 (PAID)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800">
                        <span className="text-gray-600 dark:text-slate-400">Special Computing Lab Fee</span>
                        <span className="font-bold text-emerald-600">₹3,500 (PAID)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800">
                        <span className="text-gray-900 dark:text-white font-semibold">End Semester Exam (ESE) Fee</span>
                        <span className="font-bold text-rose-600">₹1,850 (PENDING)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-900 dark:text-white font-semibold">Hostel & Mess Maintenance Due</span>
                        <span className="font-bold text-rose-600">₹4,200 (PENDING)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setFeesTab('pay')}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-green-600/20"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed to Pay Dues (₹6,050)</span>
                  </button>
                </div>
              )}

              {feesTab === 'pay' && (
                <div className="space-y-4 text-xs">
                  {paymentCompleted ? (
                    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-200">Payment Successful!</h4>
                      <p className="text-emerald-700 dark:text-emerald-300 text-xs">
                        Transaction ID: <span className="font-mono font-bold">TXN_GRI_99218841</span> • Amount: ₹6,050
                      </p>
                      <button
                        onClick={() => showNotificationToast('Downloading Official Tax Invoice & Fee Receipt (PDF)...')}
                        className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 mx-auto"
                      >
                        <Download className="w-4 h-4" /> Download Receipt (PDF)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 space-y-2">
                        <div className="flex justify-between font-bold text-sm">
                          <span>Amount to Pay</span>
                          <span className="text-green-600">₹6,050.00</span>
                        </div>
                        <p className="text-[11px] text-gray-500">Student: {currentUser.name} (Roll: {currentUser.regNumber || '2024GRI1042'})</p>
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 dark:text-slate-300 block mb-2">Select Payment Method</label>
                        <div className="space-y-2">
                          {[
                            { name: 'Instant UPI (Google Pay, PhonePe, Paytm, BHIM)', icon: 'UPI' },
                            { name: 'State Bank of India (SBI) Multi Option Payment (MOPS)', icon: 'NetBanking' },
                            { name: 'Debit Card / Credit Card (Visa, RuPay, Mastercard)', icon: 'Card' },
                          ].map((mode, i) => (
                            <label key={i} className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                              <input type="radio" name="paymode" defaultChecked={i === 0} />
                              <span className="font-semibold text-gray-900 dark:text-white text-xs">{mode.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handlePayFees}
                        disabled={paymentProcessing}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-green-600/20 cursor-pointer"
                      >
                        {paymentProcessing ? (
                          <span>Connecting to Bank Gateway...</span>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>Pay ₹6,050 Securely</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {feesTab === 'history' && (
                <div className="space-y-3 text-xs">
                  {[
                    { id: 'REC-2026-081', desc: 'Semester V Tuition & Exam Fee', date: '2026-02-10', amount: '₹22,000', mode: 'SBI NetBanking' },
                    { id: 'REC-2025-442', desc: 'Hostel kaveri Annual Room Fee', date: '2025-08-01', amount: '₹14,500', mode: 'UPI / PhonePe' },
                  ].map((rec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-green-600 text-xs">{rec.id}</span>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xs mt-0.5">{rec.desc}</h4>
                        <p className="text-gray-400 text-[11px] mt-0.5">Paid: {rec.date} • {rec.mode}</p>
                      </div>
                      <button
                        onClick={() => showNotificationToast(`Downloading Official Receipt ${rec.id} (PDF)...`)}
                        className="p-2 bg-gray-100 dark:bg-slate-800 rounded-xl hover:bg-gray-200 text-gray-700 dark:text-slate-300"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 7. GRIEVANCES (SAMADHAN) */}
          {/* ======================================================== */}
          {service === 'grievance' && (
            <div className="space-y-5">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                  { id: 'submit', label: 'Submit Ticket' },
                  { id: 'track', label: `My Tickets (${grievances.length})` },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setGrievanceTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      grievanceTab === t.id
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {grievanceTab === 'submit' && (
                <form onSubmit={handleGrievanceSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Grievance Category</label>
                    <select
                      value={grievanceCategory}
                      onChange={(e) => setGrievanceCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="ACADEMIC">Academic & Examination</option>
                      <option value="HOSTEL">Hostel & Mess Amenities</option>
                      <option value="INFRASTRUCTURE">Campus Infrastructure & WiFi</option>
                      <option value="TRANSPORT">University Bus & Transport</option>
                      <option value="FINANCE">Fee, Scholarship & NSP</option>
                      <option value="GENERAL">General Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Subject / Summary</label>
                    <input
                      type="text"
                      placeholder="Brief headline of grievance"
                      value={grievanceSubject}
                      onChange={(e) => setGrievanceSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      placeholder="Explain the issue with relevant dates, department, or location..."
                      value={grievanceDescription}
                      onChange={(e) => setGrievanceDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={grievanceAnonymous}
                      onChange={(e) => setGrievanceAnonymous(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-600 dark:text-slate-300 text-xs">Submit confidentially / hide my identity from department</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-600/20"
                  >
                    Submit to Samadhan Redressal Cell
                  </button>
                </form>
              )}

              {grievanceTab === 'track' && (
                <div className="space-y-3 text-xs">
                  {grievances.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No active grievance tickets.</div>
                  ) : (
                    grievances.map((tk) => (
                      <div key={tk.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-indigo-600 text-xs">#{tk.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            tk.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                            tk.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {tk.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xs">{tk.subject}</h4>
                        <p className="text-gray-500 text-[11px] line-clamp-2">{tk.description}</p>
                        {tk.response && (
                          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-[11px] text-gray-700 dark:text-slate-300 mt-2 border-l-2 border-indigo-500">
                            <span className="font-bold block">Authority Resolution:</span>
                            {tk.response}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 8. PLACEMENTS & CAREERS */}
          {/* ======================================================== */}
          {service === 'careers' && (
            <div className="space-y-5">
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                  { id: 'drives', label: 'Active Drives (3)' },
                  { id: 'applications', label: `My Applications (${appliedDrives.length})` },
                  { id: 'resume', label: 'Resume Profile' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCareerTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      careerTab === t.id
                        ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {careerTab === 'drives' && (
                <div className="space-y-3 text-xs">
                  {INITIAL_PLACEMENTS.map((drive) => {
                    const isApplied = appliedDrives.includes(drive.id);
                    return (
                      <div key={drive.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded">
                              CTC: {drive.ctc}
                            </span>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{drive.companyName}</h4>
                            <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">{drive.role}</p>
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium">Drive: {drive.driveDate}</span>
                        </div>

                        <p className="text-gray-500 text-[11px]">{drive.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
                          <span className="text-[10px] text-gray-400">Min CGPA: {drive.minCgpa} • Deadline: {drive.deadline}</span>
                          <button
                            onClick={() => handleApplyDrive(drive.id, drive.companyName)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                              isApplied
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm shadow-orange-600/20'
                            }`}
                          >
                            {isApplied ? 'Applied ✓' : 'Apply Now'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {careerTab === 'applications' && (
                <div className="space-y-3 text-xs">
                  {appliedDrives.map((dId) => {
                    const dr = INITIAL_PLACEMENTS.find(p => p.id === dId) || INITIAL_PLACEMENTS[0];
                    return (
                      <div key={dId} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{dr.companyName}</h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                            Aptitude Test Slot Scheduled
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Role: {dr.role} • Package: {dr.ctc}</p>
                        <p className="text-[11px] text-gray-400">Next Stage: Online Assessment on Sept 12, 2026 (10:00 AM)</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {careerTab === 'resume' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-orange-950 text-white space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-orange-300">Verified Placement Profile</span>
                        <h4 className="text-base font-bold mt-1">{currentUser.name}</h4>
                        <p className="text-xs text-slate-300">{currentUser.department}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-orange-300">Placement Score</span>
                        <p className="text-2xl font-black">88 / 100</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotificationToast('Exporting Verified GRI Placement CV (PDF) with Dean endorsement seal...')}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Official GRI Placement CV (PDF)</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
