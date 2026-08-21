import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Award, BarChart2 } from 'lucide-react-native';

export default function NirfScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">NIRF Rankings & Data</Text>
            <Text className="text-xs text-emerald-100 font-medium">National Institutional Ranking Framework</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">NIRF Ranking Submission Data</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            Detailed parameter reports submitted under Ministry of Education NIRF framework covering Teaching Learning Resources (TLR), Research & Professional Practice (RP), Graduation Outcomes (GO), and Outreach & Inclusivity (OI).
          </Text>
          <View className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <Text className="text-xs font-bold text-[#518214] uppercase mb-1">Ranked Categories</Text>
            <Text className="text-xs text-emerald-950">• Overall University Ranking Band</Text>
            <Text className="text-xs text-emerald-950">• Agriculture & Allied Sectors Rank</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
