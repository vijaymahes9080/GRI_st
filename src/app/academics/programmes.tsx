import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, GraduationCap, BookOpen, Clock, Users } from 'lucide-react-native';

export default function AcademicProgrammesScreen() {
  const router = useRouter();
  const [level, setLevel] = useState<'ALL' | 'UG' | 'PG' | 'BVOC' | 'PHD'>('ALL');

  const programmes = [
    { title: 'B.Sc. (Hons) Agriculture', level: 'UG', duration: '4 Years', intake: 60, dept: 'Dept of Agriculture' },
    { title: 'B.Sc. Computer Science', level: 'UG', duration: '3 Years', intake: 40, dept: 'Dept of Computer Science' },
    { title: 'MCA (Master of Computer Applications)', level: 'PG', duration: '2 Years', intake: 60, dept: 'Dept of Computer Science' },
    { title: 'M.Sc. Agronomy', level: 'PG', duration: '2 Years', intake: 20, dept: 'Dept of Agriculture' },
    { title: 'B.Voc. Footwear & Accessories Design', level: 'BVOC', duration: '3 Years', intake: 50, dept: 'Dept of B.Voc' },
    { title: 'Ph.D. in Computer Science & Applications', level: 'PHD', duration: '3-5 Years', intake: 12, dept: 'Dept of Computer Science' },
    { title: 'Ph.D. in Gandhian Thought & Peace Science', level: 'PHD', duration: '3-5 Years', intake: 8, dept: 'Dept of Gandhian Thought' },
  ].filter((p) => level === 'ALL' || p.level === level);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#F16236] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Academic Programmes</Text>
            <Text className="text-xs text-orange-100 font-medium">UG, PG, B.Voc., Diploma & Ph.D. Courses</Text>
          </View>
        </View>

        {/* Filter Pill Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1">
          {[
            { id: 'ALL', label: 'All (60+)' },
            { id: 'UG', label: 'Undergraduate' },
            { id: 'PG', label: 'Postgraduate' },
            { id: 'BVOC', label: 'B.Voc / Diploma' },
            { id: 'PHD', label: 'Ph.D. Research' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setLevel(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full mr-2 border ${
                level === tab.id ? 'bg-white border-white' : 'bg-white/20 border-white/30'
              }`}
            >
              <Text className={`text-xs font-bold ${level === tab.id ? 'text-[#F16236]' : 'text-white'}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {programmes.map((prog, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[11px] font-bold text-[#F16236] uppercase tracking-wider">{prog.level}</Text>
              <Text className="text-[11px] text-gray-500 font-semibold">{prog.dept}</Text>
            </View>
            <Text className="text-base font-bold text-gray-900 mb-2">{prog.title}</Text>

            <View className="flex-row items-center gap-4 border-t border-gray-100 pt-2.5">
              <View className="flex-row items-center">
                <Clock size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600 font-medium ml-1">Duration: {prog.duration}</Text>
              </View>
              <View className="flex-row items-center">
                <Users size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600 font-medium ml-1">Seats Intake: {prog.intake}</Text>
              </View>
            </View>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
