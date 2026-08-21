import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Shield, Users } from 'lucide-react-native';

export default function GriSocietyScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#911C03] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">GRI Society</Text>
            <Text className="text-xs text-rose-100 font-medium">Founding Educational Society</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">The Gandhigram Rural Institute Society</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            Registered under Tamil Nadu Societies Registration Act. The Society serves as the apex body providing vision and policy direction rooted in Gandhian principles.
          </Text>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
