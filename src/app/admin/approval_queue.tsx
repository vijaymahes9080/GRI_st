import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, Send } from 'lucide-react-native';
import { apiClient } from '../../core/api';

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
    <View className="flex-1 bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-slate-800">
          <ArrowLeft size={20} color="#94a3b8" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Pending Approval Queue</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 p-5">
        {loading ? (
          <ActivityIndicator size="large" color="#10b981" className="mt-12" />
        ) : queue.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Clock size={48} color="#64748b" />
            <Text className="text-slate-400 font-bold text-base mt-3">Approval Queue Empty</Text>
            <Text className="text-slate-500 text-xs text-center mt-1">There are no pending notifications requiring review.</Text>
          </View>
        ) : (
          queue.map((item) => (
            <View key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase">
                  Pending Approval
                </Text>
                <Text className="text-xs text-slate-500">{new Date(item.created_at).toLocaleTimeString()}</Text>
              </View>

              <Text className="text-base font-bold text-white mb-1.5">{item.title}</Text>
              <Text className="text-xs text-slate-300 mb-3">{item.message}</Text>

              <View className="flex-row items-center justify-between text-xs text-slate-400 mb-4 bg-slate-800/60 p-2.5 rounded-xl">
                <Text className="text-xs text-slate-400 font-medium">
                  Audience: <Text className="text-white font-bold">{item.estimated_recipients} Recipients</Text>
                </Text>
                <Text className="text-xs text-slate-400 font-medium">
                  Channels: <Text className="text-emerald-400 font-bold">{item.channels?.join(', ')}</Text>
                </Text>
              </View>

              <View className="flex-row items-center space-x-3">
                <TouchableOpacity
                  onPress={() => handleReject(item.id)}
                  className="flex-1 bg-red-600/20 border border-red-600/40 py-2.5 rounded-xl flex-row items-center justify-center"
                >
                  <XCircle size={18} color="#ef4444" />
                  <Text className="text-xs font-bold text-red-400 ml-1.5">Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleApprove(item.id)}
                  className="flex-1 bg-emerald-600 py-2.5 rounded-xl flex-row items-center justify-center"
                >
                  <CheckCircle size={18} color="white" />
                  <Text className="text-xs font-bold text-white ml-1.5">Approve & Broadcast</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
