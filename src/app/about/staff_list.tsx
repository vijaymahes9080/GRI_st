import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, Building } from 'lucide-react-native';

export default function StaffListScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">University Staff List</Text>
            <Text className="text-xs text-emerald-100 font-medium">Teaching & Non-Teaching Employee Roster</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Staff Cadre Summary</Text>
          <View className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-4">
            <Text className="text-xs font-bold text-[#518214] uppercase mb-1">Emplyment Statistics</Text>
            <Text className="text-xs text-emerald-950">• Sanctioned Teaching Positions: 180+</Text>
            <Text className="text-xs text-emerald-950">• Non-Teaching & Administrative Cadre: 220+</Text>
            <Text className="text-xs text-emerald-950">• Research Fellows & Extension Staff: 80+</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
