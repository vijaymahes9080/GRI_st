import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { INSTITUTION_INFO, SCHOOLS_DATA } from '../../core/data/griMasterData';
import { 
  OFFICIAL_CAMPUS_GALLERY, 
  OFFICIAL_LEADERSHIP_PROFILES,
  GRI_CAMPUS_HERO_IMAGE 
} from '../../core/data/griMediaAssets';
import { GRIEmblem } from '../common/GRIEmblem';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  FileText, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Bell, 
  HeartHandshake, 
  Sprout, 
  Landmark, 
  Award,
  ChevronRight,
  ExternalLink,
  Flame,
  Camera,
  MapPin,
  Maximize2
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setTab, circulars, setSelectedDepartment, currentUser, setLoginModalOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'admissions' | 'exam' | 'academic'>('all');

  const importantCirculars = circulars.filter(c => c.isImportant).slice(0, 3);
  const featuredDepartments = SCHOOLS_DATA.flatMap(s => s.departments).slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      {/* Personalized Identity Welcome Card */}
      {currentUser.role !== 'guest' ? (
        <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-bold text-white text-lg shadow-lg border border-emerald-400/30">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white font-display">
                  Welcome back, {currentUser.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 capitalize font-mono">
                  {currentUser.role}
                </span>
                {currentUser.regNumber && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {currentUser.regNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.schoolName || 'School of Sciences'} • {currentUser.department}
                {currentUser.semester && ` • Semester ${currentUser.semester}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {currentUser.attendance !== undefined && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-500 text-[10px] block">Attendance</span>
                <span className="text-emerald-400 font-bold">{currentUser.attendance}%</span>
              </div>
            )}
            <button
              onClick={() => setTab('services')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
            >
              Academic Portal
            </button>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Switch Role
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-sky-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-white">Public Institutional View (Guest Mode)</p>
              <p className="text-slate-300">You are browsing open academic programs, circulars, and research facilities. Sign in for personalized courses, CIA internal marks, and hall tickets.</p>
            </div>
          </div>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold whitespace-nowrap transition shadow-sm flex-shrink-0"
          >
            Student / Staff Sign In
          </button>
        </div>
      )}

      {/* Hero Banner Section with Official Campus Heritage Imagery */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10">
        {/* Background Campus Photo with Deep Gradient Mask */}
        <div className="absolute inset-0 z-0">
          <img 
            src={GRI_CAMPUS_HERO_IMAGE} 
            alt="Gandhigram Rural Institute Campus" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/70" />
        </div>

        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-semibold backdrop-blur-sm">
              <Award className="w-3.5 h-3.5" />
              <span>NAAC 'A++' Accredited Deemed University (CGPA 3.61)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ministry of Education, Govt. of India</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <GRIEmblem className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 drop-shadow-xl" />
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
                The Gandhigram Rural Institute
              </h1>
              <p className="text-emerald-400 font-serif italic text-base sm:text-xl">
                "கிராமம் உயர நாடு உயரும்" — As the village rises, so the nation rises
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            Founded in 1956 by Dr. T.S. Soundram and Dr. G. Ramachandran under the guidance of Mahatma Gandhi. GRI integrates Higher Education with Gandhian Values, Organic Agrarian Sciences, Rural Livelihoods, and Cutting-Edge Science & Computing.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setTab('services')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-900/40 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>ESE Exam Timetables & Services</span>
            </button>

            <button
              onClick={() => setTab('explore')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Explore 28+ Departments</span>
            </button>

            <button
              onClick={() => setTab('ai_chat')}
              className="px-5 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-semibold text-sm border border-amber-500/40 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask GRI RuralGPT</span>
            </button>
          </div>
        </div>

        {/* Live News Ticker */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider flex-shrink-0 bg-rose-950/80 px-2.5 py-1 rounded border border-rose-900">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Urgent Notices</span>
          </div>
          <div className="text-xs text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap flex-1">
            {importantCirculars[0] ? (
              <span 
                onClick={() => setTab('alerts')}
                className="hover:text-emerald-400 cursor-pointer underline decoration-dotted underline-offset-4"
              >
                {importantCirculars[0].title} ({importantCirculars[0].publishDate})
              </span>
            ) : (
              'All academic schedules and regular classes are running as per calendar.'
            )}
          </div>
          <button 
            onClick={() => setTab('alerts')}
            className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>View All Circulars</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* Institutional Key Metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Schools of Study', value: INSTITUTION_INFO.campusStats.schools, icon: <GraduationCap className="w-4 h-4 text-emerald-400" /> },
          { label: 'Academic Depts', value: INSTITUTION_INFO.campusStats.departments, icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
          { label: 'Distinguished Faculty', value: `${INSTITUTION_INFO.campusStats.facultyMembers}+`, icon: <Users className="w-4 h-4 text-sky-400" /> },
          { label: 'Enrolled Students', value: `${INSTITUTION_INFO.campusStats.students}+`, icon: <Users className="w-4 h-4 text-purple-400" /> },
          { label: 'Ph.D. Scholars', value: `${INSTITUTION_INFO.campusStats.researchScholars}+`, icon: <Sparkles className="w-4 h-4 text-rose-400" /> },
          { label: 'Lush Green Campus', value: `${INSTITUTION_INFO.campusStats.campusAreaAcres} Acres`, icon: <Sprout className="w-4 h-4 text-lime-400" /> },
          { label: 'NAAC Ranking', value: '3.61 A++', icon: <Award className="w-4 h-4 text-amber-300" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center hover:border-slate-700 transition">
            <div className="flex justify-center mb-1.5">{stat.icon}</div>
            <div className="font-extrabold text-white text-base sm:text-lg">{stat.value}</div>
            <div className="text-[11px] text-slate-400 font-medium truncate">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Core Portals & Student Hub Tiles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-white">University Portals & Student Utilities</h2>
            <p className="text-xs text-slate-400">Direct gateways to academic, examination, hostel and grievance services</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ESE Examination Portal */}
          <div 
            onClick={() => setTab('services')}
            className="group bg-gradient-to-br from-slate-900 to-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition shadow-lg relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
              ESE Examinations & Grades
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Controller of Examinations timetable, hall tickets, CIA internal marks, and transcript verification.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1">
              <span>Access Exam Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admissions 2026-2027 */}
          <div 
            onClick={() => setTab('services')}
            className="group bg-gradient-to-br from-slate-900 to-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition shadow-lg relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/80 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
              Admissions 2026-27 Hub
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              CUET-UG/PG prospectus, B.Sc. Agri, MCA, MBA, B.Voc, & Ph.D. application guidelines and fee details.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 gap-1">
              <span>View Prospectus & Fees</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Central Library OPAC */}
          <div 
            onClick={() => setTab('services')}
            className="group bg-gradient-to-br from-slate-900 to-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-sky-500/50 cursor-pointer transition shadow-lg relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800/80 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-sky-400 transition-colors">
              Dr. Radhakrishnan Library
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Search 1,60,000+ volumes, Gandhi Archival collection, e-journals, DELNET and thesis repositories.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-sky-400 gap-1">
              <span>Open Library OPAC</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Shanti Sena & Rural Outreach */}
          <div 
            onClick={() => setTab('services')}
            className="group bg-gradient-to-br from-slate-900 to-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition shadow-lg relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/80 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">
              Shanti Sena & UBA Outreach
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Gandhian Peace Corps, Unnat Bharat Abhiyan village adoption, Krishi Vigyan Kendra farmer workshops.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 gap-1">
              <span>Explore Outreach</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Important Circulars + Featured Departments */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Latest Circulars */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                Latest Official Circulars
              </h2>
              <p className="text-xs text-slate-400">Notices released by Registrar, CoE, and Academic Council</p>
            </div>
            <button
              onClick={() => setTab('alerts')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({circulars.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {circulars.slice(0, 4).map((circ) => (
              <div
                key={circ.id}
                onClick={() => setTab('alerts')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      circ.category === 'EXAM' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                      circ.category === 'ADMISSIONS' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                      circ.category === 'TENDER' ? 'bg-sky-950 text-sky-300 border-sky-800' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {circ.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{circ.publishDate}</span>
                    {circ.isImportant && (
                      <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded">
                        URGENT
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm group-hover:text-emerald-300 transition">
                    {circ.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {circ.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition flex-shrink-0 mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Featured Schools & Leadership */}
        <div className="lg:col-span-5 space-y-6">
          {/* Institutional Leadership Card */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-400" />
              Institutional Leadership
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[10px]">Chancellor</span>
                  <strong className="text-slate-200 font-semibold text-sm">{INSTITUTION_INFO.chancellor}</strong>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Honorary</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[10px]">Vice-Chancellor</span>
                  <strong className="text-slate-200 font-semibold text-sm">{INSTITUTION_INFO.viceChancellor}</strong>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">Academic Head</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[10px]">Registrar</span>
                  <strong className="text-slate-200 font-semibold text-sm">{INSTITUTION_INFO.registrar}</strong>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Administration</span>
              </div>
            </div>
          </div>

          {/* Academic Departments Quick Card */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Top Academic Departments
              </h3>
              <button
                onClick={() => setTab('explore')}
                className="text-xs text-emerald-400 font-semibold hover:underline"
              >
                All 28+
              </button>
            </div>

            <div className="space-y-2">
              {featuredDepartments.map((dept) => (
                <div
                  key={dept.code}
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setTab('explore');
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800/80 hover:border-emerald-600/50 cursor-pointer flex items-center justify-between transition group"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                      {dept.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{dept.programmes.length} Programmes • HoD: {dept.head}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Official University Insignia & Symbolism (Sourced from ruraluniv.ac.in) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <GRIEmblem className="w-12 h-12 flex-shrink-0 drop-shadow-lg" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Official University Emblem & Insignia Symbolism
              </h2>
              <p className="text-xs text-slate-400">
                Official iconography defined by The Gandhigram Rural Institute (ruraluniv.ac.in)
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 self-start sm:self-auto">
            Official Source: ruraluniv.ac.in/logo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-pink-950/80 border border-pink-700/50 flex items-center justify-center text-xs font-bold text-pink-300">
                🌸
              </span>
              <span className="text-[10px] font-bold uppercase text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded">Core Center</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Book in a Lotus</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Signifies the centrality of enlightenment achieved through knowledge, higher education, and continuous learning.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-xs font-bold text-amber-300">
                🪔
              </span>
              <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">Top Center</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Sacred Lamp (Deepam)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Represents GRI's sacred commitment to disseminating wisdom and knowledge to the wider rural community.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-xs font-bold text-emerald-300">
                ☸️
              </span>
              <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">Left Quadrant</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Gandhian Charkha</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Symbolizes the Gandhian spirit, vision of self-reliance (Swadeshi), and village empowerment that governs the institute.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-xs font-bold text-amber-300">
                🌾
              </span>
              <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">Right Quadrant</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Traditional Plough</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Represents GRI's rural agrarian orientation and its focus on agricultural science, farm extension, and rural livelihoods.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-xs font-bold text-purple-300">
                ✨
              </span>
              <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded">Lotus Petals</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Kolam Art Motif</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Featured on top and bottom of the lotus, signifies femininity, art, and GRI's beginnings in training women as rural health workers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-sky-950/80 border border-sky-700/50 flex items-center justify-center text-xs font-bold text-sky-300">
                🔲
              </span>
              <span className="text-[10px] font-bold uppercase text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded">Flanks</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Concentric Squares</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Emphasizes the continuity and extension of learning to action (Nai Talim: bridging theory and practical field execution).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-teal-950/80 border border-teal-700/50 flex items-center justify-center text-xs font-bold text-teal-300">
                ⚕️
              </span>
              <span className="text-[10px] font-bold uppercase text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded">Lower Base</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Staff of Asclepius</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Signifies the enhancement of rural sanitation, public health, hygiene, and Kasturba Hospital medical extension.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 to-slate-950 border border-emerald-800/80 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded inline-block">Motto</span>
              <h4 className="text-sm font-bold text-white font-serif italic">"கிராமம் உயர நாடு உயரும்"</h4>
              <p className="text-xs text-emerald-300 font-medium">
                "As the village rises, so the nation rises"
              </p>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-emerald-900/60">
              Inscribed on the foundation seal of The Gandhigram Rural Institute (Estd 1956).
            </p>
          </div>
        </div>
      </section>

      {/* Official Campus Landmark Gallery & Research Infrastructure */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              <span>Campus Panorama & Research Infrastructure</span>
            </h2>
            <p className="text-xs text-slate-400">
              Visual overview of the 204-acre Gandhigram campus, DST-FIST instrumentation facilities, and ICAR-KVK farm.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full self-start sm:self-auto">
            Sourced from ruraluniv.ac.in
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICIAL_CAMPUS_GALLERY.map((photo) => (
            <div 
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-lg flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-700 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  {photo.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2 font-light">
                    {photo.caption}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>Gandhigram Campus</span>
                  </span>
                  <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                    <span>Verified Asset</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gandhian Pillars Showcase */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-white text-base">Nai Talim (Experiential Learning)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Education through productive work and village engagement. Every GRI graduate participates in hands-on village field placements.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-white text-base">Shanti Sena (Peace Brigade)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pioneering student peace corps trained in non-violent conflict resolution, disaster management, community policing, and social harmony.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-white text-base">Organic & Rural Technologies</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transferring bio-pesticides, solar power, watershed management, and micro-enterprises directly to grassroots farmers across Tamil Nadu.
          </p>
        </div>
      </section>
    </div>
  );
};
