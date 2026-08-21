import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { SCHOOLS_DATA } from '../../core/data/griMasterData';
import { DepartmentInfo } from '../../types';
import { 
  Search, 
  GraduationCap, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Filter,
  Building2,
  Phone,
  Mail
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { setSelectedDepartment } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const filteredSchools = useMemo(() => {
    return SCHOOLS_DATA.filter(s => selectedSchool === 'ALL' || s.id === selectedSchool)
      .map(school => {
        const filteredDepts = school.departments.filter(dept => {
          const matchQuery = 
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.programmes.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

          const matchLevel = 
            selectedLevel === 'ALL' ||
            dept.programmes.some(p => p.level.toUpperCase() === selectedLevel.toUpperCase());

          return matchQuery && matchLevel;
        });

        return {
          ...school,
          departments: filteredDepts,
        };
      })
      .filter(s => s.departments.length > 0);
  }, [searchQuery, selectedSchool, selectedLevel]);

  const totalFilteredDepts = filteredSchools.reduce((acc, s) => acc + s.departments.length, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academic Directory & Curriculum</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Schools & Academic Departments
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Explore all faculties, degree programmes (UG, PG, B.Voc, Doctoral), research specializations, instructional farms, and advanced scientific laboratories.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by department name, code (CS, AGR, CHE) or course..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* School Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Schools of Study</option>
              {SCHOOLS_DATA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Level Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Programme Levels</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG / MCA / MBA)</option>
              <option value="DOCTORAL">Doctoral (Ph.D.)</option>
              <option value="CERTIFICATE">Certificates & Diplomas</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Showing <strong>{totalFilteredDepts}</strong> matching academic departments</span>
          {(searchQuery || selectedSchool !== 'ALL' || selectedLevel !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSchool('ALL');
                setSelectedLevel('ALL');
              }}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Schools & Departments List */}
      <div className="space-y-10">
        {filteredSchools.map((school) => (
          <div key={school.id} className="space-y-4">
            {/* School Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border-l-4 border-l-emerald-500 border-y border-r border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                    {school.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{school.description}</p>
                </div>
                <div className="text-xs text-slate-300 sm:text-right flex-shrink-0">
                  <span className="text-slate-500 block text-[10px]">Dean of School</span>
                  <strong className="text-emerald-400 font-semibold">{school.deanName}</strong>
                </div>
              </div>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {school.departments.map((dept) => (
                <div
                  key={dept.code}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {dept.code}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {dept.faculty.length} Faculty Members
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition">
                          {dept.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {dept.overview}
                    </p>

                    {/* Programmes Pills */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold uppercase text-slate-500 block">
                        Degrees Offered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dept.programmes.map((p, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 font-medium"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Head info */}
                    <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80">
                      <span>HoD: <strong className="text-slate-200">{dept.head}</strong></span>
                      <span className="text-slate-500 font-mono text-[11px]">{dept.phone}</span>
                    </div>
                  </div>

                  {/* Deep View CTA */}
                  <button
                    onClick={() => setSelectedDepartment(dept)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-700 hover:border-emerald-500"
                  >
                    <span>View Syllabus, Faculty & Labs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredSchools.length === 0 && (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 space-y-3">
            <Building2 className="w-8 h-8 mx-auto text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No departments match your filters</h3>
            <p className="text-xs">Try clearing the search query or changing the School / Programme level filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
