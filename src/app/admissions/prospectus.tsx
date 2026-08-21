import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, GraduationCap, Download, CheckCircle2 } from 'lucide-react-native';

export default function AdmissionsProspectusScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#6A1B9A] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Admissions Prospectus 2026-2027</Text>
            <Text className="text-xs text-purple-100 font-medium">Official Guidelines, CUET Criteria & Guidelines</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* PDF Download Banner */}
        <TouchableOpacity className="bg-purple-900 p-4 rounded-2xl mb-4 flex-row items-center justify-between shadow-md">
          <View className="flex-row items-center flex-1 pr-2">
            <GraduationCap size={28} color="#FFFFFF" className="mr-3" />
            <View className="flex-1">
              <Text className="text-sm font-bold text-white">Download Complete Prospectus PDF</Text>
              <Text className="text-xs text-purple-200">Full 2026-27 Programme Rules & Eligibility (12.4 MB)</Text>
            </View>
          </View>
          <View className="bg-white/20 p-2.5 rounded-full">
            <Download size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Admission Process Summary</Text>
          {[
            'CUET (UG) / CUET (PG) Score-based Merit Selection',
            'Direct Online Counseling Registration via Samarth@GRI Portal',
            'Verification of Reservation & Original Certificates',
            'Fee Payment & Hostel Allotment Process',
          ].map((step, idx) => (
            <View key={idx} className="flex-row items-start mb-2.5">
              <CheckCircle2 size={16} color="#6A1B9A" style={{ marginTop: 2, marginRight: 8 }} />
              <Text className="text-xs text-gray-800 flex-1 font-medium">{step}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
