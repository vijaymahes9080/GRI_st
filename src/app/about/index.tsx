import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Building, Award, ShieldCheck, BookOpen, Clock, Users, FileText, CheckCircle2 } from 'lucide-react-native';

export default function AboutGriScreen() {
  const router = useRouter();

  const sections = [
    { title: 'Genesis of GRI (1956)', desc: 'Founded by Dr. T.S. Soundaram and Dr. G. Ramachandran based on Mahatma Gandhi\'s Nai Talim philosophy.', icon: Building, badge: 'History' },
    { title: 'Vision & Mission', desc: 'Transforming rural society through value-based higher education, rural extension, and innovative research.', icon: Award, badge: 'Mandate' },
    { title: 'NAAC "A" Grade Accreditation', desc: 'Re-accredited with Grade A (3.24 CGPA) by NAAC, Ministry of Education, Govt of India.', icon: ShieldCheck, badge: 'Quality' },
    { title: 'Institutional Profile', desc: 'Deemed-to-be-University status since 1976 under UGC Act 1956.', icon: BookOpen, badge: 'UGC' },
    { title: 'Statutory Regulations & Conduct', desc: 'CCS Rules, UGC Anti-Ragging Regulations, Code of Conduct for Students, Teaching & Non-Teaching Staff.', icon: FileText, badge: 'Rules' },
    { title: 'Working Hours & Administrative Calendar', desc: 'Monday to Friday: 9:30 AM to 5:30 PM. Official Working Hours & Section Timings.', icon: Clock, badge: 'Schedule' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">About GRI</Text>
            <Text className="text-xs text-emerald-100 font-medium">Gandhigram Rural Institute — Deemed to be University</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-4">
          <Text className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Institutional Identity</Text>
          <Text className="text-sm text-emerald-950 font-medium leading-relaxed">
            The Gandhigram Rural Institute was established in 1956 to pioneer Gandhian Basic Education (Nai Talim) and serve as a beacon for rural transformation in India.
          </Text>
        </View>

        <Text className="text-sm font-bold text-gray-800 uppercase mb-3">About Modules</Text>

        {sections.map((sec, idx) => {
          const IconComp = sec.icon;
          return (
            <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                  <View className="p-2.5 bg-emerald-100 rounded-xl mr-3">
                    <IconComp size={20} color="#518214" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900">{sec.title}</Text>
                  </View>
                </View>
                <View className="bg-emerald-100 px-2.5 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-[#518214]">{sec.badge}</Text>
                </View>
              </View>
              <Text className="text-xs text-gray-600 leading-relaxed mb-3">{sec.desc}</Text>
              <View className="flex-row items-center text-emerald-700">
                <CheckCircle2 size={14} color="#518214" />
                <Text className="text-xs font-semibold text-[#518214] ml-1.5">Official University Record Verified</Text>
              </View>
            </View>
          );
        })}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
