import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  EXAM_SCHEDULE_MOCK, 
  LIBRARY_CATALOG_MOCK, 
  TENDERS_MOCK, 
  CAREERS_MOCK 
} from '../../core/data/griMasterData';
import { 
  Layers, 
  Calendar, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Briefcase, 
  Download, 
  Printer, 
  Search, 
  CheckCircle2, 
  Clock, 
  Send,
  Building,
  ShieldCheck,
  Users
} from 'lucide-react';
import { ExamHallTicketModal } from './ExamHallTicketModal';

export const ServicesView: React.FC = () => {
  const { currentUser, grievances, addGrievance } = useAppStore();
  const [activeTab, setActiveTab] = useState<'exam' | 'admissions' | 'library' | 'grievance' | 'tenders'>('exam');
  const [isHallTicketOpen, setIsHallTicketOpen] = useState(false);
  
  // Library search state
  const [libraryQuery, setLibraryQuery] = useState('');
  
  // Grievance form state
  const [grievanceCategory, setGrievanceCategory] = useState('Academic');
  const [grievanceSubject, setGrievanceSubject] = useState('');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [grievanceSubmittedMsg, setGrievanceSubmittedMsg] = useState(false);

  const filteredBooks = LIBRARY_CATALOG_MOCK.filter(b => 
    b.title.toLowerCase().includes(libraryQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(libraryQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(libraryQuery.toLowerCase()) ||
    b.callNumber.toLowerCase().includes(libraryQuery.toLowerCase())
  );

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceSubject || !grievanceDesc) return;
    addGrievance({
      category: grievanceCategory,
      subject: grievanceSubject,
      description: grievanceDesc,
      submittedBy: `${currentUser.name} (${currentUser.regNumber || currentUser.id})`,
      role: currentUser.role,
    });
    setGrievanceSubject('');
    setGrievanceDesc('');
    setGrievanceSubmittedMsg(true);
    setTimeout(() => setGrievanceSubmittedMsg(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>University Portal Services</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Student, Examination & Administrative Hub
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Direct digital services for End-Semester Examinations (ESE), official Hall Ticket generation, Library OPAC, Grievance Redressal (Samadhan), and Admission fees.
        </p>
      </div>

      {/* Services Nav Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'exam', label: 'ESE Examination & Timetable', icon: <Calendar className="w-4 h-4" /> },
          { id: 'admissions', label: 'Admissions 2026-27 & Fees', icon: <FileText className="w-4 h-4" /> },
          { id: 'library', label: 'Central Library OPAC', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'grievance', label: 'Grievance Redressal (Samadhan)', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'tenders', label: 'Tenders & Careers', icon: <Briefcase className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: ESE Examination Portal */}
      {activeTab === 'exam' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Nov/Dec 2026 ESE
                </span>
                <h3 className="font-bold text-white text-base mt-2">Download Hall Ticket</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Admit card with verified course codes, exam centre allocation and candidate photo barcode.
                </p>
              </div>
              <button
                onClick={() => setIsHallTicketOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Generate Official Hall Ticket</span>
              </button>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Continuous Assessment
                </span>
                <h3 className="font-bold text-white text-base mt-2">Internal CIA Marks</h3>
                <p className="text-xs text-slate-400 mt-1">
                  View CIA-1, CIA-2, Seminar & Assignment continuous internal assessment gradebook.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>CIA Status: <strong className="text-emerald-400">Locked & Approved</strong></span>
                <span className="text-[11px] text-slate-500">Max: 40/40</span>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  Government Verification
                </span>
                <h3 className="font-bold text-white text-base mt-2">e-Sanad & Transcripts</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ministry of External Affairs online contactless document apostille and degree verification.
                </p>
              </div>
              <button
                onClick={() => alert('e-Sanad portal integration active. Request token: E-SANAD-GRI-2026')}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Verify with e-Sanad API</span>
              </button>
            </div>
          </div>

          {/* Timetable Schedule Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Official End Semester Examination (ESE) Timetable
                </h3>
                <p className="text-xs text-slate-400">Notified by Office of the Controller of Examinations</p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                Session: Nov/Dec 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="p-3.5">Course Code</th>
                    <th className="p-3.5">Subject Title</th>
                    <th className="p-3.5">Degree & Sem</th>
                    <th className="p-3.5">Exam Date</th>
                    <th className="p-3.5">Session</th>
                    <th className="p-3.5">Hall No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {EXAM_SCHEDULE_MOCK.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono font-bold text-emerald-400">{item.courseCode}</td>
                      <td className="p-3.5 font-semibold text-white">{item.subjectTitle}</td>
                      <td className="p-3.5">{item.degree} (Sem {item.semester})</td>
                      <td className="p-3.5 font-bold text-slate-100">{item.examDate}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.session.startsWith('FN') ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}>
                          {item.session}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-400">{item.hall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Admissions & Fees */}
      {activeTab === 'admissions' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                Academic Year 2026-2027
              </span>
              <h2 className="text-xl font-bold font-display text-white">
                Admissions to UG, PG, B.Voc, Diplomas & Ph.D.
              </h2>
              <p className="text-xs text-slate-300">
                Admissions strictly conducted via CUET (Common University Entrance Test) scores and GRI Institutional Merit Quota.
              </p>
            </div>
            <a
              href="#apply"
              onClick={(e) => {
                e.preventDefault();
                alert('Samarth Admission Portal active: https://griadmission.samarth.edu.in');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition flex-shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Samarth Application Portal</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm uppercase text-emerald-400">UG Programmes</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>B.Sc. (Hons) Agriculture</span>
                  <strong className="text-white">₹22,500/sem</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>B.Sc. Computer Science</span>
                  <strong className="text-white">₹12,000/sem</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>B.Sc. Chemistry / Physics</span>
                  <strong className="text-white">₹11,000/sem</strong>
                </li>
                <li className="flex justify-between">
                  <span>B.A. Tamil / Rural Studies</span>
                  <strong className="text-white">₹5,000/sem</strong>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm uppercase text-sky-400">PG Programmes</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>MCA (Master of Computer Apps)</span>
                  <strong className="text-white">₹24,000/sem</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>MBA (Rural Management)</span>
                  <strong className="text-white">₹32,000/sem</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>M.Sc. Agriculture (Agronomy)</span>
                  <strong className="text-white">₹18,000/sem</strong>
                </li>
                <li className="flex justify-between">
                  <span>M.A. Gandhian Thought & Peace</span>
                  <strong className="text-white">₹7,500/sem</strong>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm uppercase text-purple-400">Doctoral & Diplomas</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Ph.D. in Sciences & Tech</span>
                  <strong className="text-white">₹14,000/sem</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Ph.D. in Social Sciences / Arts</span>
                  <strong className="text-white">₹8,000/sem</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Diploma in Nursery Mgmt</span>
                  <strong className="text-white">₹8,000/sem</strong>
                </li>
                <li className="flex justify-between">
                  <span>Certificate in Shanti Sena</span>
                  <strong className="text-white">₹2,500/course</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Central Library OPAC */}
      {activeTab === 'library' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search bar */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <input
              type="text"
              value={libraryQuery}
              onChange={(e) => setLibraryQuery(e.target.value)}
              placeholder="Search library catalog by Book Title, Author, Dewey Decimal Call Number, or Subject..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
            {libraryQuery && (
              <button onClick={() => setLibraryQuery('')} className="text-xs text-slate-400 hover:text-white">
                Clear
              </button>
            )}
          </div>

          {/* Book Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {book.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    book.copiesAvailable > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}>
                    {book.copiesAvailable > 0 ? `${book.copiesAvailable}/${book.totalCopies} Available` : 'All Issued'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Author: {book.author}</p>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between">
                    <span>Call Number:</span>
                    <strong className="font-mono text-slate-200">{book.callNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-slate-300 truncate max-w-[150px]">{book.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Hold request placed for "${book.title}". Reserved for 48 hours.`)}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Reserve Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Grievance Redressal (Samadhan) */}
      {activeTab === 'grievance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* Submit new ticket form */}
          <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base font-display">
                Submit Redressal Ticket (Samadhan)
              </h3>
              <p className="text-xs text-slate-400">
                Official grievance tracking with direct escalation to Registrar and Grievance Cell.
              </p>
            </div>

            {grievanceSubmittedMsg && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Ticket submitted successfully! Assigned for verification.</span>
              </div>
            )}

            <form onSubmit={handleGrievanceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Category</label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                >
                  <option value="Academic">Academic & Marks Evaluation</option>
                  <option value="Hostel & Mess">Hostel, Wi-Fi & Mess Food</option>
                  <option value="Scholarship & Fees">Scholarship & Fee Concessions</option>
                  <option value="Harassment / Anti-Ragging">Anti-Ragging / Internal Complaints (ICC)</option>
                  <option value="Transport & Infrastructure">Campus Bus & Classroom Facilities</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject Title</label>
                <input
                  type="text"
                  value={grievanceSubject}
                  onChange={(e) => setGrievanceSubject(e.target.value)}
                  placeholder="e.g., Request for CIA re-totalling in MCA-401"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Detailed Description</label>
                <textarea
                  value={grievanceDesc}
                  onChange={(e) => setGrievanceDesc(e.target.value)}
                  rows={4}
                  placeholder="Provide precise details, semester, subject code, and faculty reference..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance to Cell</span>
              </button>
            </form>
          </div>

          {/* List of submitted tickets */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-display">
                Your Grievance Tracker ({grievances.length})
              </h3>
              <span className="text-xs text-slate-400">Response SLA: 48–72 working hours</span>
            </div>

            <div className="space-y-3">
              {grievances.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400">{ticket.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {ticket.category}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ticket.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      ticket.status === 'UNDER_REVIEW' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white">{ticket.subject}</h4>
                  <p className="text-xs text-slate-400">{ticket.description}</p>

                  {ticket.response && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-emerald-900/50 text-xs text-emerald-300 space-y-0.5">
                      <span className="text-[10px] font-bold text-emerald-400 block uppercase">Official Resolution:</span>
                      <p>{ticket.response}</p>
                    </div>
                  )}

                  <div className="pt-1 text-[10px] text-slate-500 flex justify-between">
                    <span>Submitted: {ticket.submittedAt}</span>
                    <span>By: {ticket.submittedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Tenders & Careers */}
      {activeTab === 'tenders' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Tenders */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Active E-Procurement Tenders
              </h3>
              <div className="space-y-3">
                {TENDERS_MOCK.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-emerald-400 font-bold">{t.tenderNo}</span>
                      <span className="text-amber-400 font-semibold">{t.estimate}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-white">{t.title}</h4>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Closing Date: <strong className="text-rose-400">{t.closingDate}</strong></span>
                      <button onClick={() => alert(`Downloaded tender document for ${t.tenderNo}`)} className="text-emerald-400 hover:underline">Download NIT Document</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Careers */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Faculty & Staff Recruitment
              </h3>
              <div className="space-y-3">
                {CAREERS_MOCK.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-amber-400 font-bold">{c.advtNo}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">{c.category}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-white">{c.postName}</h4>
                    <p className="text-[11px] text-slate-400">{c.department} • Pay: {c.salary}</p>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Last Date: <strong className="text-rose-400">{c.lastDate}</strong></span>
                      <button onClick={() => alert(`Application form open for ${c.postName}`)} className="text-amber-400 hover:underline">Apply Online</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hall ticket modal */}
      <ExamHallTicketModal
        isOpen={isHallTicketOpen}
        onClose={() => setIsHallTicketOpen(false)}
      />
    </div>
  );
};
