import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  EXAM_SCHEDULE_MOCK, 
  LIBRARY_CATALOG_MOCK, 
  TENDERS_MOCK, 
  CAREERS_MOCK 
} from '../../core/data/griMasterData';
import { 
  Layers, Calendar, FileText, BookOpen, HelpCircle, Briefcase, 
  Printer, Search, CheckCircle2, Send, ShieldCheck, Users, 
  ArrowRight, Download
} from 'lucide-react';
import { ExamHallTicketModal } from './ExamHallTicketModal';
import { AccessRestricted } from '../common/AccessRestricted';

export const ServicesView: React.FC = () => {
  const { currentUser, grievances, addGrievance } = useAppStore();
  const [activeTab, setActiveTab] = useState<'exam' | 'admissions' | 'library' | 'grievance' | 'tenders'>('exam');
  const [isHallTicketOpen, setIsHallTicketOpen] = useState(false);
  
  const [libraryQuery, setLibraryQuery] = useState('');
  
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

  const tabs = [
    { id: 'exam', label: 'Examinations', icon: <Calendar className="w-4 h-4" /> },
    { id: 'admissions', label: 'Admissions', icon: <FileText className="w-4 h-4" /> },
    { id: 'library', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'grievance', label: 'Samadhan', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'tenders', label: 'Careers & Tenders', icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 pb-24 animate-fadeIn max-w-6xl mx-auto px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium text-[#1A1F1D] tracking-tight leading-[1.1]">
          Student & <br/>
          <span className="text-black/30">Services Hub.</span>
        </h1>
        <p className="text-xl text-[#5C6661] font-light leading-relaxed">
          Access essential digital services, examinations, library resources, and administrative tools in one place.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#0F4C3A] text-white shadow-md'
                  : 'bg-white text-[#5C6661] hover:bg-[#F2F6F4] border border-[#E5EAE7]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Areas */}
      
      {/* 1. EXAMINATIONS */}
      {activeTab === 'exam' && (
        <div className="space-y-8 sm:space-y-12 animate-fadeIn">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#E5F0EB] p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F4C3A] mb-4 block">Nov/Dec 2026 ESE</span>
                <h3 className="text-2xl font-bold text-[#1A1F1D] mb-2">Hall Ticket</h3>
                <p className="text-sm text-[#0F4C3A]/70 mb-8">Generate your official admit card with barcode verification.</p>
              </div>
              <button
                onClick={() => setIsHallTicketOpen(true)}
                className="w-full py-4 rounded-full bg-[#0F4C3A] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#0A3327] transition-colors"
              >
                <Printer className="w-5 h-5" /> Generate Ticket
              </button>
            </div>

            <div className="bg-[#FDF6E3] p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B45309] mb-4 block">Assessment</span>
                <h3 className="text-2xl font-bold text-[#1A1F1D] mb-2">CIA Marks</h3>
                <p className="text-sm text-[#B45309]/70 mb-8">View internal assessment scores for current semester.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/50 text-sm font-medium text-[#B45309] flex items-center justify-between">
                <span>Status: <strong className="text-[#1A1F1D]">Approved</strong></span>
                <span>Max: 40</span>
              </div>
            </div>

            <div className="bg-[#E0F2FE] p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0369A1] mb-4 block">Verification</span>
                <h3 className="text-2xl font-bold text-[#1A1F1D] mb-2">e-Sanad</h3>
                <p className="text-sm text-[#0369A1]/70 mb-8">Contactless degree apostille via Govt. of India portal.</p>
              </div>
              <button
                onClick={() => alert('e-Sanad portal integration active.')}
                className="w-full py-4 rounded-full bg-white text-[#0369A1] font-bold flex items-center justify-center gap-2 hover:bg-white/80 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-5 h-5" /> Access e-Sanad
              </button>
            </div>
          </div>

          {/* Timetable Table */}
          <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 border-b border-[#E5EAE7] flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-medium text-[#1A1F1D]">Official Timetable</h3>
                <p className="text-[#5C6661]">Controller of Examinations (Nov/Dec 2026)</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F2F6F4] text-[#5C6661] text-xs uppercase tracking-wider font-bold">
                    <th className="px-8 py-4">Code</th>
                    <th className="px-8 py-4">Subject</th>
                    <th className="px-8 py-4">Degree</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Session</th>
                    <th className="px-8 py-4">Hall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAE7] text-[#1A1F1D] text-sm font-medium">
                  {EXAM_SCHEDULE_MOCK.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 text-[#0F4C3A] font-bold">{item.courseCode}</td>
                      <td className="px-8 py-5">{item.subjectTitle}</td>
                      <td className="px-8 py-5 text-[#5C6661]">{item.degree}</td>
                      <td className="px-8 py-5">{item.examDate}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.session.startsWith('FN') ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#E0F2FE] text-[#0369A1]'
                        }`}>
                          {item.session}
                        </span>
                      </td>
                      <td className="px-8 py-5">{item.hall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMISSIONS */}
      {activeTab === 'admissions' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-[#0F4C3A] p-6 sm:p-8 lg:p-12 rounded-3xl sm:rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/20">
                Admissions 2026-27
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-medium">
                Join Gandhigram.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Admissions are strictly conducted via CUET (Common University Entrance Test) scores and GRI Institutional Merit Quota.
              </p>
            </div>
            <button className="px-8 py-4 rounded-full bg-white text-[#0F4C3A] font-bold text-lg whitespace-nowrap hover:bg-[#F2F6F4] transition-colors shadow-xl">
              Apply via Samarth
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#0F4C3A] mb-6">Undergraduate</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">B.Sc. Agriculture</span>
                  <strong className="text-[#0F4C3A]">₹22,500</strong>
                </li>
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">B.Sc. Computer Science</span>
                  <strong className="text-[#0F4C3A]">₹12,000</strong>
                </li>
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">B.Sc. Chemistry</span>
                  <strong className="text-[#0F4C3A]">₹11,000</strong>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#0369A1] mb-6">Postgraduate</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">MCA</span>
                  <strong className="text-[#0369A1]">₹24,000</strong>
                </li>
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">MBA</span>
                  <strong className="text-[#0369A1]">₹32,000</strong>
                </li>
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">M.Sc. Agriculture</span>
                  <strong className="text-[#0369A1]">₹18,000</strong>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#7E22CE] mb-6">Doctoral & Diploma</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">Ph.D. Sciences</span>
                  <strong className="text-[#7E22CE]">₹14,000</strong>
                </li>
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">Ph.D. Social Sciences</span>
                  <strong className="text-[#7E22CE]">₹8,000</strong>
                </li>
                <li className="flex justify-between border-b border-[#F2F6F4] pb-2">
                  <span className="text-[#1A1F1D] font-medium">Shanti Sena Certificate</span>
                  <strong className="text-[#7E22CE]">₹2,500</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-white p-4 rounded-full border border-[#E5EAE7] shadow-sm flex items-center gap-4">
            <Search className="w-6 h-6 text-[#5C6661] ml-4" />
            <input
              type="text"
              value={libraryQuery}
              onChange={(e) => setLibraryQuery(e.target.value)}
              placeholder="Search catalog by Title, Author, or Dewey Decimal..."
              className="flex-1 bg-transparent text-lg text-[#1A1F1D] placeholder-[#5C6661] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm hover:border-[#0F4C3A] transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5C6661] bg-[#F2F6F4] px-3 py-1 rounded-full">
                      {book.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      book.copiesAvailable > 0 ? 'bg-[#E5F0EB] text-[#0F4C3A]' : 'bg-[#FEF2F2] text-[#BE123C]'
                    }`}>
                      {book.copiesAvailable > 0 ? 'Available' : 'Issued'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1F1D] mb-2 leading-tight">{book.title}</h3>
                  <p className="text-[#5C6661] text-sm mb-6">by {book.author}</p>
                  
                  <div className="bg-[#F2F6F4] p-4 rounded-2xl text-sm mb-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#5C6661]">Call Number</span>
                      <strong className="text-[#1A1F1D] font-mono">{book.callNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C6661]">Location</span>
                      <strong className="text-[#1A1F1D]">{book.location}</strong>
                    </div>
                  </div>
                </div>
                
                <button className="w-full py-3 rounded-full border border-[#0F4C3A] text-[#0F4C3A] font-bold hover:bg-[#0F4C3A] hover:text-white transition-colors">
                  Reserve Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SAMADHAN / GRIEVANCE */}
      {activeTab === 'grievance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 animate-fadeIn">
          <div className="space-y-6">
             <div>
              <h2 className="text-3xl font-display font-medium text-[#1A1F1D]">Samadhan Cell</h2>
              <p className="text-[#5C6661] mt-2">Official grievance tracking and redressal system.</p>
             </div>

             {currentUser.role === 'guest' ? (
               <AccessRestricted
                 compact
                 title="Authentication Required"
                 resourceName="Samadhan Redressal Portal"
                 message="Please sign in with your verified GRI Student or Employee ID to lodge a grievance."
                 primaryActionText="Sign In"
               />
             ) : (
               <form onSubmit={handleGrievanceSubmit} className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm space-y-6">
                 {grievanceSubmittedMsg && (
                   <div className="p-4 rounded-2xl bg-[#E5F0EB] text-[#0F4C3A] font-medium flex items-center gap-3">
                     <CheckCircle2 className="w-5 h-5" />
                     Ticket submitted successfully.
                   </div>
                 )}

                 <div>
                   <label className="block text-sm font-bold text-[#1A1F1D] mb-2">Category</label>
                   <select
                     value={grievanceCategory}
                     onChange={(e) => setGrievanceCategory(e.target.value)}
                     className="w-full bg-[#F2F6F4] rounded-xl p-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
                   >
                     <option value="Academic">Academic & Marks</option>
                     <option value="Hostel & Mess">Hostel & Food</option>
                     <option value="Scholarship & Fees">Scholarships</option>
                     <option value="Infrastructure">Infrastructure</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-[#1A1F1D] mb-2">Subject</label>
                   <input
                     type="text"
                     value={grievanceSubject}
                     onChange={(e) => setGrievanceSubject(e.target.value)}
                     required
                     className="w-full bg-[#F2F6F4] rounded-xl p-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-[#1A1F1D] mb-2">Description</label>
                   <textarea
                     value={grievanceDesc}
                     onChange={(e) => setGrievanceDesc(e.target.value)}
                     rows={5}
                     required
                     className="w-full bg-[#F2F6F4] rounded-xl p-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
                   />
                 </div>

                 <button
                   type="submit"
                   className="w-full py-4 rounded-full bg-[#0F4C3A] text-white font-bold text-lg hover:bg-[#0A3327] transition-colors flex items-center justify-center gap-2"
                 >
                   <Send className="w-5 h-5" /> Submit Grievance
                 </button>
               </form>
             )}
          </div>

          <div>
             <h2 className="text-xl font-bold text-[#1A1F1D] mb-6">Your Active Tickets</h2>
             <div className="space-y-4">
               {grievances.map((ticket) => (
                 <div key={ticket.id} className="bg-white p-6 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-xs font-bold text-[#5C6661] bg-[#F2F6F4] px-3 py-1 rounded-full">{ticket.category}</span>
                     <span className="text-xs font-bold text-[#0F4C3A] bg-[#E5F0EB] px-3 py-1 rounded-full">{ticket.status}</span>
                   </div>
                   <h4 className="font-bold text-[#1A1F1D] text-lg mb-2">{ticket.subject}</h4>
                   <p className="text-[#5C6661] text-sm mb-4">{ticket.description}</p>
                   {ticket.response && (
                     <div className="p-4 bg-[#F2F6F4] rounded-xl border-l-4 border-[#0F4C3A] text-sm">
                       <strong className="block text-[#1A1F1D] mb-1">Official Response:</strong>
                       <p className="text-[#5C6661]">{ticket.response}</p>
                     </div>
                   )}
                 </div>
               ))}
               {grievances.length === 0 && (
                 <div className="p-12 text-center text-[#5C6661]">
                   You have no active grievances.
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {/* 5. TENDERS */}
      {activeTab === 'tenders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-display font-medium text-[#1A1F1D] mb-8">Active Tenders</h2>
            <div className="space-y-4">
              {TENDERS_MOCK.map((t, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm hover:border-[#0F4C3A] transition-colors">
                  <span className="text-sm font-bold font-mono text-[#0F4C3A]">{t.tenderNo}</span>
                  <h4 className="text-lg font-bold text-[#1A1F1D] mt-2 mb-4">{t.title}</h4>
                  <div className="flex justify-between items-center text-sm text-[#5C6661] pt-4 border-t border-[#F2F6F4]">
                    <span>Estimate: <strong className="text-[#1A1F1D]">{t.estimate}</strong></span>
                    <button className="flex items-center gap-1 text-[#0F4C3A] font-bold"><Download className="w-4 h-4"/> PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-medium text-[#1A1F1D] mb-8">Careers</h2>
            <div className="space-y-4">
              {CAREERS_MOCK.map((c, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] shadow-sm hover:border-[#0F4C3A] transition-colors">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold font-mono text-[#B45309]">{c.advtNo}</span>
                    <span className="text-xs font-bold bg-[#FDF6E3] text-[#B45309] px-2 py-1 rounded-full">{c.category}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1A1F1D] mb-1">{c.postName}</h4>
                  <p className="text-sm text-[#5C6661] mb-4">{c.department}</p>
                  <div className="flex justify-between items-center text-sm text-[#5C6661] pt-4 border-t border-[#F2F6F4]">
                    <span>Deadline: <strong className="text-[#BE123C]">{c.lastDate}</strong></span>
                    <button className="text-[#0F4C3A] font-bold">Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ExamHallTicketModal
        isOpen={isHallTicketOpen}
        onClose={() => setIsHallTicketOpen(false)}
      />
    </div>
  );
};
