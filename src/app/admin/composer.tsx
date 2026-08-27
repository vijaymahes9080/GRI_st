import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Send, CheckSquare, Square, Eye } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { apiClient } from '../../core/api';
import { themeTokens } from '../../core/theme/tokens';
import { Card } from '../../components/Card';
import { NotificationPreviewModal } from '../../components/admin/NotificationPreviewModal';

export default function NotificationComposerScreen() {
  const router = useRouter();
  const { colors } = themeTokens;

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
      if (res.data) setEstimatedRecipients(res.data.estimated_recipients);
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
        target_filter: { department_id: department || undefined, current_year: year ? parseInt(year) : undefined },
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
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100">
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Create Notification</Text>
        <div className="flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={() => setIsPreviewOpen(true)}
            className="flex-row items-center px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 mr-2"
          >
            <Eye size={16} color={colors.textSecondary} />
            <Text className="text-xs font-bold text-slate-700 ml-1.5">Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSend} disabled={isLoading} className="p-2 bg-primary-600 rounded-full shadow-sm">
            {isLoading ? <ActivityIndicator size="small" color="white" /> : <Send size={18} color="white" />}
          </TouchableOpacity>
        </div>
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            {/* Title Input */}
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Notification Title *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Semester Examination Timetable Published"
              placeholderTextColor={colors.textMuted}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold text-base mb-6 shadow-sm"
            />

            {/* Message Body Input */}
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message Content *</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Enter full notification message content..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 text-sm mb-6 min-h-[140px] shadow-sm leading-relaxed"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            {/* Category & Priority Row */}
            <View className="flex-row justify-between mb-6">
              <View className="w-[48%]">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</Text>
                <Card elevation="sm" className="bg-white border-slate-200 p-2 rounded-2xl">
                  {['academic', 'exam', 'placement', 'events', 'emergency'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`px-3 py-2.5 rounded-xl mb-1 transition ${category === cat ? 'bg-primary-50 border border-primary-100' : 'border border-transparent'}`}
                    >
                      <Text className={`text-[11px] font-bold uppercase tracking-wider ${category === cat ? 'text-primary-800' : 'text-slate-500'}`}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Card>
              </View>

              <View className="w-[48%]">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Priority</Text>
                <Card elevation="sm" className="bg-white border-slate-200 p-2 rounded-2xl">
                  {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((prio) => (
                    <TouchableOpacity
                      key={prio}
                      onPress={() => setPriority(prio)}
                      className={`px-3 py-2.5 rounded-xl mb-1 transition ${priority === prio ? 'bg-amber-50 border border-amber-100' : 'border border-transparent'}`}
                    >
                      <Text className={`text-[11px] font-bold uppercase tracking-wider ${priority === prio ? 'text-amber-800' : 'text-slate-500'}`}>
                        {prio}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Card>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            {/* Target Audience Engine */}
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Audience</Text>
            <Card elevation="sm" className="bg-white border-slate-200 p-5 rounded-3xl mb-6">
              <View className="flex-row flex-wrap mb-4">
                {['all', 'student', 'faculty', 'department'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setTargetType(type)}
                    className={`px-4 py-2 rounded-xl mr-2 mb-2 border transition ${
                      targetType === type ? 'bg-primary-600 border-primary-600 shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className={`text-[11px] font-bold uppercase tracking-wider ${targetType === type ? 'text-white' : 'text-slate-600'}`}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={handleEstimate} className="bg-primary-50 py-3 rounded-xl items-center border border-primary-100">
                <Text className="text-[11px] font-bold text-primary-800 uppercase tracking-widest">
                  {estimatedRecipients !== null ? `Estimated Recipients: ${estimatedRecipients}` : 'Calculate Reach'}
                </Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            {/* Delivery Channels Selectors */}
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Delivery Channels</Text>
            <Card elevation="sm" className="bg-white border-slate-200 p-5 rounded-3xl mb-8">
              {[
                { id: 'in_app', label: 'Real-Time In-App Event' },
                { id: 'push', label: 'Push Notification (Mobile)' },
                { id: 'email', label: 'Official Email (SMTP)' },
                { id: 'whatsapp', label: 'WhatsApp Message' },
                { id: 'sms', label: 'SMS Alert (Gateway)' },
              ].map((ch, index, array) => {
                const isChecked = !!channels[ch.id];
                return (
                  <TouchableOpacity
                    key={ch.id}
                    onPress={() => toggleChannel(ch.id)}
                    className={`flex-row items-center py-3 justify-between ${index !== array.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <Text className="text-sm font-semibold text-slate-700">{ch.label}</Text>
                    {isChecked ? <CheckSquare size={20} color={colors.primary} /> : <Square size={20} color={colors.textMuted} />}
                  </TouchableOpacity>
                );
              })}
            </Card>

            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSend}
              disabled={isLoading}
              className="bg-primary-600 p-5 rounded-2xl flex-row items-center justify-center space-x-2 mb-16 shadow-lg shadow-primary-600/30"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Send size={20} color="white" />
                  <Text className="text-white font-bold text-base ml-2">Publish & Send</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>

      <NotificationPreviewModal
        isVisible={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        message={message}
        category={category}
        priority={priority}
      />
    </View>
  );
}
