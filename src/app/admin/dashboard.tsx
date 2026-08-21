import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Users, Bell, CheckCircle, Clock, ShieldAlert, PlusCircle, ListOrdered, ArrowLeft, Send } from 'lucide-react-native';
import { apiClient } from '../../core/api';

export default function AdminDashboardScreen() {
  const router = useRouter();
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
      if (res.data) {
        setStats(res.data);
      }
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
    <View className="flex-1 bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-slate-800">
          <ArrowLeft size={20} color="#94a3b8" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">GRI Admin Dashboard</Text>
        <TouchableOpacity onPress={triggerEmergency} className="p-2 rounded-full bg-red-600">
          <ShieldAlert size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5">
        {/* KPI Grid */}
        <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">System Overview</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="w-[48%] bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-3">
            <Users size={22} color="#38bdf8" />
            <Text className="text-2xl font-black text-white mt-2">{stats.total_users}</Text>
            <Text className="text-xs text-slate-400 font-medium">Total Registered Users</Text>
          </View>

          <View className="w-[48%] bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-3">
            <Bell size={22} color="#10b981" />
            <Text className="text-2xl font-black text-white mt-2">{stats.total_notifications}</Text>
            <Text className="text-xs text-slate-400 font-medium">Dispatched Alerts</Text>
          </View>

          <View className="w-[48%] bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-3">
            <Clock size={22} color="#f59e0b" />
            <Text className="text-2xl font-black text-white mt-2">{stats.pending_notifications}</Text>
            <Text className="text-xs text-slate-400 font-medium">Pending Approval</Text>
          </View>

          <View className="w-[48%] bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-3">
            <CheckCircle size={22} color="#a855f7" />
            <Text className="text-2xl font-black text-white mt-2">{stats.delivery_rate_pct}</Text>
            <Text className="text-xs text-slate-400 font-medium">Delivery Success Rate</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Admin Actions</Text>

        <TouchableOpacity
          onPress={() => router.push('/admin/composer')}
          className="bg-emerald-600 p-4 rounded-2xl flex-row items-center justify-between mb-3 shadow-lg shadow-emerald-900/30"
        >
          <View className="flex-row items-center">
            <PlusCircle size={24} color="white" />
            <View className="ml-3">
              <Text className="text-base font-bold text-white">Create Official Notification</Text>
              <Text className="text-xs text-emerald-100">Composer with target engine & channels</Text>
            </View>
          </View>
          <Send size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/admin/approval_queue')}
          className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center">
            <ListOrdered size={24} color="#f59e0b" />
            <View className="ml-3">
              <Text className="text-base font-bold text-white">Approval Queue</Text>
              <Text className="text-xs text-slate-400">{stats.pending_notifications} pending admin review</Text>
            </View>
          </View>
          <View className="bg-amber-500/20 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-amber-400">Review</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
