import React from 'react';
import { useAppStore } from '../../core/store/appStore';
import { INSTITUTION_INFO, EXAM_SCHEDULE_MOCK } from '../../core/data/griMasterData';
import { X, Printer, ShieldAlert } from 'lucide-react';
import { AccessRestricted } from '../common/AccessRestricted';

interface ExamHallTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamHallTicketModal: React.FC<ExamHallTicketModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setLoginModalOpen } = useAppStore();

  if (!isOpen) return null;

  if (currentUser.role === 'guest') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1F1D]/40 backdrop-blur-md animate-fadeIn">
        <div className="bg-white border border-[#E5EAE7] text-[#1A1F1D] w-full max-w-xl rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#5C6661] hover:text-[#1A1F1D] rounded-full hover:bg-[#F2F6F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <AccessRestricted
            title="Hall Ticket Restricted"
            resourceName="Controller of Examinations (CoE)"
            requiredRole={['student', 'scholar', 'admin']}
            requiredScope="Assigned Enrolled Candidate Register Number"
            message="Official Examination Hall Tickets require a verified Student Register Number and authentication against the GRI Academic Database."
            primaryActionText="Sign In with Register Number"
            onPrimaryAction={() => {
              onClose();
              setLoginModalOpen(true);
            }}
            secondaryActionText="Close"
            onSecondaryAction={onClose}
          />
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1F1D]/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white text-[#1A1F1D] w-full max-w-4xl rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-[#E5EAE7]">
        {/* Modal Action Header */}
        <div className="bg-[#FDFDFB] px-8 py-6 border-b border-[#E5EAE7] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]"></span>
            <h3 className="text-lg font-bold">End Semester Examination (ESE) — Hall Ticket</h3>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0F4C3A] hover:bg-[#0A3327] text-white rounded-full text-sm font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-[#1A1F1D] bg-white border border-[#E5EAE7] rounded-full hover:bg-[#F2F6F4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Hall Ticket Document */}
        <div className="p-6 sm:p-8 lg:p-12 overflow-y-auto flex-1 font-sans print:p-0">
          
          <div className="max-w-3xl mx-auto space-y-8 border-2 border-[#1A1F1D] p-6 sm:p-8 lg:p-12">
            
            {/* Institutional Header */}
            <div className="text-center border-b-2 border-[#1A1F1D] pb-6">
              <div className="text-xs font-bold tracking-widest text-[#5C6661] uppercase mb-2">
                {INSTITUTION_INFO.ministry}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-medium uppercase tracking-tight text-[#1A1F1D]">
                THE GANDHIGRAM RURAL INSTITUTE
              </h1>
              <p className="text-sm font-medium text-[#5C6661] mt-1">
                (Deemed to be University) • Accredited with 'A++' Grade by NAAC
              </p>
              <div className="mt-6 inline-block px-4 py-2 bg-[#1A1F1D] text-white font-bold text-sm uppercase tracking-widest rounded-full">
                HALL TICKET — NOV / DEC 2026 ESE
              </div>
            </div>

            {/* Candidate Bio Data */}
            <div className="flex items-stretch gap-6 border-b-2 border-[#1A1F1D] pb-8">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm border-b border-[#E5EAE7] pb-2">
                  <span className="font-bold text-[#5C6661] uppercase tracking-wider text-xs">Candidate Name</span>
                  <span className="col-span-2 font-bold uppercase text-[#1A1F1D] text-base">{currentUser.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm border-b border-[#E5EAE7] pb-2">
                  <span className="font-bold text-[#5C6661] uppercase tracking-wider text-xs">Register Number</span>
                  <span className="col-span-2 font-mono font-bold text-[#0F4C3A] text-base">{currentUser.regNumber || '2024GRI1042'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm border-b border-[#E5EAE7] pb-2">
                  <span className="font-bold text-[#5C6661] uppercase tracking-wider text-xs">Department</span>
                  <span className="col-span-2 font-bold text-[#1A1F1D]">{currentUser.department}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-bold text-[#5C6661] uppercase tracking-wider text-xs">Exam Centre</span>
                  <span className="col-span-2 font-bold text-[#1A1F1D]">Main Exam Block (Centre 01)</span>
                </div>
              </div>

              {/* Photo Box */}
              <div className="w-32 flex flex-col items-center justify-center border-2 border-dashed border-[#5C6661] p-2 rounded-lg bg-[#FDFDFB]">
                <div className="w-full aspect-[3/4] bg-[#E5EAE7] rounded flex items-center justify-center font-bold text-[#5C6661] text-xs">
                  PHOTO
                </div>
              </div>
            </div>

            {/* Registered Exam Courses Schedule */}
            <div>
              <h4 className="font-bold text-[#1A1F1D] uppercase tracking-widest text-xs mb-4">
                Registered Examination Schedule
              </h4>
              <table className="w-full text-left text-sm border-2 border-[#1A1F1D]">
                <thead>
                  <tr className="border-b-2 border-[#1A1F1D] font-bold text-[#1A1F1D] bg-[#F2F6F4]">
                    <th className="p-3 border-r-2 border-[#1A1F1D]">Code</th>
                    <th className="p-3 border-r-2 border-[#1A1F1D]">Subject Title</th>
                    <th className="p-3 border-r-2 border-[#1A1F1D]">Date</th>
                    <th className="p-3 border-r-2 border-[#1A1F1D]">Session</th>
                    <th className="p-3">Hall</th>
                  </tr>
                </thead>
                <tbody>
                  {EXAM_SCHEDULE_MOCK.slice(0, 4).map((item, idx) => (
                    <tr key={idx} className="border-b border-[#1A1F1D]">
                      <td className="p-3 font-mono font-bold text-[#1A1F1D] border-r border-[#1A1F1D]">{item.courseCode}</td>
                      <td className="p-3 font-medium text-[#1A1F1D] border-r border-[#1A1F1D]">{item.subjectTitle}</td>
                      <td className="p-3 font-bold text-[#1A1F1D] border-r border-[#1A1F1D]">{item.examDate}</td>
                      <td className="p-3 text-[#1A1F1D] border-r border-[#1A1F1D]">{item.session}</td>
                      <td className="p-3 text-[#1A1F1D] font-medium">{item.hall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mandatory Instructions */}
            <div className="border border-[#1A1F1D] p-6 text-sm text-[#1A1F1D] space-y-3">
              <p className="font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#BE123C]" />
                Important Instructions
              </p>
              <ol className="list-decimal list-outside ml-4 space-y-1 text-[#5C6661] font-medium">
                <li>Occupy allotted seats 15 minutes before commencement.</li>
                <li>Possession of mobile phones and smart watches is strictly prohibited.</li>
                <li>Produce this Hall Ticket alongside Institute ID Card for verification.</li>
                <li>No candidate may leave the hall before 45 minutes from start.</li>
              </ol>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:gap-12 pt-12 text-center text-sm">
              <div>
                <div className="h-12 border-b-2 border-[#1A1F1D] mb-2"></div>
                <div className="font-bold text-[#5C6661] uppercase tracking-widest text-xs">
                  Candidate's Signature
                </div>
              </div>
              <div>
                <div className="h-12 border-b-2 border-[#1A1F1D] mb-2 font-display italic font-medium text-[#1A1F1D] text-lg flex items-end justify-center pb-1">
                  Dr. M. Senthilvel
                </div>
                <div className="font-bold text-[#5C6661] uppercase tracking-widest text-xs">
                  Controller of Examinations
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
