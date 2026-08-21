import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Monitor, Wifi, ShieldCheck } from 'lucide-react-native';

export default function ComputerCentreScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#33691E] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Computer Centre</Text>
            <Text className="text-xs text-lime-100 font-medium">1 Gbps National Knowledge Network (NKN) Campus Fiber</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Campus IT Infrastructure</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            High-speed internet fiber connectivity powering 300+ workstations, Wi-Fi hostels, server room, and Samarth ERP database.
          </Text>

          <View className="bg-lime-50 p-4 rounded-xl border border-lime-200 mb-4">
            <Text className="text-xs font-bold text-[#33691E] uppercase mb-1">Facilities Provided</Text>
            <Text className="text-xs text-lime-950">• 1 Gbps Leased Line Connectivity under NKN</Text>
            <Text className="text-xs text-lime-950">• Central Blade Servers & Storage Area Network (SAN)</Text>
            <Text className="text-xs text-lime-950">• High-speed Wi-Fi Access Points across Hostels & Library</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
