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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/50 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-900 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded">
                Code: {department.code}
              </span>
              <span className="text-xs text-amber-400 font-medium">{department.schoolName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              {department.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Head of Department: <strong className="text-white">{department.head}</strong> ({department.headDesignation})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {/* Contact Bar & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Department Overview
              </h3>
              <p className="leading-relaxed text-slate-200">{department.overview}</p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Contact Department
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{department.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{department.phone}</span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] bg-slate-900 px-2 py-1 rounded text-slate-400 border border-slate-700 block text-center">
                  Mon - Fri: 09:30 AM - 05:30 PM
                </span>
              </div>
            </div>
          </div>

          {/* Programmes Offered */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Academic Programmes Offered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {department.programmes.map((prog, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                      {prog.level}
                    </span>
                    <span className="text-slate-400 font-medium">{prog.duration}</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">{prog.name}</h4>
                  <div className="text-xs text-slate-400 flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                    <span>Intake: {prog.intake} seats</span>
                    <span className="text-amber-400 font-medium">{prog.feesPerSem}/sem</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Members */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Faculty Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {department.faculty.map((fac, idx) => (
                <div key={idx} className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs text-white">
                      {fac.name.split(' ').pop()?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xs">{fac.name}</h4>
                      <p className="text-[11px] text-emerald-400">{fac.designation}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    <span className="text-slate-500">Qual:</span> {fac.qualification}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    <span className="text-slate-500">Specialization:</span> {fac.specialization}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Research & Labs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Active Research Thrust Areas
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {department.researchAreas.map((res, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4" />
                Department Laboratories & Infrastructure
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {department.facilities.map((fac, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            For admissions enquiries, write to admissions@ruraluniv.ac.in
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
