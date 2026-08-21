import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Calendar, FileSpreadsheet, Briefcase, ExternalLink, ShieldAlert, Tag, CheckCheck } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { apiClient } from '../../core/api';

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
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'CIRCULARS' | 'EVENTS'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data && res.data.notifications) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch {
      // Offline fallback mock data
      setNotifications([
        {
          id: 'NOTIF-001',
          title: 'Semester Examination Timetable Published',
          message: 'The final semester exam timetable for Autumn 2026 is now available on the portal.',
          category: 'exam',
          priority: 'URGENT',
          published_at: new Date().toISOString(),
          read_status: 'unread',
        },
        {
          id: 'NOTIF-002',
          title: 'Campus Convocation Registration Open',
          message: 'Eligible candidates for 2026 Convocation can submit degree applications online.',
          category: 'academic',
          priority: 'NORMAL',
          published_at: new Date().toISOString(),
          read_status: 'read',
        },
      ]);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // WebSocket real-time connection
    const ws = new WebSocket('ws://localhost:8000/ws/announcements');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NOTIFICATION' || data.type === 'EMERGENCY_ALERT') {
          fetchNotifications();
        }
      } catch {}
    };

    return () => ws.close();
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
    <View className="flex-1 bg-gray-50">
      <Header
        title="University Alerts & Notifications"
        subtitle={`Real-Time Announcements · ${unreadCount} Unread`}
        variant="green"
      />

      {/* Top Action Bar */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <Bell size={18} color="#518214" />
          <Text className="text-xs font-bold text-gray-800 ml-1.5">
            Inbox ({notifications.length})
          </Text>
          {unreadCount > 0 && (
            <View className="ml-2 bg-red-600 px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-white">{unreadCount} NEW</Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={markAllRead} className="flex-row items-center">
          <CheckCheck size={16} color="#518214" />
          <Text className="text-xs font-bold text-[#518214] ml-1">Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                className={`px-3.5 py-1.5 rounded-xl mr-2 border ${
                  isActive ? 'bg-[#518214] border-[#518214]' : 'bg-gray-100 border-gray-200'
                }`}
              >
                <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#518214']} />}
      >
        {filteredItems.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Bell size={48} color="#94a3b8" />
            <Text className="text-gray-500 font-bold text-base mt-3">No Notifications Found</Text>
            <Text className="text-gray-400 text-xs text-center mt-1">You are all caught up with university announcements.</Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: '/notifications/[id]',
                  params: {
                    id: item.id,
                    title: item.title,
                    message: item.message,
                    category: item.category,
                    priority: item.priority,
                    attachment_url: item.attachment_url,
                    deep_link: item.deep_link,
                    published_at: item.published_at,
                  },
                })
              }
              className={`p-4 rounded-xl mb-3 border ${
                item.read_status === 'unread'
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-white border-gray-200'
              } shadow-sm`}
            >
              <View className="flex-row items-center justify-between mb-1.5">
                <View className="flex-row items-center space-x-2">
                  <Text className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                    {item.category || 'General'}
                  </Text>
                  {item.priority === 'URGENT' && (
                    <Text className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-md uppercase">
                      🚨 Urgent
                    </Text>
                  )}
                </View>
                <Text className="text-[11px] text-gray-400">
                  {item.published_at ? new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </Text>
              </View>

              <Text className="text-sm font-bold text-gray-900 mb-1">{item.title}</Text>
              <Text className="text-xs text-gray-600 mb-2" numberOfLines={2}>{item.message}</Text>

              <View className="flex-row items-center justify-between pt-1 border-t border-gray-100">
                <Text className="text-[11px] font-bold text-[#518214]">Tap to view details →</Text>
                {item.read_status === 'unread' && (
                  <View className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
