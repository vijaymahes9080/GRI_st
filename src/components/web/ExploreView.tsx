import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { SCHOOLS_DATA } from '../../core/data/griMasterData';
import { 
  Search, GraduationCap, ArrowRight, ArrowUpRight, BookOpen, Users, MapPin, ExternalLink
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

        return { ...school, departments: filteredDepts };
      })
      .filter(s => s.departments.length > 0);
  }, [searchQuery, selectedSchool, selectedLevel]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-24 animate-fadeIn max-w-6xl mx-auto px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium text-[#1A1F1D] tracking-tight leading-[1.1]">
          Academic <br/>
          <span className="text-black/30">Excellence.</span>
        </h1>
        <p className="text-xl text-[#5C6661] font-light leading-relaxed">
          Explore all faculties, degree programmes, research specializations, and advanced scientific laboratories across our 28+ departments.
        </p>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-[#E5EAE7] flex flex-col md:flex-row gap-4 sticky top-6 z-30">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-[#5C6661] absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments, courses, or professors..."
            className="w-full bg-[#F2F6F4] rounded-full pl-14 pr-6 py-4 text-base text-[#1A1F1D] placeholder-[#5C6661] focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="bg-white border border-[#E5EAE7] rounded-full px-6 py-4 text-sm font-semibold text-[#1A1F1D] outline-none focus:border-[#0F4C3A] cursor-pointer"
          >
            <option value="ALL">All Schools</option>
            {SCHOOLS_DATA.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-white border border-[#E5EAE7] rounded-full px-6 py-4 text-sm font-semibold text-[#1A1F1D] outline-none focus:border-[#0F4C3A] cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="UG">Undergraduate</option>
            <option value="PG">Postgraduate</option>
            <option value="DOCTORAL">Doctoral</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-24 pt-8">
        {filteredSchools.map((school) => (
          <section key={school.id} className="relative">
            <div className="mb-12 border-b-2 border-[#1A1F1D] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1A1F1D] mb-2">
                  {school.name}
                </h2>
                <p className="text-[#5C6661] max-w-2xl">{school.description}</p>
              </div>
              <div className="text-right">
                <span className="block text-xs uppercase tracking-wider text-[#5C6661] mb-1">Dean of School</span>
                <strong className="text-lg font-bold text-[#1A1F1D]">{school.deanName}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {school.departments.map((dept) => (
                <div key={dept.code} className="group relative">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#E5F0EB] text-[#0F4C3A] text-xs font-bold font-mono tracking-wider">
                      {dept.code}
                    </span>
                    <button 
                      onClick={() => setSelectedDepartment(dept)}
                      className="w-10 h-10 rounded-full bg-white border border-[#E5EAE7] flex items-center justify-center group-hover:bg-[#0F4C3A] group-hover:border-[#0F4C3A] group-hover:text-white transition-all shadow-sm"
                    >
                      <ArrowUpRight className="w-5 h-5 text-[#1A1F1D] group-hover:text-white transition-colors" />
                    </button>
                  </div>
                  
                  <h3 
                    className="text-2xl font-bold text-[#1A1F1D] mb-3 group-hover:text-[#0F4C3A] cursor-pointer transition-colors"
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    {dept.name}
                  </h3>
                  <p className="text-[#5C6661] text-sm leading-relaxed mb-6 line-clamp-3">
                    {dept.overview}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {dept.programmes.slice(0, 4).map((p, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-black/5 text-[#1A1F1D] font-medium border border-black/5">
                        {p.name}
                      </span>
                    ))}
                    {dept.programmes.length > 4 && (
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-black/5 text-[#5C6661] font-medium">
                        +{dept.programmes.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E5EAE7] flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[#5C6661]">
                      <Users className="w-4 h-4" />
                      <span>Head: <strong className="text-[#1A1F1D]">{dept.head}</strong></span>
                    </div>
                    <span className="text-[#5C6661]">{dept.faculty.length} Faculty</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredSchools.length === 0 && (
          <div className="py-24 text-center">
            <Search className="w-12 h-12 text-[#E5EAE7] mx-auto mb-6" />
            <h3 className="text-2xl font-display font-medium text-[#1A1F1D] mb-2">No departments found</h3>
            <p className="text-[#5C6661]">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};
