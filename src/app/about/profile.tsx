import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Building, BookOpen, ShieldCheck, Award } from 'lucide-react-native';

export default function InstitutionalProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Institutional Profile</Text>
            <Text className="text-xs text-emerald-100 font-medium">Deemed to be University Status & Accreditation</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Institutional Credentials</Text>

          {[
            { label: 'Official Name', val: 'The Gandhigram Rural Institute (Deemed to be University)' },
            { label: 'Established', val: '1956 (Deemed University Status granted in 1976)' },
            { label: 'Jurisdiction', val: 'Ministry of Education, Govt of India & UGC' },
            { label: 'NAAC Accreditation', val: 'Grade "A" (3.24 CGPA)' },
            { label: 'Campus Area', val: '300+ Acres Green Campus in Gandhigram, Dindigul' },
            { label: 'Academic Structure', val: '7 Major Schools & 30+ Departments' },
            { label: 'Programmes Offered', val: '50+ UG, PG, Ph.D., Diploma & B.Voc. Courses' },
          ].map((item, idx) => (
            <View key={idx} className="flex-row items-start py-2.5 border-b border-gray-100">
              <Text className="text-xs font-bold text-gray-700 w-36">{item.label}</Text>
              <Text className="text-xs font-semibold text-[#518214] flex-1">{item.val}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
