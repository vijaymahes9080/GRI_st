import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { Search, X, Compass, FileText, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { SCHOOLS_DATA, INITIAL_CIRCULARS } from '../../core/data/griMasterData';

const SERVICES_LIST = [
  { id: 'srv-1', title: 'ESE Timetable', description: 'End Semester Exam Timetables & Schedules', tab: 'services' },
  { id: 'srv-2', title: 'Admissions', description: 'Online Admissions Portal & Counselling', tab: 'services' },
  { id: 'srv-3', title: 'Library Catalog', description: 'Central Library Book Search & OPAC', tab: 'services' },
  { id: 'srv-4', title: 'Grievance Redressal', description: 'Submit student or staff grievances', tab: 'services' },
  { id: 'srv-5', title: 'Tenders & Contracts', description: 'Active university tenders & procurements', tab: 'services' },
  { id: 'srv-7', title: 'Ask RuralGPT', description: 'AI Assistant for University Regulations', tab: 'ai_chat' },
  { id: 'srv-9', title: 'Programmes & Courses', description: 'Explore Academic Programmes', tab: 'explore' },
  { id: 'srv-10', title: 'Student Profile', description: 'View Digital ID and Personal Info', tab: 'profile' },
  { id: 'srv-11', title: 'Admin Dashboard', description: 'Staff and Administration Console', tab: 'admin' },
];

export const QuickSearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, setTab, setSelectedDepartment } = useAppStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Cmd/Ctrl + K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Extract all departments and programmes
  const allDepartments = useMemo(() => {
    return SCHOOLS_DATA.flatMap((s) => s.departments);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        departments: allDepartments.slice(0, 3),
        notices: INITIAL_CIRCULARS.slice(0, 2),
        services: SERVICES_LIST.slice(0, 3),
      };
    }

    const q = query.toLowerCase();
    return {
      departments: allDepartments.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.programmes.some((p) => p.name.toLowerCase().includes(q)) ||
          d.faculty.some((f) => f.name.toLowerCase().includes(q))
      ),
      notices: INITIAL_CIRCULARS.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      ),
      services: SERVICES_LIST.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      ),
    };
  }, [query, allDepartments]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#1A1F1D]/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E5EAE7] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5EAE7] bg-[#FDFDFB]">
          <Search className="w-5 h-5 text-[#0F4C3A] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search departments, programmes (MCA, B.Sc Agri), circulars, staff..."
            autoFocus
            className="w-full bg-transparent text-[#1A1F1D] placeholder-[#5C6661] text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#5C6661] hover:text-[#1A1F1D] p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="ml-2 p-1.5 rounded-lg bg-[#F2F6F4] text-[#5C6661] hover:text-[#1A1F1D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* Quick Actions Shortcuts */}
          {!query && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#5C6661] font-bold mb-2">
                Quick Navigation
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setTab('services');
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#F2F6F4]/80 hover:bg-[#F2F6F4] border border-[#E5EAE7] text-left text-xs text-[#1A1F1D]"
                >
                  <Layers className="w-3.5 h-3.5 text-[#0F4C3A]" />
                  <span>ESE Timetable</span>
                </button>
                <button
                  onClick={() => {
                    setTab('explore');
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#F2F6F4]/80 hover:bg-[#F2F6F4] border border-[#E5EAE7] text-left text-xs text-[#1A1F1D]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Programmes</span>
                </button>
                <button
                  onClick={() => {
                    setTab('alerts');
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#F2F6F4]/80 hover:bg-[#F2F6F4] border border-[#E5EAE7] text-left text-xs text-[#1A1F1D]"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  <span>Admissions</span>
                </button>
                <button
                  onClick={() => {
                    setTab('ai_chat');
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#F2F6F4]/80 hover:bg-[#F2F6F4] border border-[#E5EAE7] text-left text-xs text-[#1A1F1D]"
                >
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span>Ask RuralGPT</span>
                </button>
              </div>
            </div>
          )}

          {/* Departments & Courses Section */}
          {results.departments.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#5C6661] font-bold mb-2">
                Departments & Academics ({results.departments.length})
              </p>
              <div className="space-y-2">
                {results.departments.map((dept) => (
                  <div
                    key={dept.code}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setTab('explore');
                      setSearchOpen(false);
                    }}
                    className="p-3 rounded-xl bg-[#F2F6F4]/60 hover:bg-emerald-950/40 border border-[#E5EAE7]/80 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between transition group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0F4C3A] bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                          {dept.code}
                        </span>
                        <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition">
                          {dept.name}
                        </h4>
                      </div>
                      <p className="text-xs text-[#5C6661] mt-1 line-clamp-1">
                        Head: {dept.head} • {dept.programmes.length} Programmes offered
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5C6661] group-hover:text-[#0F4C3A] group-hover:translate-x-1 transition flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices Section */}
          {results.notices.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#5C6661] font-bold mb-2">
                Official Circulars & Notices ({results.notices.length})
              </p>
              <div className="space-y-2">
                {results.notices.map((circ) => (
                  <div
                    key={circ.id}
                    onClick={() => {
                      setTab('alerts');
                      setSearchOpen(false);
                    }}
                    className="p-3 rounded-xl bg-[#F2F6F4]/60 hover:bg-[#F2F6F4] border border-[#E5EAE7] cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="pr-3">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-[#1A1F1D]">
                        {circ.category}
                      </span>
                      <h4 className="text-xs font-medium text-[#1A1F1D] mt-1 line-clamp-1">
                        {circ.title}
                      </h4>
                      <span className="text-[10px] text-[#5C6661]">{circ.publishDate}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5C6661] group-hover:text-[#1A1F1D] transition flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {results.services.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#5C6661] font-bold mb-2">
                University Services ({results.services.length})
              </p>
              <div className="space-y-2">
                {results.services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setTab(srv.tab as any);
                      setSearchOpen(false);
                    }}
                    className="p-3 rounded-xl bg-[#F2F6F4]/60 hover:bg-blue-950/40 border border-[#E5EAE7]/80 hover:border-blue-500/50 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="pr-3">
                      <h4 className="text-sm font-medium text-[#1A1F1D] group-hover:text-blue-300 transition line-clamp-1">
                        {srv.title}
                      </h4>
                      <p className="text-xs text-[#5C6661] mt-0.5">
                        {srv.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5C6661] group-hover:text-blue-400 transition flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.departments.length === 0 && results.notices.length === 0 && results.services.length === 0 && (
            <div className="py-8 text-center text-[#5C6661] text-sm">
              No matching records found for "{query}". Try searching for <span className="text-[#0F4C3A]">Agriculture</span>, <span className="text-[#0F4C3A]">Computer Science</span>, <span className="text-[#0F4C3A]">Examinations</span>, or <span className="text-[#0F4C3A]">Hostel</span>.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-[#E5EAE7] flex items-center justify-between text-[11px] text-[#5C6661]">
          <span>Press ESC to close</span>
          <span>Gandhigram Rural Institute Central Directory</span>
        </div>
      </div>
    </div>
  );
};
