import React from 'react';
import { useAppStore } from '../../core/store/appStore';
import { INSTITUTION_INFO, EXAM_SCHEDULE_MOCK } from '../../core/data/griMasterData';
import { X, Printer, Download, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ExamHallTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamHallTicketModal: React.FC<ExamHallTicketModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAppStore();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Action Header */}
        <div className="bg-slate-900 px-6 py-3 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h3 className="text-sm font-bold">End Semester Examination (ESE) — Official Hall Ticket</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Hall Ticket Document */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-sans print:p-0">
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              {INSTITUTION_INFO.ministry}
            </div>
            <h1 className="text-xl font-bold font-serif uppercase tracking-tight text-slate-950 mt-0.5">
              THE GANDHIGRAM RURAL INSTITUTE
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              (Deemed to be University) • Accredited with 'A++' Grade by NAAC
            </p>
            <p className="text-[11px] text-slate-600">
              Gandhigram - 624 302, Dindigul District, Tamil Nadu, India
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
              HALL TICKET / ADMIT CARD — NOVEMBER / DECEMBER 2026 ESE
            </div>
          </div>

          {/* Candidate Bio Data */}
          <div className="grid grid-cols-3 gap-4 border border-slate-300 p-4 rounded-lg bg-slate-50">
            <div className="col-span-2 space-y-1.5">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-600">Candidate Name:</span>
                <span className="col-span-2 font-bold uppercase text-slate-900">{currentUser.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-600">Register Number:</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{currentUser.regNumber || '2024GRI1042'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-600">Department:</span>
                <span className="col-span-2 font-semibold text-slate-900">{currentUser.department}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-600">Semester & Batch:</span>
                <span className="col-span-2 font-semibold text-slate-900">Semester IV (2024–2026)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-600">Exam Centre:</span>
                <span className="col-span-2 font-bold text-emerald-800">Gandhigram Campus Main Exam Block (Centre 01)</span>
              </div>
            </div>

            {/* Photo & Barcode box */}
            <div className="flex flex-col items-center justify-center border border-dashed border-slate-400 bg-white p-2 rounded text-center">
              <div className="w-20 h-24 bg-slate-200 rounded flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-300">
                PHOTO
              </div>
              <span className="text-[10px] font-mono mt-1 text-slate-600">{currentUser.regNumber || '2024GRI1042'}</span>
            </div>
          </div>

          {/* Registered Exam Courses Schedule */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs mb-2">
              Registered Examination Schedule:
            </h4>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                    <th className="p-2 border-r border-slate-300">Course Code</th>
                    <th className="p-2 border-r border-slate-300">Course / Subject Title</th>
                    <th className="p-2 border-r border-slate-300">Date</th>
                    <th className="p-2 border-r border-slate-300">Session</th>
                    <th className="p-2">Hall / Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {EXAM_SCHEDULE_MOCK.slice(0, 4).map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 font-mono font-bold text-slate-900 border-r border-slate-300">{item.courseCode}</td>
                      <td className="p-2 font-semibold text-slate-800 border-r border-slate-300">{item.subjectTitle}</td>
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-300">{item.examDate}</td>
                      <td className="p-2 text-slate-700 border-r border-slate-300">{item.session}</td>
                      <td className="p-2 text-slate-700 font-semibold">{item.hall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mandatory Instructions */}
          <div className="border border-amber-200 bg-amber-50 p-3 rounded-lg text-[10px] text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1 text-amber-950">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              IMPORTANT INSTRUCTIONS TO CANDIDATE:
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
              <li>Candidates must occupy allotted seats in the exam hall 15 minutes before commencement.</li>
              <li>Possession of mobile phones, smart watches, and unauthorized paper is strictly prohibited under GRI Malpractice Bylaws.</li>
              <li>Candidates must produce this Hall Ticket alongside the Institute Identity Card for verification by the Invigilator.</li>
              <li>No candidate will be allowed to leave the examination hall before 45 minutes from start.</li>
            </ol>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
            <div>
              <div className="h-8"></div>
              <div className="border-t border-slate-800 pt-1 font-semibold text-slate-800">
                Candidate's Signature
              </div>
            </div>
            <div>
              <div className="font-serif italic font-bold text-slate-900 text-sm h-8 flex items-end justify-center">
                Dr. M. Senthilvel
              </div>
              <div className="border-t border-slate-800 pt-1 font-bold text-slate-900">
                Controller of Examinations, GRI
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 print:hidden">
          <span>Digital Verification Code: <strong>GRI-2026-COE-883921</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
