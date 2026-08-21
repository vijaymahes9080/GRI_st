import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Target, CheckCircle2 } from 'lucide-react-native';

export default function InstitutionalObjectivesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Institutional Objectives</Text>
            <Text className="text-xs text-emerald-100 font-medium">Core Strategic Goals of GRI</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Primary Strategic Objectives</Text>
          {[
            { title: 'Rural Transformation', desc: 'Provide higher education tailored to rural development, rural management, and organic agriculture.' },
            { title: 'Extension & Community Service', desc: 'Mandatory field extension work for all students across 100+ adopted villages.' },
            { title: 'Skill Development & Vocational Training', desc: 'DDU-KK and B.Voc programmes in footwear design, renewable energy, and sanitation science.' },
            { title: 'Advanced Interdisciplinary Research', desc: 'Research and Development Cell (RDC) focusing on climate action, nanoscience, and water management.' },
          ].map((obj, idx) => (
            <View key={idx} className="mb-4 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
              <View className="flex-row items-center mb-1">
                <Target size={16} color="#518214" />
                <Text className="text-sm font-bold text-gray-900 ml-2">{obj.title}</Text>
              </View>
              <Text className="text-xs text-gray-600 ml-6 leading-relaxed">{obj.desc}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
