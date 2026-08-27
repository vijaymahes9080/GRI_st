import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Briefcase,
  MapPin,
  Award,
  Users,
  ChevronRight,
  Building,
  Sparkles,
  ArrowRight,
  Compass
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '../Card';
import { themeTokens } from '../../core/theme/tokens';
import { GRI_BANNER_ANNOUNCEMENTS } from '../../core/data/griBlueprintData';

interface GuestPublicDashboardProps {
  onOpenRoleSwitcher: () => void;
}

export const GuestPublicDashboard: React.FC<GuestPublicDashboardProps> = ({ onOpenRoleSwitcher }) => {
  const router = useRouter();
  const { colors } = themeTokens;

  const quickPortals = [
    {
      title: 'Admissions 2026',
      desc: 'UG, PG, Ph.D. & Diploma Prospectus and CUET online portal',
      icon: GraduationCap,
      color: '#F16236',
      route: '/admissions',
      badge: 'Open Now',
    },
    {
      title: 'Extension & 3D Outreach',
      desc: 'Shanti Sena Peace Corps, VPP Village Adoption, KVK & Sanitary Park',
      icon: Compass,
      color: '#16A34A',
      route: '/extension',
      badge: 'Unique to GRI',
    },
    {
      title: 'Founders & Heritage',
      desc: 'Dr. Soundram, Dr. Ramachandran, Nai Talim & Gandhian Living',
      icon: Award,
      color: '#D97706',
      route: '/about/heritage',
    },
    {
      title: 'Central Instrumentation (CIF)',
      desc: 'FE-SEM, XRD, NMR 400MHz, FTIR & advanced characterization',
      icon: Sparkles,
      color: '#7C3AED',
      route: '/facilities/cif',
    },
    {
      title: 'Schools & Departments',
      desc: '7 Multi-disciplinary schools & 28 academic departments',
      icon: BookOpen,
      color: '#2563EB',
      route: '/(tabs)/academics',
    },
    {
      title: 'Museums & Art Galleries',
      desc: 'Mahatma Gandhi Constructive Works & Freedom Fighter Art Gallery',
      icon: Building,
      color: '#854D0E',
      route: '/facilities/museums',
    },
    {
      title: 'Central Facilities & Labs',
      desc: 'Dr. G. Ramachandran Library, 100-Acre Farm, Health Centre & Sports',
      icon: MapPin,
      color: '#0D9488',
      route: '/facilities',
    },
    {
      title: 'Examinations & CBCS',
      desc: 'ESE timetables, transcripts, e-SANAD & syllabus',
      icon: FileText,
      color: '#059669',
      route: '/(tabs)/examinations',
    },
    {
      title: 'Training & Placements',
      desc: 'Campus recruitment drives, career counselling & alumni network',
      icon: Briefcase,
      color: '#EC4899',
      route: '/placements',
    },
  ];

  const primaryAnnouncement = GRI_BANNER_ANNOUNCEMENTS[0];

  return (
    <View className="space-y-6">
      
      {/* Public Institutional Greeting Banner */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View className="bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
          <View className="absolute right-0 bottom-0 opacity-10">
            <Building size={160} color="#FFFFFF" />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-2" />
              <Text className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Official Institutional Portal
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onOpenRoleSwitcher}
              className="bg-white/10 px-3 py-1 rounded-full border border-white/20 flex-row items-center"
            >
              <Text className="text-[11px] font-bold text-white mr-1">Login / Roles</Text>
              <ChevronRight size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-bold text-white tracking-tight mb-1">
            The Gandhigram Rural Institute
          </Text>
          <Text className="text-xs text-slate-300 font-medium mb-4">
            Deemed to be University • Ministry of Education, Govt. of India
          </Text>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push('/admissions')}
              className="bg-primary-600 px-4 py-2.5 rounded-xl flex-row items-center justify-center shadow-xs"
            >
              <GraduationCap size={16} color="#FFFFFF" className="mr-1.5" />
              <Text className="text-xs font-bold text-white">Admissions 2026</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onOpenRoleSwitcher}
              className="bg-white/15 px-4 py-2.5 rounded-xl flex-row items-center justify-center border border-white/10"
            >
              <Users size={16} color="#FFFFFF" className="mr-1.5" />
              <Text className="text-xs font-bold text-white">Sign In as User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Accreditation Highlights */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <View className="flex-row gap-3">
          <Card elevation="sm" className="flex-1 bg-white p-4 rounded-2xl border border-slate-100" onPress={() => router.push('/about/naac')}>
            <View className="w-10 h-10 rounded-xl bg-emerald-50 items-center justify-center mb-2">
              <Award size={20} color={colors.success} />
            </View>
            <Text className="text-xl font-bold text-slate-900">NAAC 'A' Grade</Text>
            <Text className="text-xs text-slate-500 font-medium mt-0.5">Top-tier Accreditation</Text>
          </Card>
          <Card elevation="sm" className="flex-1 bg-white p-4 rounded-2xl border border-slate-100" onPress={() => router.push('/(tabs)/academics')}>
            <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mb-2">
              <BookOpen size={20} color={colors.info} />
            </View>
            <Text className="text-xl font-bold text-slate-900">7 Schools</Text>
            <Text className="text-xs text-slate-500 font-medium mt-0.5">28 Specialized Depts</Text>
          </Card>
        </View>
      </Animated.View>

      {/* Featured Admission Banner */}
      {primaryAnnouncement && (
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push(primaryAnnouncement.route as any)}
            className="bg-primary-50 p-5 rounded-3xl flex-row items-center justify-between overflow-hidden border border-primary-200"
          >
            <View className="flex-1 pr-4">
              <View className="flex-row items-center mb-1.5">
                <View className="bg-primary-600 px-2 py-0.5 rounded-sm mr-2">
                  <Text className="text-[9px] font-bold text-white uppercase tracking-wider">{primaryAnnouncement.tag}</Text>
                </View>
                <Text className="text-xs font-semibold text-primary-700">{primaryAnnouncement.date}</Text>
              </View>
              <Text className="text-primary-950 font-bold text-base mb-1">
                {primaryAnnouncement.title}
              </Text>
              <Text className="text-xs text-primary-800 leading-relaxed" numberOfLines={2}>
                {primaryAnnouncement.description}
              </Text>
            </View>
            <View className="bg-white p-3 rounded-full shadow-xs border border-primary-100">
              <ArrowRight size={18} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Institutional Exploration Portals */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-base font-bold text-slate-900">Explore GRI Portals</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
            <Text className="text-xs font-bold text-primary-600">All Modules</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-3">
          {quickPortals.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route as any)}
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
                    <View className="flex-row items-center gap-2 mb-0.5">
                      <Text className="text-sm font-bold text-slate-900">{item.title}</Text>
                      {item.badge && (
                        <View className="bg-orange-100 px-2 py-0.5 rounded-md">
                          <Text className="text-[9px] font-bold text-orange-800">{item.badge}</Text>
                        </View>
                      )}
                    </View>
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
