import React from 'react';
import { DepartmentInfo } from '../../types';
import { X, Mail, Phone, BookOpen, Award, Users, FlaskConical, Building2 } from 'lucide-react';

interface DepartmentModalProps {
  department: DepartmentInfo | null;
  onClose: () => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({ department, onClose }) => {
  if (!department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1F1D]/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 sm:p-8 lg:p-12 bg-[#FDFDFB] border-b border-[#E5EAE7] relative">
          <button
            onClick={onClose}
            className="absolute top-6 sm:top-8 right-8 p-3 rounded-full bg-white border border-[#E5EAE7] hover:bg-[#F2F6F4] hover:text-[#0F4C3A] text-[#1A1F1D] transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#E5F0EB] text-[#0F4C3A] text-xs font-bold font-mono tracking-wider">
                Code: {department.code}
              </span>
              <span className="text-sm text-[#5C6661] font-medium">{department.schoolName}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-[#1A1F1D] leading-tight">
              {department.name}
            </h2>
            <p className="text-lg text-[#5C6661]">
              Head of Department: <strong className="text-[#1A1F1D]">{department.head}</strong> ({department.headDesignation})
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 lg:p-12 overflow-y-auto bg-white flex-1 space-y-8 sm:space-y-12">
          
          {/* Overview & Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#5C6661] mb-2">
                Department Overview
              </h3>
              <p className="text-lg text-[#1A1F1D] leading-relaxed font-light">
                {department.overview}
              </p>
            </div>

            <div className="bg-[#F2F6F4] p-6 sm:p-8 rounded-[1.5rem] space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#5C6661]">
                Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[#1A1F1D]">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Mail className="w-4 h-4 text-[#0F4C3A]" />
                  </div>
                  <span className="font-medium text-sm break-all">{department.email}</span>
                </div>
                <div className="flex items-center gap-4 text-[#1A1F1D]">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Phone className="w-4 h-4 text-[#0F4C3A]" />
                  </div>
                  <span className="font-medium text-sm">{department.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Programmes Offered */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#5C6661] mb-6">
              Academic Programmes Offered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {department.programmes.map((prog, idx) => (
                <div key={idx} className="bg-white border border-[#E5EAE7] p-6 rounded-2xl hover:border-[#0F4C3A] hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#E5F0EB] text-[#0F4C3A] text-[10px] font-bold uppercase tracking-wider">
                      {prog.level}
                    </span>
                    <span className="text-xs text-[#5C6661] font-medium">{prog.duration}</span>
                  </div>
                  <h4 className="font-bold text-[#1A1F1D] text-lg mb-4">{prog.name}</h4>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-[#F2F6F4]">
                    <span className="text-[#5C6661]">Intake: {prog.intake}</span>
                    <span className="font-bold text-[#0F4C3A]">{prog.feesPerSem}/sem</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure & Research */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-[#1A1F1D] p-6 sm:p-8 rounded-[1.5rem] text-white">
               <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-3">
                 <Award className="w-5 h-5 text-white" /> Active Research Areas
               </h3>
               <ul className="space-y-4">
                 {department.researchAreas.map((res, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
                     <span className="text-white/90 leading-relaxed">{res}</span>
                   </li>
                 ))}
               </ul>
             </div>

             <div className="bg-[#0F4C3A] p-6 sm:p-8 rounded-[1.5rem] text-white">
               <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-3">
                 <FlaskConical className="w-5 h-5 text-white" /> Laboratories & Infrastructure
               </h3>
               <ul className="space-y-4">
                 {department.facilities.map((fac, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] mt-2 shrink-0"></span>
                     <span className="text-white/90 leading-relaxed">{fac}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          {/* Faculty Members */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#5C6661] mb-6">
              Faculty Roster
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {department.faculty.map((fac, idx) => (
                <div key={idx} className="bg-white border border-[#E5EAE7] p-5 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F2F6F4] flex items-center justify-center font-bold text-lg text-[#0F4C3A] shrink-0">
                    {fac.name.split(' ').pop()?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1F1D]">{fac.name}</h4>
                    <p className="text-[#0F4C3A] text-xs font-semibold mb-2">{fac.designation}</p>
                    <div className="space-y-1">
                      <p className="text-[11px] text-[#5C6661]"><strong className="text-[#1A1F1D]">Qual:</strong> {fac.qualification}</p>
                      <p className="text-[11px] text-[#5C6661]"><strong className="text-[#1A1F1D]">Focus:</strong> {fac.specialization}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
