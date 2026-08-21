import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Download } from 'lucide-react-native';

export default function AcademicCalendarScreen() {
  const router = useRouter();

  const events = [
    { date: 'Aug 17, 2026', title: 'Commencement of Odd Semester Classes (UG & PG)', type: 'ACADEMIC' },
    { date: 'Sep 05, 2026', title: 'Teachers\' Day Celebrations & Special Lecture', type: 'EVENT' },
    { date: 'Oct 12-16, 2026', title: 'Continuous Internal Assessment (CIA-I) Examinations', type: 'EXAM' },
    { date: 'Nov 02-06, 2026', title: 'Continuous Internal Assessment (CIA-II) Examinations', type: 'EXAM' },
    { date: 'Nov 20, 2026', title: 'Commencement of End Semester Examinations (ESE)', type: 'EXAM' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#F16236] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Academic Calendar & Handbook</Text>
            <Text className="text-xs text-orange-100 font-medium">Key University Dates & Student Guidelines</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Handbook Download Banner */}
        <TouchableOpacity className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-2">
            <Calendar size={24} color="#F16236" className="mr-3" />
            <View>
              <Text className="text-sm font-bold text-gray-900">Student Handbook 2026-2027</Text>
              <Text className="text-xs text-gray-500">Official Ordinance & Academic Rules (PDF)</Text>
            </View>
          </View>
          <Download size={18} color="#F16236" />
        </TouchableOpacity>

        <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Upcoming Academic Key Dates</Text>
        {events.map((evt, idx) => (
          <View key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 mb-2.5 shadow-sm flex-row items-center">
            <View className="bg-orange-50 px-3 py-2 rounded-xl mr-3 border border-orange-100 items-center min-w-[90px]">
              <Text className="text-[10px] font-bold text-[#F16236] uppercase">{evt.type}</Text>
              <Text className="text-xs font-bold text-gray-900 mt-0.5">{evt.date}</Text>
            </View>
            <Text className="text-xs font-bold text-gray-800 flex-1 leading-relaxed">{evt.title}</Text>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
