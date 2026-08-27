import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Briefcase, 
  ChevronRight, 
  Building, 
  Bus, 
  DollarSign, 
  Award,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ServiceDetailModal, ServiceType } from './ServiceDetailModal';

export const ServicesView: React.FC = () => {
  const { currentUser, setLoginModalOpen, activeServiceModal, setActiveServiceModal } = useAppStore();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const activeService = selectedService || activeServiceModal;

  const handleOpenService = (serviceId: ServiceType) => {
    if (currentUser.role === 'guest') {
      setLoginModalOpen(true);
      return;
    }
    setSelectedService(serviceId);
  };

  const handleCloseService = () => {
    setSelectedService(null);
    if (setActiveServiceModal) setActiveServiceModal(null);
  };

  const serviceCategories: {
    title: string;
    description: string;
    items: {
      id: ServiceType;
      label: string;
      description: string;
      tag: string;
      icon: React.ReactNode;
      bg: string;
      tagColor: string;
    }[];
  }[] = [
    {
      title: 'Academic & Evaluation',
      description: 'Official examination records, library holdings, and verified credentials',
      items: [
        { 
          id: 'exam', 
          label: 'Examinations & Results', 
          description: 'Semester marks, SGPA/CGPA, ESE hall tickets, timetable & revaluation',
          tag: 'CoE Portal',
          icon: <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />, 
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
          tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        },
        { 
          id: 'library', 
          label: 'Library Catalog & E-Journals', 
          description: 'Search 180,000+ volumes, renew active loans, access INFLIBNET & IEEE',
          tag: '180K+ Books',
          icon: <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />, 
          bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
          tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
        },
        { 
          id: 'certificates', 
          label: 'Certificates (e-Sanad & DigiLocker)', 
          description: 'Apply for Bonafide, Transfer, Medium of Instruction & verified transcripts',
          tag: 'Instant e-Sanad',
          icon: <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, 
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
          tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        },
      ]
    },
    {
      title: 'Campus Living & Logistics',
      description: 'Hostel gate management, transport network, and academic fees',
      items: [
        { 
          id: 'hostel', 
          label: 'Hostel & Digital Out-Pass', 
          description: 'Room allocation, warden approval workflow, mess menus & QR gate tokens',
          tag: 'Gate Security QR',
          icon: <Building className="w-5 h-5 text-rose-600 dark:text-rose-400" />, 
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
          tagColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
        },
        { 
          id: 'transport', 
          label: 'Transport Schedule & Bus Pass', 
          description: 'Madurai/Dindigul bus fleet, route stops, semester bus pass & live GPS track',
          tag: '6 Live Routes',
          icon: <Bus className="w-5 h-5 text-amber-600 dark:text-amber-400" />, 
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
          tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
        },
        { 
          id: 'fees', 
          label: 'Fee Payment & e-Receipts', 
          description: 'Tuition, examination and hostel dues, instant UPI/SBI payment & tax receipts',
          tag: 'SBI & UPI Gateway',
          icon: <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />, 
          bg: 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400',
          tagColor: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
        },
      ]
    },
    {
      title: 'Support, Redressal & Career',
      description: 'Institutional student welfare and placement recruitment',
      items: [
        { 
          id: 'grievance', 
          label: 'Samadhan Grievances & Redressal', 
          description: 'Confidential issue escalation, SLA tracking, and University Grievance Cell',
          tag: 'UGC Samadhan',
          icon: <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />, 
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
          tagColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
        },
        { 
          id: 'careers', 
          label: 'Placements & Career Cell', 
          description: 'Active campus recruitment drives, 1-click applications, and verified CV export',
          tag: 'Active Drives',
          icon: <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />, 
          bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
          tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
        },
      ]
    }
  ];

  return (
    <div className="flex flex-col space-y-6 px-4 sm:px-6 pt-5 pb-24 max-w-3xl mx-auto">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Campus Services</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              Interactive Portals
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Click any service module below to access real-time applications, verified records, and gate passes.
          </p>
        </div>
      </div>

      {/* Categories & Service Items */}
      <div className="space-y-6">
        {serviceCategories.map((cat, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-baseline justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300">
                {cat.title}
              </h3>
              <span className="text-[11px] text-gray-400 dark:text-slate-500">
                {cat.items.length} Modules
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
              {cat.items.map((item) => (
                <div 
                  key={item.id}
                  id={`service-item-${item.id}`}
                  onClick={() => handleOpenService(item.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-3 flex items-center gap-1.5 text-gray-400 group-hover:text-blue-600 transition-colors">
                    <span className="hidden sm:inline text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Details
                    </span>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dedicated Interactive Detail Modal */}
      <ServiceDetailModal
        service={activeService}
        isOpen={Boolean(activeService)}
        onClose={handleCloseService}
      />

    </div>
  );
};
