import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Clock, Calendar } from 'lucide-react-native';

export default function WorkingHoursScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Working Hours & Timings</Text>
            <Text className="text-xs text-emerald-100 font-medium">Academic, Administrative & Library Timings</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Official Section Timings</Text>
          {[
            { section: 'Administrative Offices', hours: '9:30 AM - 5:30 PM (Mon to Fri)' },
            { section: 'Academic Departments', hours: '9:30 AM - 5:00 PM (Mon to Fri)' },
            { section: 'Central Library', hours: '8:00 AM - 8:00 PM (Mon to Sat)' },
            { section: 'Computer Centre', hours: '8:30 AM - 6:30 PM (Mon to Sat)' },
            { section: 'Health Centre', hours: '24 Hours Emergency Response' },
          ].map((item, idx) => (
            <View key={idx} className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 mb-3">
              <Text className="text-sm font-bold text-gray-900 mb-0.5">{item.section}</Text>
              <Text className="text-xs font-semibold text-[#518214]">{item.hours}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
