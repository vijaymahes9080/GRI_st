import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, GraduationCap } from 'lucide-react-native';

export default function PgAdmissionsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#6A1B9A] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">PG Admissions 2026-2027</Text>
            <Text className="text-xs text-purple-100 font-medium">M.Sc, M.A, M.Com, MCA & M.Ed Programmes</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Postgraduate Programmes Offered</Text>
          {[
            { name: 'MCA (Master of Computer Applications)', dur: '2 Years', elig: 'B.Sc. CS/BCA/B.Sc. with Maths' },
            { name: 'M.Sc. Agronomy', dur: '2 Years', elig: 'B.Sc. Agriculture (ICAR Accredited)' },
            { name: 'M.A. Gandhian Thought & Peace Science', dur: '2 Years', elig: 'Bachelor Degree in any discipline' },
            { name: 'M.Com. Cooperative Management', dur: '2 Years', elig: 'B.Com / BBA / B.A. Cooperation' },
          ].map((prog, idx) => (
            <View key={idx} className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 mb-3">
              <Text className="text-sm font-bold text-gray-900 mb-1">{prog.name}</Text>
              <Text className="text-xs text-[#6A1B9A] font-semibold mb-1">Duration: {prog.dur}</Text>
              <Text className="text-xs text-gray-600">Eligibility: {prog.elig}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
