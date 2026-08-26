import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Users, Bell, CheckCircle, Clock, ShieldAlert, PlusCircle, ListOrdered, ArrowLeft, Send } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { apiClient } from '../../core/api';
import { themeTokens } from '../../core/theme/tokens';
import { Card } from '../../components/Card';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { colors } = themeTokens;
  const [stats, setStats] = useState({
    total_users: 12450,
    active_users: 11800,
    total_notifications: 245,
    pending_notifications: 3,
    sent_notifications: 238,
    delivery_rate_pct: '98.7%',
    failed_rate_pct: '1.3%',
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/admin/notifications/dashboard/stats');
      if (res.data) setStats(res.data);
    } catch {}
  };

  const triggerEmergency = () => {
    Alert.prompt(
      '🚨 Trigger Emergency Broadcast',
      'Enter high-priority alert message for ALL users:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'BROADCAST NOW',
          style: 'destructive',
          onPress: async (msg) => {
            if (!msg) return;
            try {
              await apiClient.post('/notifications/broadcast-emergency', {
                title: 'Campus Safety Notice',
                message: msg,
              });
              Alert.alert('Broadcast Sent', 'Emergency notification dispatched to all channels.');
              fetchStats();
            } catch (err: any) {
              Alert.alert('Broadcast Error', err?.message || 'Failed to dispatch emergency alert.');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100">
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Admin Dashboard</Text>
        <TouchableOpacity onPress={triggerEmergency} className="p-2 rounded-full bg-rose-50 border border-rose-200">
          <ShieldAlert size={18} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">System Overview</Text>
            
            <View className="flex-row flex-wrap justify-between mb-8">
              <Card elevation="sm" className="w-[48%] bg-white p-5 rounded-3xl mb-4 border-slate-100">
                <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-3 border border-blue-100">
                  <Users size={20} color="#3B82F6" />
                </View>
                <Text className="text-2xl font-black text-slate-900 mt-1">{stats.total_users}</Text>
                <Text className="text-xs font-semibold text-slate-500 mt-1">Total Users</Text>
              </Card>

              <Card elevation="sm" className="w-[48%] bg-white p-5 rounded-3xl mb-4 border-slate-100">
                <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-3 border border-emerald-100">
                  <Bell size={20} color={colors.success} />
                </View>
                <Text className="text-2xl font-black text-slate-900 mt-1">{stats.total_notifications}</Text>
                <Text className="text-xs font-semibold text-slate-500 mt-1">Alerts Sent</Text>
              </Card>

              <Card elevation="sm" className="w-[48%] bg-white p-5 rounded-3xl mb-4 border-slate-100">
                <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center mb-3 border border-amber-100">
                  <Clock size={20} color={colors.warning} />
                </View>
                <Text className="text-2xl font-black text-slate-900 mt-1">{stats.pending_notifications}</Text>
                <Text className="text-xs font-semibold text-slate-500 mt-1">Pending Approval</Text>
              </Card>

              <Card elevation="sm" className="w-[48%] bg-white p-5 rounded-3xl mb-4 border-slate-100">
                <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mb-3 border border-primary-100">
                  <CheckCircle size={20} color={colors.primary} />
                </View>
                <Text className="text-2xl font-black text-slate-900 mt-1">{stats.delivery_rate_pct}</Text>
                <Text className="text-xs font-semibold text-slate-500 mt-1">Delivery Success</Text>
              </Card>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Admin Actions</Text>

            <TouchableOpacity
              onPress={() => router.push('/admin/composer')}
              activeOpacity={0.8}
              className="bg-primary-600 p-5 rounded-3xl flex-row items-center justify-between mb-4 shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="bg-white/20 p-2.5 rounded-2xl">
                  <PlusCircle size={24} color="white" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-bold text-white mb-1">Create Notification</Text>
                  <Text className="text-[11px] text-primary-100 font-medium">Composer with target engine</Text>
                </View>
              </View>
              <View className="bg-white/10 p-2.5 rounded-full">
                <Send size={18} color="white" />
              </View>
            </TouchableOpacity>

            <Card
              onPress={() => router.push('/admin/approval_queue')}
              className="bg-white border-slate-100 p-5 rounded-3xl flex-row items-center justify-between mb-10"
              elevation="sm"
            >
              <View className="flex-row items-center">
                <View className="bg-amber-50 border border-amber-100 p-2.5 rounded-2xl">
                  <ListOrdered size={24} color={colors.warning} />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-bold text-slate-900 mb-1">Approval Queue</Text>
                  <Text className="text-[11px] font-semibold text-slate-500">{stats.pending_notifications} pending admin review</Text>
                </View>
              </View>
              <View className="bg-amber-100 px-3 py-1.5 rounded-full">
                <Text className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Review</Text>
              </View>
            </Card>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}
