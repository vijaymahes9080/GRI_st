import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { INSTITUTION_INFO, SCHOOLS_DATA } from '../../core/data/griMasterData';
import { GRIEmblem } from '../common/GRIEmblem';
import { GRI_CAMPUS_HERO_IMAGE, OFFICIAL_CAMPUS_GALLERY } from '../../core/data/griMediaAssets';
import { 
  Calendar, BookOpen, Clock, FileText, Bell, 
  ChevronRight, ArrowRight, ArrowUpRight, GraduationCap, MapPin, Search
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setTab, circulars, setSelectedDepartment, currentUser, setLoginModalOpen } = useAppStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const importantCirculars = circulars.filter(c => c.isImportant).slice(0, 3);
  const featuredDepartments = SCHOOLS_DATA.flatMap(s => s.departments).slice(0, 4);

  return (
    <div className="space-y-8 sm:space-y-12 pb-24 animate-fadeIn">
      
      {/* 1. Contextual Hero Section */}
      <section className="relative">
        {currentUser.role !== 'guest' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Primary Context (Left 2 cols) */}
            <div className="lg:col-span-2 bg-[#0F4C3A] rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl shadow-[#0F4C3A]/20">
              <div className="absolute top-0 right-0 w-96 h-64 sm:h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[280px]">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium tracking-tight mb-2">
                    {greeting}, {currentUser.name.split(' ')[0]}.
                  </h1>
                  <p className="text-white/70 text-lg">Your day at GRI</p>
                </div>

                <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/15 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white text-[#0F4C3A] flex flex-col items-center justify-center font-bold shadow-inner">
                      <span className="text-xs uppercase tracking-wider opacity-60">Now</span>
                      <span className="text-xl">10:00</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Data Structures & Algorithms</h3>
                      <p className="text-white/70 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Room C-204 • Prof. S. Ramesh
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>

            {/* Visual Data / Quick Stats (Right 1 col) */}
            <div className="flex flex-col gap-6">
              {/* Attendance */}
              <div className="bg-white rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 border border-[#E5EAE7] flex-1 flex flex-col justify-center items-center text-center shadow-sm">
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#F2F6F4" strokeWidth="12" fill="none" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke="#0F4C3A" strokeWidth="12" fill="none" 
                      strokeDasharray="351" strokeDashoffset={351 - (351 * (currentUser.attendance || 84)) / 100} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#1A1F1D]">{currentUser.attendance || 84}%</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#5C6661]">Attendance</h3>
                <p className="text-[#34D399] text-sm font-semibold mt-1">Healthy</p>
              </div>

              {/* Assignments */}
              <div className="bg-[#1A1F1D] rounded-3xl sm:rounded-[2rem] p-6 text-white flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-4xl font-display font-medium block">03</span>
                  <span className="text-sm text-white/60">Assignments due</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          /* Guest Hero */
          <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden group">
            <img 
              src={GRI_CAMPUS_HERO_IMAGE} 
              alt="GRI Campus" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[10s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C3A] via-[#0F4C3A]/60 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/20" />
            
            <div className="absolute inset-0 p-6 sm:p-16 flex flex-col justify-end">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6">
                  <GRIEmblem className="w-5 h-5 opacity-90" />
                  <span>Ministry of Education, Govt. of India</span>
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium text-white tracking-tight leading-[1.1] mb-6">
                  Education for<br />rural transformation.
                </h1>
                <div className="flex flex-wrap gap-4 items-center mt-10">
                  <button onClick={() => setLoginModalOpen(true)} className="px-8 py-4 rounded-full bg-white text-[#0F4C3A] font-bold text-base hover:bg-[#F2F6F4] transition-colors">
                    Sign in to Portal
                  </button>
                  <button onClick={() => setTab('explore')} className="px-8 py-4 rounded-full bg-black/20 backdrop-blur-md border border-white/30 text-white font-bold text-base hover:bg-black/30 transition-colors">
                    Explore Programmes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Intelligent Service Discovery */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-medium text-[#1A1F1D]">Essential Services</h2>
            <p className="text-[#5C6661] mt-2">Quick access to your academic utilities.</p>
          </div>
          <button onClick={() => setTab('services')} className="hidden sm:flex items-center gap-2 text-[#0F4C3A] font-semibold hover:bg-[#E5F0EB] px-4 py-2 rounded-full transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { id: 'timetable', title: 'Timetable', icon: <Calendar className="w-6 h-6" />, color: 'bg-[#FDF6E3]', textColor: 'text-[#B45309]' },
            { id: 'results', title: 'Results', icon: <GraduationCap className="w-6 h-6" />, color: 'bg-[#E0F2FE]', textColor: 'text-[#0369A1]' },
            { id: 'library', title: 'Library', icon: <BookOpen className="w-6 h-6" />, color: 'bg-[#F3E8FF]', textColor: 'text-[#7E22CE]' },
            { id: 'notices', title: 'Notices', icon: <Bell className="w-6 h-6" />, color: 'bg-[#FEF2F2]', textColor: 'text-[#BE123C]' },
          ].map((service) => (
            <div 
              key={service.id}
              onClick={() => setTab('services')}
              className={`${service.color} rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
            >
              <div className={`${service.textColor} mb-12 transform group-hover:scale-110 transition-transform origin-bottom-left`}>
                {service.icon}
              </div>
              <h3 className={`text-lg font-bold ${service.textColor}`}>{service.title}</h3>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className={`w-5 h-5 ${service.textColor}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Editorial Notices & Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:p-10">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-display font-medium text-[#1A1F1D] mb-8">Official Updates</h2>
          <div className="space-y-6">
            {circulars.slice(0, 3).map((circ, idx) => (
              <div 
                key={circ.id}
                onClick={() => setTab('alerts')}
                className="group cursor-pointer border-b border-[#E5EAE7] pb-6 last:border-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C3A]">
                    {circ.category}
                  </span>
                  <span className="text-xs text-[#5C6661]">• {circ.publishDate}</span>
                  {circ.isImportant && (
                    <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#1A1F1D] group-hover:text-[#0F4C3A] leading-snug transition-colors">
                  {circ.title}
                </h3>
              </div>
            ))}
            <button onClick={() => setTab('alerts')} className="flex items-center gap-2 text-[#0F4C3A] font-semibold hover:gap-3 transition-all mt-4">
              Read all circulars <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlight / Event Banner */}
        <div className="lg:col-span-7">
           <div className="h-full min-h-[300px] rounded-3xl sm:rounded-[2rem] overflow-hidden relative group cursor-pointer bg-[#1A1F1D]" onClick={() => setTab('explore')}>
             <img 
               src={OFFICIAL_CAMPUS_GALLERY[1]?.url || OFFICIAL_CAMPUS_GALLERY[0].url} 
               alt="Campus Event"
               referrerPolicy="no-referrer"
               className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-0 left-0 p-6 sm:p-8 lg:p-12 w-full">
               <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                 Campus Life
               </span>
               <h3 className="text-2xl sm:text-3xl font-display font-medium text-white mb-2 leading-tight">
                 Explore the 204-acre lush green Gandhigram campus.
               </h3>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
};
