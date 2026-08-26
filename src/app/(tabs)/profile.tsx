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
  QrCode
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuthStore } from '../../core/auth/authStore';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';
import { Card } from '../../components/Card';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;

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

  const menuGroups = [
    {
      title: 'Academic Profile',
      items: [
        { title: 'My Courses & Grades', icon: BookOpen, color: colors.primary, action: () => router.push('/(tabs)/academics' as any) },
        { title: 'Certificates & Awards', icon: Award, color: colors.warning, action: () => {} },
        { title: 'Fee Payments', icon: CreditCard, color: colors.success, action: () => router.push('/(tabs)/services' as any) },
      ]
    },
    {
      title: 'Preferences & Security',
      items: [
        { title: 'Notification Settings', icon: Bell, color: colors.info, action: () => {} },
        { title: 'Security & Privacy', icon: Lock, color: colors.textSecondary, action: () => {} },
        { title: 'RBAC Scope & Role', icon: ShieldCheck, color: colors.tertiary, action: () => {} },
        { title: 'Help & Grievances', icon: HelpCircle, color: colors.secondary, action: () => router.push('/(tabs)/services' as any) },
      ]
    }
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 32 : 20, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeIn.duration(400)} className="flex-row items-center justify-between mb-6">
            <Text className="text-3xl font-bold text-slate-900">My Profile</Text>
            <TouchableOpacity className="p-3 bg-white rounded-full shadow-sm border border-slate-100">
              <Settings size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Digital ID Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
            <View className="bg-white border border-primary-200 rounded-3xl overflow-hidden shadow-sm">
              {/* Pattern Background */}
              <View className="absolute inset-0 opacity-5">
                <View className="absolute -right-20 -top-20 w-64 h-64 border-[40px] border-primary-900 rounded-full" />
                <View className="absolute -left-10 -bottom-10 w-40 h-40 border-[20px] border-primary-900 rounded-full" />
              </View>
              
              <View className="p-6">
                <View className="flex-row justify-between items-start mb-6">
                  <View className="bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
                    <Text className="text-primary-800 text-xs font-bold tracking-widest uppercase">
                      Gandhigram Rural Institute
                    </Text>
                  </View>
                  <QrCode size={32} color={colors.primary} />
                </View>

                <View className="flex-row items-center mb-6">
                  <View className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-primary-100 shadow-sm overflow-hidden mr-5">
                    <Image 
                      source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} 
                      style={{ width: '100%', height: '100%' }} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-slate-900 mb-1">
                      {user?.fullName || 'Vijay Kumar'}
                    </Text>
                    <Text className="text-primary-700 font-medium mb-1">
                      {user?.rollNumber || '21BCA042'} • {user?.role || 'STUDENT'}
                    </Text>
                    <Text className="text-sm text-slate-500" numberOfLines={1}>
                      {user?.department || 'Dept. of Computer Science'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row bg-slate-50 rounded-2xl p-4 mt-2 border border-slate-100">
                  <View className="flex-1 border-r border-slate-200">
                    <Text className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Programme</Text>
                    <Text className="text-slate-900 font-bold">BCA (Hons)</Text>
                  </View>
                  <View className="flex-1 pl-4">
                    <Text className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Validity</Text>
                    <Text className="text-slate-900 font-bold">2023 - 2026</Text>
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
              <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">
                {group.title}
              </Text>
              <View className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  const isLast = idx === group.items.length - 1;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={item.action}
                      activeOpacity={0.7}
                      className={`flex-row items-center justify-between p-4 bg-white ${!isLast ? 'border-b border-slate-50' : ''}`}
                    >
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-2xl bg-slate-50 items-center justify-center mr-4 border border-slate-100">
                          <Icon size={20} color={item.color} />
                        </View>
                        <Text className="text-base font-medium text-slate-800">{item.title}</Text>
                      </View>
                      <ChevronRight size={20} color={colors.textMuted} />
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
              className="bg-red-50 border border-red-100 p-4 rounded-2xl flex-row items-center justify-center shadow-sm"
            >
              <LogOut size={20} color={colors.error} />
              <Text className="text-base font-bold text-red-600 ml-2">Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>
          
        </View>
      </ScrollView>
    </View>
  );
}
