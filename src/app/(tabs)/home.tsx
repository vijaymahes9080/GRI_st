import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Bell,
  Calendar,
  BookOpen,
  FileText,
  CreditCard,
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;

  const quickActions = [
    { title: 'Timetable', icon: Calendar, color: '#3B82F6', route: '/(tabs)/academics' },
    { title: 'Attendance', icon: TrendingUp, color: '#10B981', route: '/(tabs)/academics' },
    { title: 'Results', icon: FileText, color: '#8B5CF6', route: '/(tabs)/examinations' },
    { title: 'Fees', icon: CreditCard, color: '#F59E0B', route: '/(tabs)/services' },
    { title: 'Library', icon: BookOpen, color: '#EC4899', route: '/(tabs)/services' },
    { title: 'Placements', icon: Briefcase, color: '#14B8A6', route: '/(tabs)/profile' },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 32 : 20, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          {/* Header Section */}
          <Animated.View entering={FadeIn.duration(400)} className="flex-row items-center justify-between mb-8">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden mr-4 border-2 border-white shadow-sm">
                <Image 
                  source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} 
                  style={{ width: '100%', height: '100%' }} 
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-slate-500 mb-0.5">Good morning,</Text>
                <Text className="text-xl font-bold text-slate-900">Vijay Kumar</Text>
              </View>
            </View>
            
            <TouchableOpacity className="p-3 bg-white rounded-full shadow-sm border border-slate-100">
              <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full z-10 border border-white" />
              <Bell size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Smart Search */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
            <View className="flex-row items-center bg-white h-14 rounded-2xl px-4 shadow-sm border border-slate-100">
              <Search size={20} color={colors.textMuted} />
              <TextInput 
                placeholder="Search courses, faculty, or notices..."
                placeholderTextColor={colors.textMuted}
                className="flex-1 ml-3 h-full text-base font-medium text-slate-900"
              />
            </View>
          </Animated.View>

          {/* Important Notice */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
            <View className="bg-primary-500 p-5 rounded-3xl flex-row items-center justify-between shadow-lg shadow-primary-500/20 overflow-hidden">
              <View className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full" />
              <View className="flex-1 pr-6 z-10">
                <Text className="text-xs font-bold text-primary-100 tracking-widest uppercase mb-1.5">
                  End Semester
                </Text>
                <Text className="text-white font-bold text-lg mb-2">
                  Hall Tickets Available
                </Text>
                <Text className="text-sm text-primary-100 leading-relaxed">
                  Download your hall ticket from the examination portal before May 15th.
                </Text>
              </View>
              <TouchableOpacity className="bg-white p-3 rounded-full shadow-sm z-10">
                <ArrowRight size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Academic Progress */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-slate-900">Today's Overview</Text>
            </View>
            <View className="flex-row gap-4">
              <Card elevation="sm" className="flex-1 bg-white p-5 rounded-3xl" onPress={() => {}}>
                <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-3">
                  <TrendingUp size={20} color={colors.success} />
                </View>
                <Text className="text-3xl font-bold text-slate-900">92%</Text>
                <Text className="text-sm font-medium text-slate-500 mt-1">Attendance</Text>
              </Card>
              <Card elevation="sm" className="flex-1 bg-white p-5 rounded-3xl" onPress={() => {}}>
                <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mb-3">
                  <Clock size={20} color={colors.warning} />
                </View>
                <Text className="text-sm font-bold text-slate-900 mb-1" numberOfLines={1}>CS301 - Data Structures</Text>
                <Text className="text-xs font-medium text-slate-500 mb-2">10:30 AM • Room 402</Text>
                <View className="bg-orange-100 px-2 py-1 rounded self-start">
                  <Text className="text-xs font-bold text-orange-700">Next Class</Text>
                </View>
              </Card>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-slate-900">Quick Actions</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => router.push(action.route as any)}
                    style={{ width: isTablet ? 'calc(25% - 12px)' : 'calc(33.333% - 11px)', alignItems: 'center' }}
                    activeOpacity={0.7}
                  >
                    <View className="w-16 h-16 rounded-2xl bg-white items-center justify-center shadow-sm border border-slate-100 mb-2">
                      <Icon size={26} color={action.color} strokeWidth={2} />
                    </View>
                    <Text className="text-xs font-semibold text-slate-600 text-center">{action.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* Campus Gateway */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)} className="mb-10">
            <Card 
              onPress={() => router.push('/(tabs)/discover')}
              className="bg-primary-50 p-6 rounded-3xl flex-row items-center justify-between overflow-hidden border border-primary-100"
              elevation="none"
            >
              <View className="absolute right-0 top-0 opacity-5">
                <MapPin size={120} color={colors.primary} />
              </View>
              <View className="flex-1 pr-6 z-10">
                <Text className="text-lg font-bold text-primary-900 mb-1.5">Campus Map & Services</Text>
                <Text className="text-sm text-primary-700 leading-relaxed">
                  Navigate facilities, find departments, and access institutional services.
                </Text>
              </View>
              <View className="bg-white p-4 rounded-full z-10 shadow-sm border border-primary-100">
                <MapPin size={24} color={colors.primary} />
              </View>
            </Card>
          </Animated.View>
          
        </View>
      </ScrollView>
    </View>
  );
}
