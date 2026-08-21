import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Award, FileText, Globe } from 'lucide-react-native';

export default function ResearchScreen() {
  const router = useRouter();

  const metrics = [
    { title: 'Funded R&D Projects', count: '45+ Active' },
    { title: 'Patents & IP Rights', count: '18 Filed' },
    { title: 'Ph.D. Research Scholars', count: '320+ Enrolled' },
    { title: 'International MoUs', count: '12 Active' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#6A1B9A] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Research & Development Cell</Text>
            <Text className="text-xs text-purple-100 font-medium">Innovation, Patents, MoUs & Ph.D. Research</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between mb-4">
          {metrics.map((m, idx) => (
            <View key={idx} className="w-[48%] bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm items-center">
              <Text className="text-xl font-bold text-[#6A1B9A]">{m.count}</Text>
              <Text className="text-xs font-semibold text-gray-700 text-center mt-1">{m.title}</Text>
            </View>
          ))}
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Research Promotion Policy</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            Encouraging interdisciplinary rural development research, green energy innovation, quantum physics synthesis, and community extension models.
          </Text>
          <TouchableOpacity className="flex-row items-center justify-center bg-purple-50 py-2.5 rounded-xl border border-purple-100">
            <FileText size={16} color="#6A1B9A" />
            <Text className="text-xs font-bold text-[#6A1B9A] ml-2">Download Research Promotion Policy PDF</Text>
          </TouchableOpacity>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
