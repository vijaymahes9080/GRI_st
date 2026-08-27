import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  Award,
  Calendar,
  FileCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Search,
  Download,
  CreditCard,
  FileText,
  Microscope,
  Layers,
  Globe
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { themeTokens } from '../../core/theme/tokens';
import { User } from '../../core/auth/authStore';
import { ServiceActionModalData } from './ServiceActionModal';

interface ResearchScholarDashboardProps {
  user: User;
  onOpenService: (data: ServiceActionModalData) => void;
  onOpenRoleSwitcher: () => void;
}

export const ResearchScholarDashboard: React.FC<ResearchScholarDashboardProps> = ({
  user,
  onOpenService,
  onOpenRoleSwitcher,
}) => {
  const router = useRouter();
  const { colors } = themeTokens;

  const quickStats = [
    {
      label: 'Doctoral Status',
      value: 'Synopsis Stage',
      status: 'RAC Verified',
      statusColor: '#7C3AED',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      icon: Award,
      iconColor: '#7C3AED',
    },
    {
      label: 'Progress Reports',
      value: '5 / 6 Approved',
      status: 'Final Report Due',
      statusColor: '#2563EB',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      icon: FileCheck,
      iconColor: '#2563EB',
    },
    {
      label: 'Fellowship Stipend',
      value: '₹31,000/mo',
      status: 'Credited (July)',
      statusColor: '#059669',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      icon: CreditCard,
      iconColor: '#059669',
    },
    {
      label: 'Publications',
      value: '3 Scopus',
      status: 'UGC-CARE Listed',
      statusColor: '#D97706',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      icon: BookOpen,
      iconColor: '#D97706',
    },
  ];

  const scholarModules = [
    {
      id: 'scholar_progress',
      title: 'RAC Progress Report & Synopsis',
      category: 'Research Milestone',
      desc: 'Submit half-yearly progress report & schedule Doctoral Committee review.',
      icon: FileCheck,
      color: '#7C3AED',
      type: 'scholar_progress' as const,
      badge: 'Submission Open',
    },
    {
      id: 'fellowship_attendance',
      title: 'Fellowship Attendance & Claim',
      category: 'Stipend / UGC',
      desc: 'Monthly biometric verification for UGC-JRF/SRF & Non-NET stipends.',
      icon: CheckCircle2,
      color: '#059669',
      type: 'generic' as const,
      badge: 'Due 1st of Month',
    },
    {
      id: 'phd_tracking',
      title: 'Ph.D. Lifecycle Tracker',
      category: 'Doctoral Cell',
      desc: 'Coursework exam marks, RAC approvals, thesis submission status.',
      icon: Award,
      color: '#2563EB',
      route: '/examination/phd_tracking',
    },
    {
      id: 'plagiarism_check',
      title: 'Urkund / Turnitin Plagiarism Check',
      category: 'Central Library',
      desc: 'Official certificate for synopsis and full thesis similarity index.',
      icon: ShieldCheck,
      color: '#0D9488',
      type: 'generic' as const,
    },
    {
      id: 'ethics_clearance',
      title: 'Institutional Ethics Committee (IEC)',
      category: 'Clearances',
      desc: 'Human & agricultural field trials clearance certificates & protocols.',
      icon: Layers,
      color: '#D97706',
      type: 'generic' as const,
    },
    {
      id: 'cif_booking',
      title: 'Central Instrumentation (CIF) Booking',
      category: 'Lab Infrastructure',
      desc: 'Reserve analytical instruments: SEM, FTIR, HPLC & XRD spectroscopy.',
      icon: Microscope,
      color: '#EC4899',
      type: 'generic' as const,
    },
    {
      id: 'shodhganga',
      title: 'Shodhganga & INFLIBNET Repository',
      category: 'Publications',
      desc: 'Search approved Ph.D. theses from GRI and national universities.',
      icon: Globe,
      color: '#0284C7',
      route: '/research',
    },
    {
      id: 'travel_grant',
      title: 'Conference Travel Grant Application',
      category: 'Grants',
      desc: 'Financial support for presenting papers at National/International symposia.',
      icon: FileText,
      color: '#DC2626',
      type: 'generic' as const,
    },
  ];

  return (
    <View className="space-y-6">
      
      {/* Scholar Identity Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View className="bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
          <View className="absolute right-0 bottom-0 opacity-10">
            <BookOpen size={160} color="#FFFFFF" />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-purple-400 mr-2 animate-pulse" />
              <Text className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                Research Scholar Portal Active
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
            <View className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 items-center justify-center mr-4">
              <Text className="text-xl font-bold text-white">
                {user.fullName.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white tracking-tight">{user.fullName}</Text>
              <Text className="text-xs text-purple-300 font-semibold">{user.designation || 'Senior Research Fellow'}</Text>
              <Text className="text-[11px] text-slate-300 mt-0.5">{user.rollNumber} • {user.department}</Text>
              {user.supervisor && (
                <Text className="text-[10px] text-purple-200 mt-1">Supervisor: {user.supervisor}</Text>
              )}
            </View>
          </View>

          {/* Next milestone banner */}
          <View className="bg-white/10 rounded-2xl p-3 border border-white/10 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-2">
              <Clock size={16} color="#C4B5FD" className="mr-2" />
              <Text className="text-xs text-white font-medium">
                Milestone: <Text className="font-bold text-purple-200">Pre-Ph.D. Presentation</Text> (Sep 15)
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onOpenService({
                id: 'scholar_progress',
                title: 'RAC Progress Report & Synopsis',
                category: 'Research Milestone',
                icon: FileCheck,
                color: '#7C3AED',
                type: 'scholar_progress',
              })}
              className="bg-purple-600 px-3 py-1.5 rounded-xl shadow-xs"
            >
              <Text className="text-[11px] font-bold text-white">Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Metrics */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
          Ph.D. Progress & Fellowship Health
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

      {/* Quick Action Bar */}
      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex-row items-center justify-between gap-2">
          <TouchableOpacity
            onPress={() => onOpenService({
              id: 'scholar_progress',
              title: 'RAC Progress Report & Synopsis',
              category: 'Research Milestone',
              icon: FileCheck,
              color: '#7C3AED',
              type: 'scholar_progress',
            })}
            className="flex-1 bg-purple-50 border border-purple-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-purple-700">RAC Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/examination/phd_tracking')}
            className="flex-1 bg-blue-50 border border-blue-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-blue-700">Ph.D. Tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/research')}
            className="flex-1 bg-emerald-50 border border-emerald-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-emerald-700">R&D Portal</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Research Scholar Modules */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-base font-bold text-slate-900">Doctoral Research & Fellowship Desk</Text>
          <Text className="text-xs text-slate-400 font-semibold">GRI Dean of Research</Text>
        </View>

        <View className="space-y-3">
          {scholarModules.map((item) => {
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
                        <View className="bg-purple-100 px-2 py-0.5 rounded-md">
                          <Text className="text-[9px] font-bold text-purple-800">{item.badge}</Text>
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
