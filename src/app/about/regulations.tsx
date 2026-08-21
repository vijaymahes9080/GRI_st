import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText, Shield } from 'lucide-react-native';

export default function RegulationsScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Institutional Regulations</Text>
            <Text className="text-xs text-emerald-100 font-medium">CCS Rules, UGC Regulations & Academic Directives</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Governing Rules & Regulations</Text>
          {[
            'Central Civil Services (CCS) Conduct Rules for University Employees',
            'UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions',
            'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act',
            'GRI Examination & Evaluation Regulations 2024',
          ].map((reg, idx) => (
            <View key={idx} className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 mb-3">
              <Text className="text-xs font-bold text-gray-900">{idx + 1}. {reg}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
