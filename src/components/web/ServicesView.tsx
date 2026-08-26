import React from 'react';
import { useAppStore } from '../../core/store/appStore';
import { FileText, BookOpen, HelpCircle, Briefcase, ChevronRight, Building, Bus, DollarSign } from 'lucide-react';
import { AccessRestricted } from '../common/AccessRestricted';

export const ServicesView: React.FC = () => {
  const { currentUser, setLoginModalOpen } = useAppStore();

  const serviceCategories = [
    {
      title: 'Academic Services',
      items: [
        { id: 'exam', label: 'Examinations & Results', icon: <FileText className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
        { id: 'library', label: 'Library Catalog', icon: <BookOpen className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
        { id: 'certificates', label: 'Certificates (e-Sanad)', icon: <FileText className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
      ]
    },
    {
      title: 'Campus Life',
      items: [
        { id: 'hostel', label: 'Hostel Management', icon: <Building className="w-5 h-5 text-rose-500" />, bg: 'bg-rose-50' },
        { id: 'transport', label: 'Transport Schedule', icon: <Bus className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50' },
        { id: 'fees', label: 'Fee Payment', icon: <DollarSign className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'grievance', label: 'Samadhan (Grievances)', icon: <HelpCircle className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50' },
        { id: 'careers', label: 'Placements & Careers', icon: <Briefcase className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50' },
      ]
    }
  ];

  return (
    <div className="flex flex-col space-y-6 px-5 pt-4 pb-24  max-w-md mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Services</h2>
        <p className="text-sm text-gray-500">Quick access to campus facilities</p>
      </div>

      <div className="space-y-6">
        {serviceCategories.map((cat, i) => (
          <div key={i} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">{cat.title}</h3>
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              {cat.items.map((item, idx) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    if(currentUser.role === 'guest') setLoginModalOpen(true);
                    else alert(`Navigating to ${item.label}`);
                  }}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                    idx !== cat.items.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                      {item.icon}
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
