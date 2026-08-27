import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Bell,
  GraduationCap,
  Users,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Globe,
  Sparkles,
  ChevronDown
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../../core/auth/authStore';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';
import { StudentDashboard } from '../../components/dashboard/StudentDashboard';
import { FacultyDashboard } from '../../components/dashboard/FacultyDashboard';
import { ResearchScholarDashboard } from '../../components/dashboard/ResearchScholarDashboard';
import { AdminDashboardView } from '../../components/dashboard/AdminDashboardView';
import { GuestPublicDashboard } from '../../components/dashboard/GuestPublicDashboard';
import { RoleSwitcherModal } from '../../components/dashboard/RoleSwitcherModal';
import { ServiceActionModal, ServiceActionModalData } from '../../components/dashboard/ServiceActionModal';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;

  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceActionModalData | null>(null);

  const getRoleHeaderBadge = () => {
    if (!user) {
      return {
        label: 'Public / Guest',
        icon: Globe,
        color: '#F59E0B',
        bg: 'bg-amber-500/20',
      };
    }
    switch (user.role) {
      case 'STUDENT':
        return {
          label: 'Student Portal',
          icon: GraduationCap,
          color: '#60A5FA',
          bg: 'bg-blue-500/20',
        };
      case 'FACULTY':
        return {
          label: 'Faculty Portal',
          icon: Briefcase,
          color: '#34D399',
          bg: 'bg-emerald-500/20',
        };
      case 'RESEARCH_SCHOLAR':
        return {
          label: 'Research Scholar',
          icon: BookOpen,
          color: '#C084FC',
          bg: 'bg-purple-500/20',
        };
      case 'UNIVERSITY_ADMIN':
      case 'ADMIN':
      case 'SYSTEM_ADMIN':
      case 'DEPARTMENT_ADMIN':
      case 'WARDEN':
        return {
          label: 'Admin Command',
          icon: ShieldCheck,
          color: '#F87171',
          bg: 'bg-red-500/20',
        };
      default:
        return {
          label: user.role,
          icon: Users,
          color: '#93C5FD',
          bg: 'bg-blue-500/20',
        };
    }
  };

  const roleMeta = getRoleHeaderBadge();
  const RoleIcon = roleMeta.icon;

  const renderDashboardByRole = () => {
    if (!user) {
      return <GuestPublicDashboard onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)} />;
    }

    switch (user.role) {
      case 'STUDENT':
        return (
          <StudentDashboard
            user={user}
            onOpenService={setSelectedService}
            onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
          />
        );
      case 'FACULTY':
        return (
          <FacultyDashboard
            user={user}
            onOpenService={setSelectedService}
            onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
          />
        );
      case 'RESEARCH_SCHOLAR':
        return (
          <ResearchScholarDashboard
            user={user}
            onOpenService={setSelectedService}
            onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
          />
        );
      case 'UNIVERSITY_ADMIN':
      case 'ADMIN':
      case 'SYSTEM_ADMIN':
      case 'DEPARTMENT_ADMIN':
      case 'WARDEN':
        return (
          <AdminDashboardView
            user={user}
            onOpenService={setSelectedService}
            onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
          />
        );
      default:
        return <GuestPublicDashboard onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)} />;
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      
      {/* Top Institutional Header */}
      <View className="bg-slate-900 pt-14 pb-4 px-5 z-10 shadow-sm border-b border-slate-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-2">
            <View className="w-10 h-10 bg-primary-600 rounded-2xl items-center justify-center mr-3 p-1 shadow-sm">
              <GraduationCap size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-xl font-bold text-white tracking-tight">GRI Portal</Text>
              <Text className="text-[10px] text-slate-300 uppercase font-semibold tracking-wider">
                Gandhigram Rural Institute
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Persona Switch Button */}
            <TouchableOpacity 
              onPress={() => setRoleSwitcherOpen(true)}
              className={`flex-row items-center px-3 py-1.5 rounded-full border border-white/20 ${roleMeta.bg}`}
              activeOpacity={0.8}
            >
              <RoleIcon size={14} color={roleMeta.color} />
              <Text className="text-xs font-bold text-white ml-1.5 mr-1" numberOfLines={1}>
                {roleMeta.label}
              </Text>
              <ChevronDown size={12} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/notifications')}
              className="bg-slate-800 p-2.5 rounded-full border border-slate-700"
            >
              <Bell size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Body */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: isTablet ? 32 : 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>
          
          {/* Smart Institutional Search */}
          <Animated.View entering={FadeInDown.delay(50).duration(400)} className="mb-5 mt-1">
            <View className="flex-row items-center bg-white h-13 rounded-2xl px-4 shadow-xs border border-slate-200">
              <Search size={18} color={colors.textMuted} />
              <TextInput 
                placeholder="Search courses, circulars, faculty, or services..."
                placeholderTextColor={colors.textMuted}
                className="flex-1 ml-3 h-full text-sm font-medium text-slate-900"
              />
            </View>
          </Animated.View>

          {/* Dynamic Role-Based View */}
          {renderDashboardByRole()}

        </View>
      </ScrollView>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        visible={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
      />

      {/* Interactive Service Action Modal */}
      <ServiceActionModal
        visible={!!selectedService}
        onClose={() => setSelectedService(null)}
        actionData={selectedService}
      />

    </View>
  );
}
