import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Building, Clock, Award } from 'lucide-react-native';

export default function AboutHistoryScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">History & Genesis of GRI</Text>
            <Text className="text-xs text-emerald-100 font-medium">Founded in 1956 by Dr. T.S. Soundaram & Dr. G. Ramachandran</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">The Legacy of Gandhigram (1956)</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            The Gandhigram Rural Institute was established in 1956 under the inspiration of Mahatma Gandhi's Nai Talim (Basic Education) philosophy. Founded by visionary freedom fighters Dr. T.S. Soundaram and Dr. G. Ramachandran, GRI was envisioned as a laboratory for rural transformation.
          </Text>

          <View className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-4">
            <Text className="text-xs font-bold text-[#518214] uppercase mb-1">Key Milestones</Text>
            <Text className="text-xs text-emerald-900">• <Text className="font-bold">1956</Text>: Foundation of Gandhigram Rural Institute</Text>
            <Text className="text-xs text-emerald-900">• <Text className="font-bold">1976</Text>: Declared Deemed-to-be-University by UGC & Govt of India</Text>
            <Text className="text-xs text-emerald-900">• <Text className="font-bold">2006</Text>: 50 Years Golden Jubilee Celebration</Text>
            <Text className="text-xs text-emerald-900">• <Text className="font-bold">2024-2026</Text>: NAAC 'A' Grade Re-accreditation (3.24 CGPA)</Text>
          </View>

          <Text className="text-xs font-bold text-gray-800 uppercase mb-2">Founding Ideal: Nai Talim</Text>
          <Text className="text-xs text-gray-600 leading-relaxed">
            Integrating academic learning, manual labor, extension service, and character building to empower rural communities through self-reliance (Swadeshi & Gram Swaraj).
          </Text>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
