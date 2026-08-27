import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  FileText,
  Calendar,
  CheckCircle2,
  CreditCard,
  Building,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Download,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '../Card';
import { themeTokens } from '../../core/theme/tokens';
import { User } from '../../core/auth/authStore';
import { ServiceActionModalData } from './ServiceActionModal';

interface StudentDashboardProps {
  user: User;
  onOpenService: (data: ServiceActionModalData) => void;
  onOpenRoleSwitcher: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onOpenService, onOpenRoleSwitcher }) => {
  const router = useRouter();
  const { colors } = themeTokens;

  const quickStats = [
    {
      label: 'Attendance',
      value: '88.4%',
      status: 'Eligible for ESE',
      statusColor: '#059669',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      icon: CheckCircle2,
      iconColor: '#059669',
    },
    {
      label: 'Cumulative CGPA',
      value: '8.72',
      status: '1st Class Distinction',
      statusColor: '#2563EB',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      icon: TrendingUp,
      iconColor: '#2563EB',
    },
    {
      label: 'CBCS Credits',
      value: '94 / 120',
      status: 'Semester VI Active',
      statusColor: '#7C3AED',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      icon: Layers,
      iconColor: '#7C3AED',
    },
    {
      label: 'Fee Dues',
      value: '₹0.00',
      status: 'Cleared (SBI Collect)',
      statusColor: '#059669',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      icon: CreditCard,
      iconColor: '#0D9488',
    },
  ];

  const studentModules = [
    {
      id: 'hall_ticket',
      title: 'ESE Hall Ticket Download',
      category: 'Examinations',
      desc: 'May 2026 End Semester Exam verified hall ticket with barcode.',
      icon: Download,
      color: '#2563EB',
      type: 'hall_ticket' as const,
      badge: 'Active Now',
    },
    {
      id: 'results',
      title: 'Semester Results & Marks',
      category: 'Academics',
      desc: 'View published CBCS grade sheets, SGPA, and cumulative marks.',
      icon: FileText,
      color: '#059669',
      type: 'results' as const,
      badge: 'Sem V Published',
    },
    {
      id: 'timetable',
      title: 'Class Timetable & Schedule',
      category: 'Academics',
      desc: 'Daily lecture slots, practical sessions, and faculty room matrix.',
      icon: Calendar,
      color: '#7C3AED',
      route: '/examination/timetable',
    },
    {
      id: 'fees',
      title: 'Fee Payment & Receipts',
      category: 'Finance',
      desc: 'Samarth ERP fee gateway, SBI Collect challans & tuition receipts.',
      icon: CreditCard,
      color: '#D97706',
      route: '/(tabs)/services',
    },
    {
      id: 'hostel',
      title: 'Hostel Out-Pass & Mess',
      category: 'Campus Life',
      desc: 'Digital gate out-pass generation, mess rebate & warden approvals.',
      icon: Building,
      color: '#EC4899',
      route: '/infrastructure/hostels',
    },
    {
      id: 'placements',
      title: 'Placement Drives & Internships',
      category: 'Career',
      desc: 'Campus recruitment notices, TCS/Infosys drives & resume upload.',
      icon: Briefcase,
      color: '#0284C7',
      route: '/placements',
      badge: '3 Drives Open',
    },
    {
      id: 'library',
      title: 'Central Library OPAC',
      category: 'Resources',
      desc: 'Book catalogue search, renewal status, e-ShodhSindhu & JSTOR.',
      icon: BookOpen,
      color: '#059669',
      route: '/facilities/library',
    },
    {
      id: 'grievance',
      title: 'Student Grievance & Redressal',
      category: 'Support',
      desc: 'Anti-Ragging helpline, ICC committee & mentor confidential inbox.',
      icon: ShieldCheck,
      color: '#DC2626',
      route: '/contact',
    },
  ];

  return (
    <View className="space-y-6">
      
      {/* Student Identity Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View className="bg-gradient-to-r from-blue-900 to-indigo-900 bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
          <View className="absolute right-0 bottom-0 opacity-10">
            <GraduationCap size={160} color="#FFFFFF" />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              <Text className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Student Portal Active
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
            <View className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 items-center justify-center mr-4">
              <Text className="text-xl font-bold text-white">
                {user.fullName.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white tracking-tight">{user.fullName}</Text>
              <Text className="text-xs text-blue-200 font-semibold">{user.rollNumber} • {user.semester || 'Semester VI'}</Text>
              <Text className="text-[11px] text-slate-300 mt-0.5">{user.department}</Text>
            </View>
          </View>

          {/* Banner inside ID card */}
          <View className="bg-white/10 rounded-2xl p-3 border border-white/10 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-2">
              <Clock size={16} color="#93C5FD" className="mr-2" />
              <Text className="text-xs text-white font-medium">
                Next Exam: <Text className="font-bold text-blue-200">CS301 Cloud Computing</Text> (May 14)
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onOpenService({
                id: 'hall_ticket',
                title: 'ESE Hall Ticket Download',
                category: 'Examinations',
                icon: Download,
                color: '#2563EB',
                type: 'hall_ticket',
              })}
              className="bg-blue-600 px-3 py-1.5 rounded-xl shadow-xs"
            >
              <Text className="text-[11px] font-bold text-white">Hall Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Quick Metrics Grid */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
          Academic Standing & Eligibility
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

      {/* Action Shortcut Bar */}
      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex-row items-center justify-between gap-2">
          <TouchableOpacity
            onPress={() => onOpenService({
              id: 'hall_ticket',
              title: 'ESE Hall Ticket Download',
              category: 'Examinations',
              icon: Download,
              color: '#2563EB',
              type: 'hall_ticket',
            })}
            className="flex-1 bg-blue-50 border border-blue-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-blue-700">Get Hall Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onOpenService({
              id: 'results',
              title: 'Semester Results & Marks',
              category: 'Academics',
              icon: FileText,
              color: '#059669',
              type: 'results',
            })}
            className="flex-1 bg-emerald-50 border border-emerald-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-emerald-700">Check Results</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/examinations')}
            className="flex-1 bg-purple-50 border border-purple-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-purple-700">Exam Portal</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Student Services & Samarth ERP Modules Grid */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-base font-bold text-slate-900">Official GRI Student Services</Text>
          <Text className="text-xs text-slate-400 font-semibold">Samarth ERP & Portal</Text>
        </View>

        <View className="space-y-3">
          {studentModules.map((item, index) => {
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
                        <View className="bg-emerald-100 px-2 py-0.5 rounded-md">
                          <Text className="text-[9px] font-bold text-emerald-800">{item.badge}</Text>
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
