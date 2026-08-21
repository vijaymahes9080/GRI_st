import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Award, ShieldCheck } from 'lucide-react-native';

export default function NaacScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">NAAC Accreditation</Text>
            <Text className="text-xs text-emerald-100 font-medium">National Assessment and Accreditation Council</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm items-center">
          <View className="p-4 bg-emerald-100 rounded-full mb-3">
            <Award size={36} color="#518214" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-0.5">Grade "A" Re-accreditation</Text>
          <Text className="text-xs font-semibold text-[#518214] mb-4">Cumulative Grade Point Average (CGPA): 3.24 / 4.00</Text>

          <View className="w-full bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-4">
            <Text className="text-xs font-bold text-[#518214] uppercase mb-1">NAAC Criteria Highlights</Text>
            <Text className="text-xs text-emerald-950">• Curricular Aspects & CBCS Framework</Text>
            <Text className="text-xs text-emerald-950">• Teaching-Learning & Evaluation Innovations</Text>
            <Text className="text-xs text-emerald-950">• Research, Innovations & Extension (KVK / UBA)</Text>
            <Text className="text-xs text-emerald-950">• Institutional Distinctiveness in Gandhian Values</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
