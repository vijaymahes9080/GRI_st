import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Search, 
  MapPin, 
  Building2, 
  Bell, 
  Calendar, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  Sprout,
  BookOpen,
  Microscope,
  Sparkles,
  Award,
  ChevronRight,
  Layers,
  HeartHandshake
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';
import { GRI_EXTENSION_CENTRES, GRI_CENTRAL_FACILITIES_INFO } from '../../core/data/griBlueprintData';

export default function CampusScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;
  const [searchQuery, setSearchQuery] = useState('');

  const institutionalHubs = [
    { 
      title: 'Extension & Outreach', 
      icon: Sprout, 
      color: '#16A34A', 
      desc: 'Shanti Sena, VPP, KVK & Sanitary Park', 
      route: '/extension' 
    },
    { 
      title: 'Heritage & Founders', 
      icon: Award, 
      color: '#D97706', 
      desc: 'Dr. Soundram, Dr. Ramachandran & Nai Talim', 
      route: '/about/heritage' 
    },
    { 
      title: 'Central Facilities', 
      icon: Microscope, 
      color: '#2563EB', 
      desc: 'Central Library, CIF Lab & 100-Acre Farm', 
      route: '/facilities' 
    },
    { 
      title: 'Museums & Galleries', 
      icon: Building2, 
      color: '#7C3AED', 
      desc: 'Constructive Programme & Freedom Fighters', 
      route: '/facilities/museums' 
    },
    { 
      title: 'Academic Schools', 
      icon: BookOpen, 
      color: '#0D9488', 
      desc: '7 Schools & 28 Specialized Departments', 
      route: '/academics' 
    },
    { 
      title: 'Governance & NAAC', 
      icon: ShieldCheck, 
      color: '#DC2626', 
      desc: 'Board of Management & A++ Accreditation', 
      route: '/about/naac' 
    },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 32 : 16, paddingTop: 50, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeIn.duration(400)} className="mb-5">
            <Text className="text-xs font-bold text-emerald-800 tracking-wider uppercase">GRI Institutional Knowledge</Text>
            <Text className="text-3xl font-extrabold text-slate-900 mt-0.5">Discover Campus</Text>
            <Text className="text-xs text-slate-500 mt-1">Explore beyond admissions: History, Tripillar extension, research centres & campus life.</Text>
          </Animated.View>

          {/* Search Input */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
            <View className="flex-row items-center bg-white h-13 rounded-2xl px-4 shadow-sm border border-slate-200">
              <Search size={20} color={colors.textMuted} />
              <TextInput 
                placeholder="Search centres, facilities, extension wings..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 h-full text-sm font-medium text-slate-900"
              />
            </View>
          </Animated.View>

          {/* Featured Tripillar Banner */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)} className="mb-6">
            <TouchableOpacity 
              activeOpacity={0.85} 
              onPress={() => router.push('/extension')}
              className="bg-[#1B5E20] rounded-3xl p-5 shadow-sm overflow-hidden"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="bg-white/20 px-2.5 py-1 rounded-lg">
                  <Text className="text-emerald-100 text-[10px] font-bold tracking-wider uppercase">Unique 3D System</Text>
                </View>
                <Layers size={20} color="#A7F3D0" />
              </View>
              <Text className="text-xl font-bold text-white mb-1">Instruction • Research • Extension</Text>
              <Text className="text-xs text-emerald-100 leading-relaxed mb-3">
                Experience Gandhigram's live laboratory: Shanti Sena peace training, 35+ adopted villages in VPP, and ICAR Krishi Vigyan Kendra.
              </Text>
              <View className="flex-row items-center gap-1.5 self-start bg-white px-3 py-1.5 rounded-xl">
                <Text className="text-xs font-bold text-emerald-900">Explore Extension Wings</Text>
                <ChevronRight size={14} color="#064E3B" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Institutional Hubs Grid */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
            <Text className="text-base font-bold text-slate-900 mb-3.5">Campus Encyclopedic Hubs</Text>
            <View className="gap-3">
              {institutionalHubs.map((hub, idx) => {
                const Icon = hub.icon;
                return (
                  <TouchableOpacity 
                    key={idx} 
                    activeOpacity={0.85}
                    onPress={() => router.push(hub.route as any)}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center flex-1 pr-3">
                      <View className="w-12 h-12 rounded-2xl items-center justify-center mr-3.5" style={{ backgroundColor: `${hub.color}15` }}>
                        <Icon size={22} color={hub.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-slate-900 mb-0.5">{hub.title}</Text>
                        <Text className="text-xs font-medium text-slate-500">{hub.desc}</Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color="#94A3B8" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* Key Facts of Gandhigram */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
            <Text className="text-base font-bold text-slate-900 mb-3">Gandhigram at a Glance</Text>
            <View className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-sm gap-3">
              {[
                { label: 'Founders', val: 'Dr. T.S. Soundram & Dr. G. Ramachandran (1956)' },
                { label: 'Deemed University Status', val: '1976 (Under Section 3 of UGC Act, 1956)' },
                { label: 'Campus Area', val: '204 Acres Green Biosphere in Dindigul Valley' },
                { label: 'Unique Feature', val: 'World’s only University with Shanti Sena Peace Corps' },
                { label: 'Service Coverage', val: '35+ Adopted Villages for Rural Development' },
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start pb-2 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <Text className="text-xs font-bold text-slate-700 w-36">{item.label}</Text>
                  <Text className="text-xs font-semibold text-emerald-800 flex-1">{item.val}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}

