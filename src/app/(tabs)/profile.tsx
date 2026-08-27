import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  ShieldCheck,
  Lock,
  Bell,
  HelpCircle,
  ChevronRight,
  LogOut,
  Settings,
  BookOpen,
  Award,
  CreditCard,
  QrCode,
  Sparkles,
  Calendar,
  Activity,
  FileText,
  CheckCircle2,
  Briefcase
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuthStore } from '../../core/auth/authStore';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';
import { RoleSwitcherModal } from '../../components/dashboard/RoleSwitcherModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;

  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of GRI Portal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const getRoleBadgeInfo = () => {
    if (!user) {
      return {
        roleLabel: 'Guest / Public Visitor',
        idLabel: 'Visitor ID',
        idValue: 'GUEST-2026',
        field1Label: 'Category',
        field1Value: 'Prospective / Public',
        field2Label: 'Access',
        field2Value: 'Public Portal',
        color: '#D97706',
      };
    }
    switch (user.role) {
      case 'STUDENT':
        return {
          roleLabel: 'Undergraduate Student',
          idLabel: 'Register Number',
          idValue: user.rollNumber || '21BCA042',
          field1Label: 'Programme',
          field1Value: user.program || 'BCA (Hons)',
          field2Label: 'Validity',
          field2Value: '2023 - 2026',
          color: '#2563EB',
        };
      case 'FACULTY':
        return {
          roleLabel: 'Academic Faculty',
          idLabel: 'Employee Code',
          idValue: user.rollNumber || 'EMP-FAC-1048',
          field1Label: 'Designation',
          field1Value: user.designation || 'Associate Professor',
          field2Label: 'Affiliation',
          field2Value: 'GRI Permanent Staff',
          color: '#059669',
        };
      case 'RESEARCH_SCHOLAR':
        return {
          roleLabel: 'Doctoral Research Scholar',
          idLabel: 'Ph.D. Reg. Number',
          idValue: user.rollNumber || '23PHDRD009',
          field1Label: 'Doctoral Category',
          field1Value: 'SRF (UGC Funded)',
          field2Label: 'Supervisor',
          field2Value: 'Dr. R. Subburaman',
          color: '#7C3AED',
        };
      case 'UNIVERSITY_ADMIN':
      case 'ADMIN':
      case 'SYSTEM_ADMIN':
      case 'DEPARTMENT_ADMIN':
      case 'WARDEN':
        return {
          roleLabel: 'Institutional Administrator',
          idLabel: 'Officer Code',
          idValue: user.rollNumber || 'ADM-REG-001',
          field1Label: 'Portfolio',
          field1Value: user.designation || 'Registrar & CAO',
          field2Label: 'Governance',
          field2Value: 'BoM / Admin Council',
          color: '#DC2626',
        };
      default:
        return {
          roleLabel: 'University Member',
          idLabel: 'ID Number',
          idValue: user.rollNumber || 'GRI-2026',
          field1Label: 'Role',
          field1Value: user.role,
          field2Label: 'Status',
          field2Value: 'Active',
          color: '#2563EB',
        };
    }
  };

  const badgeInfo = getRoleBadgeInfo();

  const getRoleMenuItems = () => {
    if (!user || user.role === 'STUDENT') {
      return [
        { title: 'My Courses & CBCS Grades', icon: BookOpen, color: '#2563EB', action: () => router.push('/(tabs)/academics' as any) },
        { title: 'ESE Examination Hall Ticket', icon: Award, color: '#059669', action: () => router.push('/(tabs)/home' as any) },
        { title: 'Fee Payments & Receipts', icon: CreditCard, color: '#D97706', action: () => router.push('/(tabs)/services' as any) },
        { title: 'Hostel Room & Mess Account', icon: ShieldCheck, color: '#7C3AED', action: () => router.push('/infrastructure/hostels' as any) },
      ];
    }
    if (user.role === 'FACULTY') {
      return [
        { title: 'Continuous Assessment (CIA) Marks', icon: FileText, color: '#2563EB', action: () => router.push('/(tabs)/home' as any) },
        { title: 'e-Leave & On-Duty Permissions', icon: Calendar, color: '#7C3AED', action: () => router.push('/(tabs)/home' as any) },
        { title: 'CAS Performance Appraisal & IRINS', icon: Award, color: '#059669', action: () => router.push('/research' as any) },
        { title: 'Mentee Student Performance Registry', icon: User, color: '#D97706', action: () => router.push('/(tabs)/academics' as any) },
      ];
    }
    if (user.role === 'RESEARCH_SCHOLAR') {
      return [
        { title: 'Doctoral Progress Reports & RAC', icon: FileText, color: '#7C3AED', action: () => router.push('/(tabs)/home' as any) },
        { title: 'Ph.D. Coursework & Examination', icon: Award, color: '#2563EB', action: () => router.push('/examination/phd_tracking' as any) },
        { title: 'Fellowship Claim Verification', icon: CheckCircle2, color: '#059669', action: () => router.push('/(tabs)/home' as any) },
        { title: 'Central Instrumentation (CIF) Lab Slots', icon: Sparkles, color: '#D97706', action: () => router.push('/(tabs)/home' as any) },
      ];
    }
    // Admin
    return [
      { title: 'Governance & Approval Queues', icon: CheckCircle2, color: '#DC2626', action: () => router.push('/admin/approval_queue' as any) },
      { title: 'Institutional Circular Dispatcher', icon: Bell, color: '#D97706', action: () => router.push('/(tabs)/home' as any) },
      { title: 'Backend Health & Diagnostics', icon: Activity, color: '#2563EB', action: () => router.push('/admin/diagnostics' as any) },
      { title: 'Admin Command Hub', icon: ShieldCheck, color: '#059669', action: () => router.push('/admin/dashboard' as any) },
    ];
  };

  const menuGroups = [
    {
      title: `${badgeInfo.roleLabel} Services`,
      items: getRoleMenuItems(),
    },
    {
      title: 'Preferences & System Security',
      items: [
        { title: 'Switch User Persona (Multi-User)', icon: Sparkles, color: '#2563EB', action: () => setRoleSwitcherOpen(true) },
        { title: 'Notification Channels', icon: Bell, color: '#059669', action: () => router.push('/notifications' as any) },
        { title: 'Security, 2FA & Privacy', icon: Lock, color: '#475569', action: () => {} },
        { title: 'Institutional Helpdesk & Grievances', icon: HelpCircle, color: '#DC2626', action: () => router.push('/contact' as any) },
      ]
    }
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 32 : 20, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeIn.duration(400)} className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-bold text-slate-900">Institutional Profile</Text>
              <Text className="text-xs text-slate-500 font-medium">Gandhigram Rural Institute Digital ID</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setRoleSwitcherOpen(true)}
              className="px-3.5 py-2 bg-white rounded-full shadow-xs border border-slate-200 flex-row items-center"
            >
              <Sparkles size={16} color={colors.primary} className="mr-1.5" />
              <Text className="text-xs font-bold text-primary-700">Switch Role</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Digital ID Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
            <View className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <View className="p-6">
                <View className="flex-row justify-between items-start mb-6">
                  <View className="bg-slate-900 px-3 py-1.5 rounded-xl">
                    <Text className="text-white text-[11px] font-bold tracking-widest uppercase">
                      Gandhigram Rural Institute
                    </Text>
                  </View>
                  <View className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <QrCode size={28} color={colors.primary} />
                  </View>
                </View>

                <View className="flex-row items-center mb-6">
                  <View className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 shadow-xs overflow-hidden mr-5">
                    <Image 
                      source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' }} 
                      style={{ width: '100%', height: '100%' }} 
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                      <Text className="text-2xl font-bold text-slate-900">
                        {user?.fullName || 'Vijay Kumar S.'}
                      </Text>
                    </View>
                    <View 
                      className="px-2.5 py-0.5 rounded-md self-start mb-1.5"
                      style={{ backgroundColor: `${badgeInfo.color}15` }}
                    >
                      <Text className="text-xs font-bold uppercase tracking-wider" style={{ color: badgeInfo.color }}>
                        {badgeInfo.roleLabel}
                      </Text>
                    </View>
                    <Text className="text-xs font-semibold text-slate-600">
                      {badgeInfo.idLabel}: <Text className="text-slate-900 font-bold">{badgeInfo.idValue}</Text>
                    </Text>
                    <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>
                      {user?.department || 'Dept. of Computer Science & Applications'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row bg-slate-50 rounded-2xl p-4 mt-2 border border-slate-200">
                  <View className="flex-1 border-r border-slate-200 pr-3">
                    <Text className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider font-bold">{badgeInfo.field1Label}</Text>
                    <Text className="text-slate-900 font-bold text-xs" numberOfLines={1}>{badgeInfo.field1Value}</Text>
                  </View>
                  <View className="flex-1 pl-4">
                    <Text className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider font-bold">{badgeInfo.field2Label}</Text>
                    <Text className="text-slate-900 font-bold text-xs" numberOfLines={1}>{badgeInfo.field2Value}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Menus */}
          {menuGroups.map((group, groupIdx) => (
            <Animated.View 
              key={groupIdx} 
              entering={FadeInDown.delay(200 + groupIdx * 100).duration(400)} 
              className="mb-8"
            >
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">
                {group.title}
              </Text>
              <View className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  const isLast = idx === group.items.length - 1;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={item.action}
                      activeOpacity={0.7}
                      className={`flex-row items-center justify-between p-4 bg-white ${!isLast ? 'border-b border-slate-100' : ''}`}
                    >
                      <View className="flex-row items-center flex-1 pr-2">
                        <View 
                          className="w-10 h-10 rounded-xl items-center justify-center mr-3.5"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <Icon size={18} color={item.color} />
                        </View>
                        <Text className="text-sm font-semibold text-slate-800 flex-1">{item.title}</Text>
                      </View>
                      <ChevronRight size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          ))}

          {/* Logout Action */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)} className="mb-10">
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.7}
              className="bg-red-50 border border-red-200 p-4 rounded-2xl flex-row items-center justify-center shadow-xs"
            >
              <LogOut size={18} color={colors.error} />
              <Text className="text-sm font-bold text-red-600 ml-2">Sign Out of GRI Portal</Text>
            </TouchableOpacity>
          </Animated.View>
          
        </View>
      </ScrollView>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        visible={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
      />

    </View>
  );
}
