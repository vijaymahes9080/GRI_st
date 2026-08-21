import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, Clock, CheckCircle2 } from 'lucide-react-native';

export default function CentralLibraryScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#33691E] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Central Library & OPAC</Text>
            <Text className="text-xs text-lime-100 font-medium">160,000+ Books, e-Journals & Digital Reading Hall</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Central Library Collections</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            Fully automated library utilizing KOHA LMS with RFID circulation, e-ShodhSindhu consortium access, and 100+ seating capacity reading halls.
          </Text>

          <View className="bg-lime-50 p-4 rounded-xl border border-lime-200 mb-4">
            <Text className="text-xs font-bold text-[#33691E] uppercase mb-1">Key Library Statistics</Text>
            <Text className="text-xs text-lime-950">• Printed Books: 1,65,000+ Volumes</Text>
            <Text className="text-xs text-lime-950">• e-Journals & Databases: IEEE, ScienceDirect, Springer, JSTOR</Text>
            <Text className="text-xs text-lime-950">• Rare Gandhian Literature Archives: 12,000+ Volumes</Text>
            <Text className="text-xs text-lime-950">• Ph.D. Theses Repository (Shodhganga Uploaded): 1,200+</Text>
          </View>

          <Text className="text-xs font-bold text-gray-800 uppercase mb-2">Operating Hours</Text>
          <Text className="text-xs text-gray-600 mb-1">Monday - Friday: 8:00 AM to 8:00 PM</Text>
          <Text className="text-xs text-gray-600">Saturdays & Exam Periods: 9:00 AM to 5:00 PM</Text>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
