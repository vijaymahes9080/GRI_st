import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, FileText } from 'lucide-react-native';

export default function MandatoryDisclosuresScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Mandatory Disclosures</Text>
            <Text className="text-xs text-emerald-100 font-medium">UGC & Ministry of Education Compliance</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Public Disclosures 2026</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            Mandatory disclosures in accordance with UGC Deemed to be University Regulations, including faculty strength, land area, accredited programmes, and financial audit summary.
          </Text>
          <View className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <Text className="text-xs font-bold text-[#518214] uppercase mb-1">Audit Status</Text>
            <Text className="text-xs text-emerald-900">• Verified by UGC Statutory Audit Panel</Text>
            <Text className="text-xs text-emerald-900">• Published under RTI Act Section 4(1)(b)</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
