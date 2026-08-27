import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, CheckCheck, Inbox, AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Header } from '../../components/Header';
import { apiClient } from '../../core/api';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';
import { Card } from '../../components/Card';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  attachment_url?: string;
  deep_link?: string;
  published_at?: string;
  read_status: string;
}

export default function AlertsScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'CIRCULARS' | 'EVENTS'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data && res.data.notifications) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch {
      setNotifications([
        { id: 'NOTIF-001', title: 'Semester Examination Timetable Published', message: 'The final semester exam timetable for Autumn 2026 is now available.', category: 'exam', priority: 'URGENT', published_at: new Date().toISOString(), read_status: 'unread' },
        { id: 'NOTIF-002', title: 'Campus Convocation Registration Open', message: 'Eligible candidates for 2026 Convocation can submit degree applications online.', category: 'academic', priority: 'NORMAL', published_at: new Date().toISOString(), read_status: 'read' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const markAllRead = async () => {
    try {
      await apiClient.post('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read_status: 'read' })));
    } catch {}
  };

  const filteredItems = notifications.filter((n) => {
    if (filter === 'UNREAD') return n.read_status === 'unread';
    if (filter === 'CIRCULARS') return n.category === 'circular' || n.category === 'academic';
    if (filter === 'EVENTS') return n.category === 'events' || n.category === 'event';
    return true;
  });

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="University Alerts & Notifications" subtitle={`Real-Time Announcements · ${unreadCount} Unread`} variant="white" />

      {/* Top Action Bar */}
      <View className="flex-row items-center justify-between px-6 py-3 bg-white border-b border-slate-100 shadow-sm z-20">
        <View className="flex-row items-center">
          <Bell size={18} color={colors.textPrimary} />
          <Text className="text-sm font-bold text-slate-800 ml-2 tracking-wide uppercase">Inbox ({notifications.length})</Text>
          {unreadCount > 0 && (
            <View className="ml-3 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              <Text className="text-[10px] font-bold text-rose-700 tracking-widest">{unreadCount} NEW</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead} className="flex-row items-center bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 transition">
          <CheckCheck size={16} color={colors.success} />
          <Text className="text-[11px] font-bold text-slate-600 ml-1.5 uppercase tracking-wider">Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 py-3 bg-white border-b border-slate-100 shadow-sm z-10">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'CIRCULARS', label: 'Academic & Circulars' },
            { id: 'EVENTS', label: 'Events' },
          ].map((item) => {
            const isActive = filter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setFilter(item.id as any)}
                className={`px-4 py-2 rounded-xl mr-2 border transition ${isActive ? 'bg-primary-50 border-primary-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                activeOpacity={0.7}
              >
                <Text className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-primary-800' : 'text-slate-500'}`}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: isTablet ? 24 : 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />}
      >
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          {isLoading ? (
            <Animated.View entering={FadeIn.duration(400)}>
              {[1, 2, 3].map(i => (
                <View key={i} className="p-5 rounded-2xl mb-4 bg-white border border-slate-100 shadow-sm opacity-60">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="w-16 h-5 bg-slate-200 rounded-md animate-pulse" />
                    <View className="w-12 h-4 bg-slate-100 rounded animate-pulse" />
                  </View>
                  <View className="w-3/4 h-5 bg-slate-200 rounded animate-pulse mb-3" />
                  <View className="w-full h-4 bg-slate-100 rounded animate-pulse mb-2" />
                  <View className="w-2/3 h-4 bg-slate-100 rounded animate-pulse" />
                </View>
              ))}
            </Animated.View>
          ) : filteredItems.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(400)} className="items-center justify-center py-24 bg-white border border-slate-100 rounded-3xl shadow-sm mt-4">
              <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-6">
                <Inbox size={32} color={colors.textMuted} />
              </View>
              <Text className="text-slate-800 font-bold text-lg">You're all caught up</Text>
              <Text className="text-slate-500 text-sm mt-2">No new notifications in this category.</Text>
            </Animated.View>
          ) : (
            filteredItems.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(index * 100).duration(400)}>
                <Card
                  onPress={() =>
                    router.push({
                      pathname: '/notifications/[id]',
                      params: {
                        id: item.id, title: item.title, message: item.message, category: item.category, priority: item.priority,
                        attachment_url: item.attachment_url, deep_link: item.deep_link, published_at: item.published_at,
                      },
                    })
                  }
                  variant="default"
                  className={`mb-4 ${item.read_status === 'unread' ? 'bg-primary-50/30 border-primary-200' : 'bg-white'}`}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-2">
                      <View className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                        <Text className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{item.category || 'General'}</Text>
                      </View>
                      {item.priority === 'URGENT' && (
                        <View className="bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md flex-row items-center">
                          <AlertCircle size={10} color={colors.error} />
                          <Text className="text-[10px] font-bold text-rose-700 uppercase tracking-widest ml-1">Urgent</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      {item.published_at ? new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </Text>
                  </View>
                  
                  <Text className="text-base font-bold text-slate-900 mb-2 leading-tight">{item.title}</Text>
                  <Text className="text-sm text-slate-500 leading-relaxed mb-4" numberOfLines={2}>{item.message}</Text>
                  
                  <View className="flex-row items-center justify-between pt-4 border-t border-slate-100">
                    <Text className="text-[11px] font-bold text-primary-700 uppercase tracking-widest">Tap to view details →</Text>
                    {item.read_status === 'unread' && <View className="w-2.5 h-2.5 rounded-full bg-primary-600 shadow-sm" />}
                  </View>
                </Card>
              </Animated.View>
            ))
          )}
          <View className="h-24" />
        </View>
      </ScrollView>
    </View>
  );
}
