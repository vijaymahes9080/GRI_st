import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MapPin, Building2, Bell, Calendar, GraduationCap, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';

export default function CampusScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;
  const [searchQuery, setSearchQuery] = useState('');
  
  const campusModules = [
    { title: 'Departments', icon: Building2, color: colors.primary, desc: 'Schools & Faculties' },
    { title: 'Notices', icon: Bell, color: colors.warning, desc: 'Circulars & Announcements' },
    { title: 'Events', icon: Calendar, color: colors.info, desc: 'Seminars & Workshops' },
    { title: 'Alumni', icon: GraduationCap, color: colors.success, desc: 'Network & Chapters' },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 32 : 20, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeIn.duration(400)} className="mb-6">
            <Text className="text-sm font-medium text-slate-500 mb-1 tracking-wider uppercase">Directory & Services</Text>
            <Text className="text-3xl font-bold text-slate-900">Campus</Text>
          </Animated.View>

          {/* Search */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
            <View className="flex-row items-center bg-white h-14 rounded-2xl px-4 shadow-sm border border-slate-100">
              <Search size={20} color={colors.textMuted} />
              <TextInput 
                placeholder="Search campus directory..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 h-full text-base font-medium text-slate-900"
              />
            </View>
          </Animated.View>

          {/* Interactive Map Entry */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
            <TouchableOpacity activeOpacity={0.8} className="bg-primary-50 border border-primary-100 rounded-3xl overflow-hidden shadow-sm h-48">
              <View className="absolute right-0 top-0 opacity-5">
                <MapPin size={200} color={colors.primary} />
              </View>
              <View className="flex-1 p-6 justify-end z-10">
                <View className="bg-white/80 px-3 py-1.5 rounded-lg self-start border border-primary-200/50 mb-3">
                  <Text className="text-primary-700 text-xs font-bold tracking-widest uppercase">Interactive</Text>
                </View>
                <Text className="text-2xl font-bold text-primary-900 mb-1">Campus Map</Text>
                <Text className="text-primary-700 font-medium">Navigate to departments & facilities</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Modules Grid */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
            <Text className="text-lg font-bold text-slate-900 mb-4">Explore</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {campusModules.map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <Card 
                    key={idx} 
                    className="bg-white p-5 shadow-sm border border-slate-100 flex-row items-center"
                    style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}
                    onPress={() => {}}
                  >
                    <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: `${mod.color}15` }}>
                      <Icon size={24} color={mod.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-slate-900 mb-0.5">{mod.title}</Text>
                      <Text className="text-sm font-medium text-slate-500">{mod.desc}</Text>
                    </View>
                    <ChevronRightIcon size={20} color={colors.textMuted} />
                  </Card>
                );
              })}
            </View>
          </Animated.View>

          {/* Recent Notices Preview */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} className="mb-10">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-slate-900">Recent Notices</Text>
              <Text className="text-sm font-semibold text-primary-600">View All</Text>
            </View>
            <View className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
              {[1, 2, 3].map((_, idx) => (
                <TouchableOpacity key={idx} className={`p-4 flex-row ${idx !== 2 ? 'border-b border-slate-50' : ''}`} activeOpacity={0.7}>
                  <View className="w-2 h-2 rounded-full bg-warning-500 mt-2 mr-3" />
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-slate-900 mb-1 leading-tight">Semester Registration Deadline Extended</Text>
                    <Text className="text-xs font-medium text-slate-500">2 days ago • Academic</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}

function ChevronRightIcon(props) {
  return <ArrowRight {...props} />;
}
