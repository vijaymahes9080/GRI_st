import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Bell, Calendar, Paperclip, ExternalLink, ShieldAlert, Tag, Share2 } from 'lucide-react-native';

export default function NotificationDetailScreen() {
  const router = useRouter();
  const { id, title, message, category, priority, attachment_url, deep_link, published_at } = useLocalSearchParams<{
    id: string;
    title: string;
    message: string;
    category?: string;
    priority?: string;
    attachment_url?: string;
    deep_link?: string;
    published_at?: string;
  }>();

  const handleDeepLink = () => {
    if (!deep_link) return;
    if (deep_link.startsWith('/')) {
      router.push(deep_link as any);
    } else {
      Linking.openURL(deep_link);
    }
  };

  const getPriorityColor = () => {
    switch ((priority || '').toUpperCase()) {
      case 'URGENT': return '#EF4444';
      case 'HIGH': return '#F59E0B';
      default: return '#518214';
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-slate-800">
          <ArrowLeft size={20} color="#94a3b8" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Notification Details</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 p-5">
        {/* Category & Priority Badge */}
        <View className="flex-row items-center space-x-2 mb-4">
          <View className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex-row items-center">
            <Tag size={12} color="#10b981" />
            <Text className="text-xs font-semibold text-emerald-400 ml-1.5 uppercase">
              {category || 'General'}
            </Text>
          </View>

          {priority && (
            <View
              className="px-3 py-1 rounded-full flex-row items-center"
              style={{ backgroundColor: `${getPriorityColor()}20` }}
            >
              <ShieldAlert size={12} color={getPriorityColor()} />
              <Text className="text-xs font-bold ml-1.5 uppercase" style={{ color: getPriorityColor() }}>
                {priority} Priority
              </Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text className="text-2xl font-extrabold text-white mb-2 leading-tight">
          {title || 'Official University Notice'}
        </Text>

        {/* Timestamp */}
        <View className="flex-row items-center mb-6">
          <Calendar size={14} color="#64748b" />
          <Text className="text-xs text-slate-400 ml-1.5">
            {published_at ? new Date(published_at).toLocaleString() : 'Just now'}
          </Text>
        </View>

        {/* Divider */}
        <View className="h-px bg-slate-800 mb-6" />

        {/* Body Content */}
        <Text className="text-base text-slate-200 leading-relaxed mb-8">
          {message || 'No additional content provided.'}
        </Text>

        {/* Attachment Link */}
        {attachment_url ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(attachment_url)}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex-row items-center justify-between mb-4"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <Paperclip size={20} color="#38bdf8" />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-slate-200">Attached Resource / PDF</Text>
                <Text className="text-xs text-slate-400" numberOfLines={1}>{attachment_url}</Text>
              </View>
            </View>
            <ExternalLink size={18} color="#38bdf8" />
          </TouchableOpacity>
        ) : null}

        {/* Deep Link Action */}
        {deep_link ? (
          <TouchableOpacity
            onPress={handleDeepLink}
            className="p-4 rounded-xl bg-emerald-600 flex-row items-center justify-center space-x-2 mt-4"
          >
            <Text className="text-white font-bold text-base">Open Related Section</Text>
            <ExternalLink size={18} color="white" />
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}
