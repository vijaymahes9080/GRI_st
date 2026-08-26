import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, CheckCircle, XCircle, Clock, Send } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { apiClient } from '../../core/api';
import { themeTokens } from '../../core/theme/tokens';
import { Card } from '../../components/Card';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  channels: string[];
  estimated_recipients: number;
  created_at: string;
}

export default function ApprovalQueueScreen() {
  const router = useRouter();
  const { colors } = themeTokens;
  const [queue, setQueue] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/notifications/approval-queue');
      if (res.data && res.data.notifications) {
        setQueue(res.data.notifications);
      }
    } catch {
      setQueue([
        {
          id: 'PEND-001',
          title: 'Department of Computer Science Academic Roster',
          message: 'Autumn 2026 semester timetable and faculty allocation for final year students.',
          category: 'academic',
          priority: 'NORMAL',
          channels: ['in_app', 'push', 'email'],
          estimated_recipients: 142,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (notifId: string) => {
    try {
      await apiClient.post(`/admin/notifications/${notifId}/approve`);
      Alert.alert('Approved', 'Notification approved and queued for broadcast.');
      fetchQueue();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.detail || 'Approval failed.');
    }
  };

  const handleReject = async (notifId: string) => {
    Alert.prompt('Reject Notification', 'Enter reason for rejection:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async (reason) => {
          if (!reason) return;
          try {
            await apiClient.post(`/admin/notifications/${notifId}/reject`, {
              rejection_reason: reason,
            });
            Alert.alert('Rejected', 'Notification returned to creator with rejection notice.');
            fetchQueue();
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.detail || 'Rejection failed.');
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100">
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Pending Approval Queue</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} className="mt-12" />
          ) : queue.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(400)} className="items-center justify-center py-24 bg-white border border-slate-100 rounded-3xl shadow-sm mt-4">
              <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-6">
                <Clock size={32} color={colors.textMuted} />
              </View>
              <Text className="text-slate-800 font-bold text-lg">Approval Queue Empty</Text>
              <Text className="text-slate-500 text-sm mt-2 text-center max-w-[250px]">There are no pending notifications requiring review.</Text>
            </Animated.View>
          ) : (
            queue.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(index * 100).duration(400)}>
                <Card className="bg-white border-slate-200 p-5 rounded-3xl mb-4" elevation="sm">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                      <Text className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                        Pending Approval
                      </Text>
                    </View>
                    <Text className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>

                  <Text className="text-base font-bold text-slate-900 mb-2 leading-tight">{item.title}</Text>
                  <Text className="text-sm text-slate-600 mb-4 leading-relaxed">{item.message}</Text>

                  <View className="flex-row items-center justify-between text-xs text-slate-500 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Text className="text-xs text-slate-500 font-medium">
                      Audience: <Text className="text-slate-800 font-bold">{item.estimated_recipients} Users</Text>
                    </Text>
                    <Text className="text-xs text-slate-500 font-medium">
                      Channels: <Text className="text-primary-700 font-bold uppercase">{item.channels?.join(', ')}</Text>
                    </Text>
                  </View>

                  <View className="flex-row items-center space-x-3 gap-3">
                    <TouchableOpacity
                      onPress={() => handleReject(item.id)}
                      className="flex-1 bg-white border border-rose-200 py-3 rounded-2xl flex-row items-center justify-center transition hover:bg-rose-50"
                    >
                      <XCircle size={18} color={colors.error} />
                      <Text className="text-xs font-bold text-rose-700 ml-1.5 uppercase tracking-wider">Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleApprove(item.id)}
                      className="flex-[1.5] bg-primary-600 border border-primary-700 py-3 rounded-2xl flex-row items-center justify-center shadow-sm"
                    >
                      <CheckCircle size={18} color="white" />
                      <Text className="text-xs font-bold text-white ml-1.5 uppercase tracking-wider">Approve</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </Animated.View>
            ))
          )}
          <View className="h-12" />
        </View>
      </ScrollView>
    </View>
  );
}
