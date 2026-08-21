import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Phone, Mail, Globe, Clock } from 'lucide-react-native';

export default function ContactGRIScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Contact & Campus Info</Text>
            <Text className="text-xs text-emerald-100 font-medium">H15 Gandhigram Rural Institute Location & Helpline</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">The Gandhigram Rural Institute</Text>

          <View className="flex-row items-start mb-3">
            <MapPin size={18} color="#518214" style={{ marginTop: 2, marginRight: 10 }} />
            <Text className="text-xs text-gray-700 leading-relaxed flex-1">
              Gandhigram, Dindigul District, Tamil Nadu - 624302, India
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Phone size={18} color="#518214" style={{ marginRight: 10 }} />
            <Text className="text-xs text-gray-800 font-semibold">+91 451 2452371 / 2452305</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Mail size={18} color="#518214" style={{ marginRight: 10 }} />
            <Text className="text-xs text-gray-800 font-semibold">gri@ruraluniv.ac.in</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Globe size={18} color="#518214" style={{ marginRight: 10 }} />
            <Text className="text-xs text-gray-800 font-semibold">https://ruraluniv.ac.in</Text>
          </View>

          <View className="flex-row items-center pt-2 border-t border-gray-100">
            <Clock size={16} color="#6B7280" style={{ marginRight: 8 }} />
            <Text className="text-xs text-gray-500 font-medium">Office Hours: Mon - Fri (09:30 AM - 05:30 PM)</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
