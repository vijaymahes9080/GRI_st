import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  CheckSquare,
  Users,
  Calendar,
  BookOpen,
  Briefcase,
  FileCheck,
  ShieldCheck,
  Award,
  Bell,
  Clock,
  ChevronRight,
  TrendingUp,
  CreditCard,
  PlusCircle,
  FileText
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { themeTokens } from '../../core/theme/tokens';
import { User } from '../../core/auth/authStore';
import { ServiceActionModalData } from './ServiceActionModal';

interface FacultyDashboardProps {
  user: User;
  onOpenService: (data: ServiceActionModalData) => void;
  onOpenRoleSwitcher: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user, onOpenService, onOpenRoleSwitcher }) => {
  const router = useRouter();
  const { colors } = themeTokens;

  const quickStats = [
    {
      label: 'Assigned Courses',
      value: '4 Subjects',
      status: 'BCA & MCA CBCS',
      statusColor: '#059669',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      icon: BookOpen,
      iconColor: '#059669',
    },
    {
      label: 'Mentees / Wards',
      value: '28 Students',
      status: 'Advisory Active',
      statusColor: '#2563EB',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      icon: Users,
      iconColor: '#2563EB',
    },
    {
      label: 'CIA Submissions',
      value: '3 / 4 Done',
      status: '1 Pending COE Sign',
      statusColor: '#D97706',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      icon: FileCheck,
      iconColor: '#D97706',
    },
    {
      label: 'Leave Balance',
      value: '8 CL • 12 EL',
      status: 'Academic Year 2026',
      statusColor: '#7C3AED',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      icon: Calendar,
      iconColor: '#7C3AED',
    },
  ];

  const facultyModules = [
    {
      id: 'attendance_marking',
      title: 'Daily Attendance & Biometrics',
      category: 'Classroom',
      desc: 'Mark daily lecture attendance, verify biometric logs & proxy checks.',
      icon: CheckSquare,
      color: '#059669',
      type: 'generic' as const,
      badge: 'Today Active',
    },
    {
      id: 'cia_entry',
      title: 'Continuous Assessment (CIA) Entry',
      category: 'Evaluation',
      desc: 'Upload mid-term test scores, assignment weights & submit to COE.',
      icon: FileCheck,
      color: '#2563EB',
      type: 'cia_entry' as const,
      badge: 'Due Aug 31',
    },
    {
      id: 'faculty_leave',
      title: 'e-Leave & Duty Permission (OD)',
      category: 'Administration',
      desc: 'Apply for casual leave, special casual leave & conference duty.',
      icon: Calendar,
      color: '#7C3AED',
      type: 'faculty_leave' as const,
    },
    {
      id: 'syllabus_planner',
      title: 'CBCS Course Syllabus & Planner',
      category: 'Curriculum',
      desc: 'Lesson plans, learning outcomes, course materials & question bank.',
      icon: BookOpen,
      color: '#0D9488',
      route: '/academics/cbcs',
    },
    {
      id: 'mentee_tracking',
      title: 'Mentee Academic & Ward Audit',
      category: 'Student Welfare',
      desc: 'View ward attendance shortages, internal marks & parent counseling.',
      icon: Users,
      color: '#EC4899',
      type: 'generic' as const,
    },
    {
      id: 'research_grants',
      title: 'Research Grants & CAS Appraisal',
      category: 'R&D / Career',
      desc: 'UGC/DST funded projects, publications, IRINS profile & CAS scoring.',
      icon: Award,
      color: '#D97706',
      route: '/research',
    },
    {
      id: 'dept_broadcast',
      title: 'Department Circular Broadcaster',
      category: 'Notices',
      desc: 'Publish notices to departmental students, scholars and lab staff.',
      icon: Bell,
      color: '#DC2626',
      type: 'circular_broadcast' as const,
    },
    {
      id: 'salary_slip',
      title: 'Salary Slip & GPF / Tax Form 16',
      category: 'Finance',
      desc: 'Monthly payslips, Provident Fund statements & IT deductions.',
      icon: CreditCard,
      color: '#0284C7',
      type: 'generic' as const,
    },
  ];

  return (
    <View className="space-y-6">
      
      {/* Faculty Identity Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View className="bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
          <View className="absolute right-0 bottom-0 opacity-10">
            <Briefcase size={160} color="#FFFFFF" />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              <Text className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Faculty Portal Active
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onOpenRoleSwitcher}
              className="bg-white/10 px-3 py-1 rounded-full border border-white/20 flex-row items-center"
            >
              <Text className="text-[11px] font-bold text-white mr-1">Switch Role</Text>
              <ChevronRight size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-5">
            <View className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 items-center justify-center mr-4">
              <Text className="text-xl font-bold text-white">
                {user.fullName.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white tracking-tight">{user.fullName}</Text>
              <Text className="text-xs text-emerald-300 font-semibold">{user.designation || 'Associate Professor'}</Text>
              <Text className="text-[11px] text-slate-300 mt-0.5">{user.department}</Text>
            </View>
          </View>

          {/* Schedule notification */}
          <View className="bg-white/10 rounded-2xl p-3 border border-white/10 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-2">
              <Clock size={16} color="#A7F3D0" className="mr-2" />
              <Text className="text-xs text-white font-medium">
                Next: <Text className="font-bold text-emerald-200">CS-601 Cloud Computing</Text> (10:30 AM @ Room 204)
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onOpenService({
                id: 'cia_entry',
                title: 'Continuous Assessment (CIA) Entry',
                category: 'Evaluation',
                icon: FileCheck,
                color: '#2563EB',
                type: 'cia_entry',
              })}
              className="bg-emerald-600 px-3 py-1.5 rounded-xl shadow-xs"
            >
              <Text className="text-[11px] font-bold text-white">Mark CIA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Quick Metrics */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
          Academic Load & Mentorship Status
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <View 
                key={i} 
                className={`flex-1 min-w-[140px] p-4 rounded-2xl ${stat.bgColor} border ${stat.borderColor} shadow-xs`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</Text>
                  <Icon size={16} color={stat.iconColor} />
                </View>
                <Text className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</Text>
                <Text className="text-[11px] font-bold" style={{ color: stat.statusColor }}>{stat.status}</Text>
              </View>
            );
          })}
        </View>
      </Animated.View>

      {/* Quick Action Shortcuts */}
      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex-row items-center justify-between gap-2">
          <TouchableOpacity
            onPress={() => onOpenService({
              id: 'cia_entry',
              title: 'Continuous Assessment (CIA) Entry',
              category: 'Evaluation',
              icon: FileCheck,
              color: '#2563EB',
              type: 'cia_entry',
            })}
            className="flex-1 bg-blue-50 border border-blue-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-blue-700">Enter CIA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onOpenService({
              id: 'faculty_leave',
              title: 'e-Leave & Duty Permission (OD)',
              category: 'Administration',
              icon: Calendar,
              color: '#7C3AED',
              type: 'faculty_leave',
            })}
            className="flex-1 bg-purple-50 border border-purple-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-purple-700">Apply e-Leave</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onOpenService({
              id: 'dept_broadcast',
              title: 'Department Circular Broadcaster',
              category: 'Notices',
              icon: Bell,
              color: '#DC2626',
              type: 'circular_broadcast',
            })}
            className="flex-1 bg-red-50 border border-red-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-red-700">Dispatch Notice</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Faculty Modules */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-base font-bold text-slate-900">Faculty Academic & Administrative Tools</Text>
          <Text className="text-xs text-slate-400 font-semibold">Samarth Faculty Desk</Text>
        </View>

        <View className="space-y-3">
          {facultyModules.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.type) {
                    onOpenService({
                      id: item.id,
                      title: item.title,
                      category: item.category,
                      icon: item.icon,
                      color: item.color,
                      type: item.type,
                    });
                  } else if (item.route) {
                    router.push(item.route as any);
                  }
                }}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs flex-row items-center justify-between mb-3"
              >
                <View className="flex-row items-center flex-1 pr-3">
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: `${item.color}15`, borderWidth: 1, borderColor: `${item.color}30` }}
                  >
                    <Icon size={22} color={item.color} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 flex-wrap mb-0.5">
                      <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color }}>
                        {item.category}
                      </Text>
                      {item.badge && (
                        <View className="bg-amber-100 px-2 py-0.5 rounded-md">
                          <Text className="text-[9px] font-bold text-amber-800">{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</Text>
                    <Text className="text-xs text-slate-500 leading-tight">{item.desc}</Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

    </View>
  );
};
