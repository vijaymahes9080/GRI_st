import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Home, Shield, CheckCircle2 } from 'lucide-react-native';

export default function HostelsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#C2185B] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Boys & Girls Hostels</Text>
            <Text className="text-xs text-pink-100 font-medium">Campus Residential Facilities & Mess System</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Residential Accommodations</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            GRI provides multi-tier hostel blocks equipped with solar hot water systems, Wi-Fi, indoor games, and hygienic mess hall operating on a dividing system.
          </Text>

          <View className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-4">
            <Text className="text-xs font-bold text-[#C2185B] uppercase mb-1">Hostel Blocks</Text>
            <Text className="text-xs text-pink-950">• <Text className="font-bold">Boys Hostels</Text>: 4 Blocks (Capacity: 800+ Students)</Text>
            <Text className="text-xs text-pink-950">• <Text className="font-bold">Girls Hostels</Text>: 3 Blocks (Capacity: 750+ Students)</Text>
            <Text className="text-xs text-pink-950">• <Text className="font-bold">Working Women's Hostel</Text>: 1 Block (Capacity: 100 Residents)</Text>
          </View>

          <Text className="text-xs font-bold text-gray-800 uppercase mb-2">Hostel Safety & Amenities</Text>
          <Text className="text-xs text-gray-600 mb-1">• 24/7 Campus Security & CCTV Surveillance</Text>
          <Text className="text-xs text-gray-600 mb-1">• Resident Wardens & Medical Emergency Response</Text>
          <Text className="text-xs text-gray-600">• RO Purified Drinking Water & Solar Water Heaters</Text>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
