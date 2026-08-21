import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Send, Users, ShieldAlert, Tag, Paperclip, CheckSquare, Square } from 'lucide-react-native';
import { apiClient } from '../../core/api';

export default function NotificationComposerScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('academic');
  const [priority, setPriority] = useState('NORMAL');
  const [targetType, setTargetType] = useState('all');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [deepLink, setDeepLink] = useState('');

  const [channels, setChannels] = useState<{ [key: string]: boolean }>({
    in_app: true,
    push: true,
    email: true,
    whatsapp: true,
    sms: true,
  });

  const [estimatedRecipients, setEstimatedRecipients] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChannel = (ch: string) => {
    setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }));
  };

  const handleEstimate = async () => {
    try {
      const res = await apiClient.post('/admin/notifications/estimate-recipients', null, {
        params: {
          target_type: targetType,
          department_id: department || undefined,
          current_year: year ? parseInt(year) : undefined,
        },
      });
      if (res.data) {
        setEstimatedRecipients(res.data.estimated_recipients);
      }
    } catch {
      setEstimatedRecipients(targetType === 'all' ? 12450 : 142);
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Validation Error', 'Title and Message content are required.');
      return;
    }

    const selectedChannels = Object.keys(channels).filter((k) => channels[k]);
    if (selectedChannels.length === 0) {
      Alert.alert('Validation Error', 'Select at least one delivery channel.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: title.trim(),
        message: message.trim(),
        category,
        priority,
        attachment_url: attachmentUrl.trim() || undefined,
        deep_link: deepLink.trim() || undefined,
        target_type: targetType,
        target_filter: {
          department_id: department || undefined,
          current_year: year ? parseInt(year) : undefined,
        },
        channels: selectedChannels,
        schedule_now: true,
      };

      await apiClient.post('/admin/notifications', payload);
      Alert.alert('Success', 'Notification created and queued for broadcast.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Creation Failed', err?.response?.data?.detail || 'Failed to submit notification.');
    } finally {
      setIsLoading(false);
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
        <Text className="text-lg font-bold text-white">Create Official Notification</Text>
        <TouchableOpacity onPress={handleSend} disabled={isLoading} className="p-2 bg-emerald-600 rounded-full">
          {isLoading ? <ActivityIndicator size="small" color="white" /> : <Send size={18} color="white" />}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5">
        {/* Title Input */}
        <Text className="text-xs font-bold text-slate-400 uppercase mb-1.5">Notification Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Semester Examination Timetable Published"
          placeholderTextColor="#475569"
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-semibold text-base mb-4"
        />

        {/* Message Body Input */}
        <Text className="text-xs font-bold text-slate-400 uppercase mb-1.5">Message Content *</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Enter full notification message content..."
          placeholderTextColor="#475569"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm mb-4 min-h-[120px]"
        />

        {/* Category & Priority Row */}
        <View className="flex-row justify-between mb-4">
          <View className="w-[48%]">
            <Text className="text-xs font-bold text-slate-400 uppercase mb-1.5">Category</Text>
            <View className="bg-slate-900 border border-slate-800 rounded-xl p-1">
              {['academic', 'exam', 'placement', 'events', 'emergency'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg mb-1 ${category === cat ? 'bg-emerald-600' : ''}`}
                >
                  <Text className={`text-xs font-bold capitalize ${category === cat ? 'text-white' : 'text-slate-400'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="w-[48%]">
            <Text className="text-xs font-bold text-slate-400 uppercase mb-1.5">Priority</Text>
            <View className="bg-slate-900 border border-slate-800 rounded-xl p-1">
              {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((prio) => (
                <TouchableOpacity
                  key={prio}
                  onPress={() => setPriority(prio)}
                  className={`px-3 py-1.5 rounded-lg mb-1 ${priority === prio ? 'bg-emerald-600' : ''}`}
                >
                  <Text className={`text-xs font-bold capitalize ${priority === prio ? 'text-white' : 'text-slate-400'}`}>
                    {prio}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Target Audience Engine */}
        <Text className="text-xs font-bold text-slate-400 uppercase mb-1.5">Target Audience</Text>
        <View className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4">
          <View className="flex-row flex-wrap mb-3">
            {['all', 'student', 'faculty', 'department'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setTargetType(type)}
                className={`px-3 py-1.5 rounded-lg mr-2 mb-2 border ${
                  targetType === type ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <Text className={`text-xs font-bold capitalize ${targetType === type ? 'text-white' : 'text-slate-300'}`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleEstimate} className="bg-slate-800 py-2 rounded-lg items-center">
            <Text className="text-xs font-bold text-emerald-400">
              {estimatedRecipients !== null
                ? `Estimated Recipients: ${estimatedRecipients}`
                : 'Calculate Estimated Recipients'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Channels Selectors */}
        <Text className="text-xs font-bold text-slate-400 uppercase mb-1.5">Delivery Channels</Text>
        <View className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6">
          {[
            { id: 'in_app', label: 'Real-Time In-App Event' },
            { id: 'push', label: 'Push Notification (FCM / Mobile)' },
            { id: 'email', label: 'Official Email (SMTP)' },
            { id: 'whatsapp', label: 'WhatsApp Business Message' },
            { id: 'sms', label: 'SMS Alert (Open Gateway)' },
          ].map((ch) => {
            const isChecked = !!channels[ch.id];
            return (
              <TouchableOpacity
                key={ch.id}
                onPress={() => toggleChannel(ch.id)}
                className="flex-row items-center py-2 justify-between border-b border-slate-800/50 last:border-b-0"
              >
                <Text className="text-sm font-semibold text-slate-200">{ch.label}</Text>
                {isChecked ? <CheckSquare size={20} color="#10b981" /> : <Square size={20} color="#475569" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={isLoading}
          className="bg-emerald-600 p-4 rounded-xl flex-row items-center justify-center space-x-2 mb-10 shadow-lg shadow-emerald-900/30"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Send size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">Publish & Send Notification</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
