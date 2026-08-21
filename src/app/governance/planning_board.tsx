import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Target, Shield, CheckCircle2 } from 'lucide-react-native';

export default function PlanningBoardScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#911C03] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Planning & Monitoring Board</Text>
            <Text className="text-xs text-orange-100 font-medium">Strategic Planning & Institutional Expansion</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="p-3 bg-red-50 rounded-xl mr-3">
              <Target size={24} color="#911C03" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">Planning Board Overview</Text>
              <Text className="text-xs text-gray-500">Chaired by Vice-Chancellor · 12 Members</Text>
            </View>
          </View>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            The Planning and Monitoring Board is responsible for overall strategic development, academic expansion, infrastructure planning, and monitoring UGC / MoE scheme implementations.
          </Text>

          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Responsibilities</Text>
          {[
            'Formulating 5-Year Institutional Strategic Growth Plans',
            'Monitoring UGC & Ministry of Education Grant Utilization',
            'Evaluating Academic Standards & Research Productivity',
            'Approving Infrastructure Expansion & Green Campus Projects',
          ].map((item, idx) => (
            <View key={idx} className="flex-row items-start mb-2">
              <CheckCircle2 size={16} color="#911C03" style={{ marginTop: 2, marginRight: 8 }} />
              <Text className="text-xs text-gray-800 flex-1 font-medium">{item}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
