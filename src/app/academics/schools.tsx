import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, ChevronRight } from 'lucide-react-native';
import { GRI_INSTITUTIONAL_DATA } from '../../core/services/institutionalData';

export default function SchoolsDirectoryScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#F16236] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">7 Major Schools Directory</Text>
            <Text className="text-xs text-orange-100 font-medium">Academic Divisions & Specialized Centres</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {GRI_INSTITUTIONAL_DATA.schools.map((school) => (
          <View key={school.id} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="p-2.5 bg-orange-50 rounded-xl mr-3">
                <BookOpen size={20} color="#F16236" />
              </View>
              <Text className="text-base font-bold text-gray-900 flex-1">{school.name}</Text>
            </View>
            <Text className="text-xs font-bold text-gray-500 uppercase mb-1">Departments Under School ({school.departments.length})</Text>
            {school.departments.map((dept) => (
              <TouchableOpacity
                key={dept.code}
                onPress={() => router.push({ pathname: '/academics/department_detail', params: { deptId: dept.code.toLowerCase() } })}
                className="py-1.5 flex-row items-center justify-between border-b border-gray-100"
              >
                <Text className="text-xs font-semibold text-gray-800">• {dept.name} ({dept.head})</Text>
                <ChevronRight size={14} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
