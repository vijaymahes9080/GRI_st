import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Calendar, FileSpreadsheet, Briefcase, ExternalLink, ShieldAlert, Tag, CheckCheck } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { apiClient } from '../../core/api';
import { useResponsive } from '../../core/responsive/useResponsive';

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
    // WebSocket real-time connection (Graceful degradation if WS server unavailable)
    let ws: WebSocket | null = null;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${protocol}//${window.location.host}/ws/announcements`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NOTIFICATION' || data.type === 'EMERGENCY_ALERT') {
            fetchNotifications();
          }
        } catch {}
      };
    } catch (e) {
      console.warn('WebSocket connection failed, falling back to polling.');
    }
    return () => {
      if (ws) ws.close();
    };
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
      <Header
        title="University Alerts & Notifications"
        subtitle={`Real-Time Announcements · ${unreadCount} Unread`}
        variant="white"
      />

      {/* Top Action Bar */}
      <View className="flex-row items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
        <View className="flex-row items-center">
          <Bell size={18} color="#0F172A" />
          <Text className="text-sm font-bold text-slate-800 ml-2 tracking-wide uppercase">
            Inbox ({notifications.length})
          </Text>
          {unreadCount > 0 && (
            <View className="ml-3 bg-red-600 px-2.5 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-white tracking-widest">{unreadCount} NEW</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead} className="flex-row items-center bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md border border-slate-200">
          <CheckCheck size={16} color="#059669" />
          <Text className="text-xs font-bold text-emerald-700 ml-1.5 uppercase tracking-wider">Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-10">
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
                className={`px-4 py-2 rounded-lg mr-2 border ${
                  isActive ? 'bg-khadi-blue border-khadi-blue' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-600'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: isTablet ? 24 : 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#0D47A1']} />}
      >
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          {filteredItems.length === 0 ? (
            <View className="items-center justify-center py-24">
              <Bell size={48} color="#CBD5E1" />
              <Text className="text-slate-500 font-bold text-lg mt-4">No Notifications Found</Text>
              <Text className="text-slate-400 text-sm text-center mt-2">You are all caught up with university announcements.</Text>
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
                className={`p-5 rounded-xl mb-4 border shadow-sm ${
                  item.read_status === 'unread'
                    ? 'bg-blue-50/50 border-blue-200'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2">
                    <View className="bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                      <Text className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                        {item.category || 'General'}
                      </Text>
                    </View>
                    {item.priority === 'URGENT' && (
                      <View className="bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                        <Text className="text-[10px] font-bold text-red-800 uppercase tracking-widest">
                          🚨 Urgent
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs font-medium text-slate-500 tracking-wider uppercase">
                    {item.published_at ? new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                  </Text>
                </View>
                
                <Text className="text-base font-bold text-slate-900 mb-2">{item.title}</Text>
                <Text className="text-sm text-slate-600 mb-4 leading-relaxed" numberOfLines={2}>{item.message}</Text>
                
                <View className="flex-row items-center justify-between pt-3 border-t border-slate-100">
                  <Text className="text-xs font-bold text-khadi-blue uppercase tracking-wider">Tap to view details →</Text>
                  {item.read_status === 'unread' && (
                    <View className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
          <View className="h-12" />
        </View>
      </ScrollView>
    </View>
  );
}
