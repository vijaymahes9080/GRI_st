import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShieldCheck,
  Bell,
  CheckCircle2,
  Users,
  Building,
  Activity,
  Server,
  FileCheck,
  Award,
  ChevronRight,
  PlusCircle,
  Database,
  Calendar,
  Lock,
  Layers,
  Scale
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { themeTokens } from '../../core/theme/tokens';
import { User } from '../../core/auth/authStore';
import { ServiceActionModalData } from './ServiceActionModal';

interface AdminDashboardViewProps {
  user: User;
  onOpenService: (data: ServiceActionModalData) => void;
  onOpenRoleSwitcher: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  user,
  onOpenService,
  onOpenRoleSwitcher,
}) => {
  const router = useRouter();
  const { colors } = themeTokens;

  const quickStats = [
    {
      label: 'Pending Approvals',
      value: '4 Circulars',
      status: '7 Staff Leaves',
      statusColor: '#DC2626',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      icon: Bell,
      iconColor: '#DC2626',
    },
    {
      label: 'Active Students',
      value: '3,420 Total',
      status: '98.2% Enrolled',
      statusColor: '#059669',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      icon: Users,
      iconColor: '#059669',
    },
    {
      label: 'Hostel Occupancy',
      value: '92% Filled',
      status: '1,480 Inmates',
      statusColor: '#2563EB',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      icon: Building,
      iconColor: '#2563EB',
    },
    {
      label: 'System Gateway',
      value: 'Online',
      status: 'Samarth API Synced',
      statusColor: '#059669',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      icon: Server,
      iconColor: '#0D9488',
    },
  ];

  const adminModules = [
    {
      id: 'circular_dispatch',
      title: 'Institutional Circular Dispatcher',
      category: 'Announcements',
      desc: 'Publish university circulars, exam notifications and emergency alerts.',
      icon: Bell,
      color: '#DC2626',
      type: 'circular_broadcast' as const,
      badge: 'Action Required',
    },
    {
      id: 'approval_queue',
      title: 'Leave & Out-Pass Approval Queue',
      category: 'Governance',
      desc: 'Review faculty duty leaves (OD), student hostel out-passes & permissions.',
      icon: FileCheck,
      color: '#D97706',
      route: '/admin/approval_queue',
      badge: '11 Pending',
    },
    {
      id: 'diagnostics',
      title: 'System Diagnostics & Microservices',
      category: 'Infrastructure',
      desc: 'Live health status, proxy inspection, port telemetry & API sync logs.',
      icon: Activity,
      color: '#2563EB',
      route: '/admin/diagnostics',
    },
    {
      id: 'enrollment_audit',
      title: 'Student Enrollment & CBCS Audit',
      category: 'Academics',
      desc: 'Roll strength, fee defaulter registers & attendance eligibility audit.',
      icon: Users,
      color: '#059669',
      route: '/academics',
    },
    {
      id: 'hostel_warden',
      title: 'Hostel Wardenship & Room Allotment',
      category: 'Residential',
      desc: 'Manage inmate allocations, mess billing & discipline committee records.',
      icon: Building,
      color: '#EC4899',
      route: '/infrastructure/hostels',
    },
    {
      id: 'iqac_compliance',
      title: 'NAAC & NIRF IQAC Compliance',
      category: 'Accreditation',
      desc: 'Annual Quality Assurance Report (AQAR) metrics and evidence repository.',
      icon: Award,
      color: '#7C3AED',
      route: '/about/naac',
    },
    {
      id: 'security_rbac',
      title: 'User Roles & Access Control (RBAC)',
      category: 'Security',
      desc: 'Provision staff accounts, elevate department admins & audit login trails.',
      icon: ShieldCheck,
      color: '#0284C7',
      route: '/admin/dashboard',
    },
    {
      id: 'grievance_cell',
      title: 'Grievance & Disciplinary Redressal',
      category: 'Compliance',
      desc: 'Internal Complaints Committee (ICC) & Ombudsman formal hearings.',
      icon: Scale,
      color: '#475569',
      route: '/contact',
    },
  ];

  return (
    <View className="space-y-6">
      
      {/* Admin Command Center Identity Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View className="bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
          <View className="absolute right-0 bottom-0 opacity-10">
            <ShieldCheck size={160} color="#FFFFFF" />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-red-400 mr-2 animate-pulse" />
              <Text className="text-xs font-bold text-red-400 uppercase tracking-widest">
                University Administration Portal
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
            <View className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/30 items-center justify-center mr-4">
              <Text className="text-xl font-bold text-white">
                {user.fullName.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white tracking-tight">{user.fullName}</Text>
              <Text className="text-xs text-red-300 font-semibold">{user.designation || 'Registrar & CAO'}</Text>
              <Text className="text-[11px] text-slate-300 mt-0.5">{user.department}</Text>
            </View>
          </View>

          {/* Quick status inside identity card */}
          <View className="bg-white/10 rounded-2xl p-3 border border-white/10 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-2">
              <Activity size={16} color="#FCA5A5" className="mr-2" />
              <Text className="text-xs text-white font-medium">
                Attention: <Text className="font-bold text-red-200">4 Notices</Text> awaiting digital sign-off
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onOpenService({
                id: 'circular_dispatch',
                title: 'Institutional Circular Dispatcher',
                category: 'Announcements',
                icon: Bell,
                color: '#DC2626',
                type: 'circular_broadcast',
              })}
              className="bg-red-600 px-3 py-1.5 rounded-xl shadow-xs"
            >
              <Text className="text-[11px] font-bold text-white">Broadcast</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Metrics */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
          Campus Operational Overview
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
            onPress={() => router.push('/admin/dashboard')}
            className="flex-1 bg-red-50 border border-red-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-red-700">Admin Hub</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/admin/approval_queue')}
            className="flex-1 bg-amber-50 border border-amber-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-amber-700">Approvals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/admin/diagnostics')}
            className="flex-1 bg-blue-50 border border-blue-200 py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-blue-700">Diagnostics</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Administration Modules */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-base font-bold text-slate-900">Institutional Governance & Command</Text>
          <Text className="text-xs text-slate-400 font-semibold">GRI Central Admin</Text>
        </View>

        <View className="space-y-3">
          {adminModules.map((item) => {
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
                        <View className="bg-red-100 px-2 py-0.5 rounded-md">
                          <Text className="text-[9px] font-bold text-red-800">{item.badge}</Text>
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
