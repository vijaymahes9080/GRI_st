import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, Users } from 'lucide-react-native';

export default function AcademicCouncilScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#911C03] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Academic Council</Text>
            <Text className="text-xs text-rose-100 font-medium">Principal Academic Authority of GRI</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Functions of Academic Council</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            Responsible for maintaining standards of instruction, curriculum design, CBCS revisions, examination regulations, and institution of new degrees.
          </Text>
          <View className="bg-rose-50 p-3.5 rounded-xl border border-rose-200">
            <Text className="text-xs font-bold text-[#911C03] uppercase mb-1">Composition</Text>
            <Text className="text-xs text-gray-800">• Vice-Chancellor (Chairman)</Text>
            <Text className="text-xs text-gray-800">• All Deans of Schools & Heads of Departments</Text>
            <Text className="text-xs text-gray-800">• External Academic Experts Nominated by UGC</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
