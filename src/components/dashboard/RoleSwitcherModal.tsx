import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { 
  GraduationCap, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Globe, 
  X, 
  Check, 
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react-native';
import { useAuthStore, DEMO_PROFILES } from '../../core/auth/authStore';
import { themeTokens } from '../../core/theme/tokens';

interface RoleSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ visible, onClose }) => {
  const { user, switchDemoRole } = useAuthStore();
  const { colors } = themeTokens;

  const currentRole = user?.role || 'GUEST';

  const roles = [
    {
      key: 'STUDENT',
      title: 'Student Portal',
      subtitle: 'Undergraduate, Postgraduate & Diploma (Samarth ERP)',
      userRef: 'Vijay Kumar S. (21BCA042)',
      department: 'Dept. of Computer Science & Applications',
      icon: GraduationCap,
      color: '#2563EB',
      badge: 'UG / PG Student',
    },
    {
      key: 'FACULTY',
      title: 'Faculty & Academic Staff',
      subtitle: 'Teaching, Continuous Assessment & Mentee Advisory',
      userRef: 'Dr. K. Arumugam (Associate Prof. & Head i/c)',
      department: 'School of Mathematics & Computer Sciences',
      icon: Briefcase,
      color: '#059669',
      badge: 'Teaching Faculty',
    },
    {
      key: 'RESEARCH_SCHOLAR',
      title: 'Research Scholar Portal',
      subtitle: 'Ph.D. Tracking, Fellowship Stipend & Publications',
      userRef: 'Ms. S. Meenakshi (SRF - UGC)',
      department: 'Dept. of Rural Development & Agriculture',
      icon: BookOpen,
      color: '#7C3AED',
      badge: 'Ph.D. Scholar',
    },
    {
      key: 'ADMIN',
      title: 'University Administration',
      subtitle: 'Registrar, Dean, HOD & Hostel Wardenship Command',
      userRef: 'Dr. R. Manickam (Registrar Office)',
      department: 'Central Administrative Governance',
      icon: ShieldCheck,
      color: '#DC2626',
      badge: 'Administrator',
    },
    {
      key: 'GUEST',
      title: 'Public Guest & Prospective Student',
      subtitle: 'Admissions 2026, NAAC/NIRF, Campus Maps & Alumni',
      userRef: 'General Public Visitor / Parent',
      department: 'Gandhigram Rural Institute Public Portal',
      icon: Globe,
      color: '#D97706',
      badge: 'Public Visitor',
    },
  ];

  const handleSelect = (key: any) => {
    switchDemoRole(key);
    onClose();
  };

  const isCurrentActive = (key: string) => {
    if (key === 'GUEST') return !user;
    if (key === 'ADMIN') return user?.role === 'UNIVERSITY_ADMIN' || user?.role === 'ADMIN' || user?.role === 'SYSTEM_ADMIN';
    return user?.role === key;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end sm:justify-center sm:items-center sm:p-4">
        <View className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100">
          
          {/* Header */}
          <View className="p-6 border-b border-slate-100 flex-row items-center justify-between bg-slate-50/70">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-2xl bg-primary-100 items-center justify-center mr-3 border border-primary-200">
                <Sparkles size={20} color={colors.primary} />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900">Switch User Persona</Text>
                <Text className="text-xs text-slate-500 font-medium">Select a GRI institutional role to experience tailored features</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full bg-slate-200/60 hover:bg-slate-200">
              <X size={18} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* List */}
          <ScrollView className="p-5 max-h-[70vh]" showsVerticalScrollIndicator={false}>
            <View className="space-y-3">
              {roles.map((item) => {
                const Icon = item.icon;
                const active = isCurrentActive(item.key);
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => handleSelect(item.key)}
                    activeOpacity={0.75}
                    className={`p-4 rounded-2xl border transition-all mb-3 ${
                      active 
                        ? 'bg-blue-50/50 border-primary-500 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row items-start flex-1 pr-2">
                        <View 
                          className="w-11 h-11 rounded-2xl items-center justify-center mr-3.5 shadow-xs"
                          style={{ backgroundColor: `${item.color}15`, borderWidth: 1, borderColor: `${item.color}30` }}
                        >
                          <Icon size={22} color={item.color} strokeWidth={2} />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                            <Text className="text-base font-bold text-slate-900">{item.title}</Text>
                            <View 
                              className="px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: `${item.color}15` }}
                            >
                              <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color }}>
                                {item.badge}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-xs font-semibold text-slate-700 mb-0.5">{item.userRef}</Text>
                          <Text className="text-[11px] text-slate-500 mb-1">{item.department}</Text>
                          <Text className="text-xs text-slate-400 italic">{item.subtitle}</Text>
                        </View>
                      </View>

                      {active ? (
                        <View className="w-7 h-7 rounded-full bg-primary-600 items-center justify-center shadow-xs">
                          <Check size={16} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      ) : (
                        <View className="w-7 h-7 rounded-full bg-slate-100 items-center justify-center">
                          <ChevronRight size={16} color="#94A3B8" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer note */}
          <View className="p-4 bg-slate-50 border-t border-slate-100 flex-row items-center justify-between">
            <Text className="text-xs text-slate-500 font-medium">
              Gandhigram Rural Institute • Multi-Role Access Control
            </Text>
            <TouchableOpacity onPress={onClose} className="px-4 py-2 bg-slate-200 rounded-xl">
              <Text className="text-xs font-bold text-slate-700">Done</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};
