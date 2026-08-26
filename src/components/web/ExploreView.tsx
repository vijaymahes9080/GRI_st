import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { SCHOOLS_DATA } from '../../core/data/griMasterData';
import { Search, ChevronRight, BookOpen } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { setSelectedDepartment } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col space-y-4 px-5 pt-4 pb-24  max-w-md mx-auto">
      
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Academics</h2>
        <p className="text-sm text-gray-500">Explore 28+ Departments</p>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses or departments..."
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="space-y-6 pt-2">
        {SCHOOLS_DATA.map((school) => {
          const filteredDepts = school.departments.filter(dept => 
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.programmes.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          
          if (filteredDepts.length === 0) return null;

          return (
            <div key={school.id} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 ml-1">
                {school.name}
              </h3>
              
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                {filteredDepts.map((dept, idx) => (
                  <div 
                    key={dept.code}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                      idx !== filteredDepts.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{dept.name}</h4>
                        <p className="text-[11px] text-gray-500">{dept.programmes.length} Programmes</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
