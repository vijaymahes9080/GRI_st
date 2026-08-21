import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, GraduationCap, FileText, CheckCircle2 } from 'lucide-react-native';

export default function AdmissionsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#6A1B9A] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Admissions 2026-2027</Text>
            <Text className="text-xs text-purple-100 font-medium">UG, PG, Ph.D. Prospectus & Fee Regulations</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-purple-50 border border-purple-200 p-4 rounded-2xl mb-4">
          <Text className="text-xs font-bold text-[#6A1B9A] uppercase tracking-wider mb-1">CUET & Direct Admissions Notice</Text>
          <Text className="text-sm text-gray-900 font-medium leading-relaxed">
            Admissions to UG/PG programmes are conducted through CUET (SAMARTH) and GRI All-India Entrance Tests.
          </Text>
        </View>

        <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Prospectus & Regulations</Text>

        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-3.5 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-bold text-gray-900">Prospectus 2026-2027</Text>
            <View className="bg-purple-100 px-2.5 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-[#6A1B9A]">Official Brochure</Text>
            </View>
          </View>
          <Text className="text-xs text-gray-600 mb-3">Complete overview of 50+ degree, diploma, and doctoral programmes offered across 7 Schools.</Text>
          <View className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Text className="text-xs font-bold text-gray-800 mb-1">Categories Included:</Text>
            <Text className="text-xs text-gray-600">• UG (B.Sc, B.A, B.Com, B.Voc, B.Tech)</Text>
            <Text className="text-xs text-gray-600">• PG (M.Sc, M.A, M.Com, M.C.A, M.Ed)</Text>
            <Text className="text-xs text-gray-600">• Ph.D. & D.Sc. Regulations (July 2026 Batch)</Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-3.5 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Fee Policy & Refund Structure</Text>
          <Text className="text-xs text-gray-600 mb-3">UGC compliant fee refund guidelines for withdrawal of admission before or after class commencement.</Text>
          <View className="bg-purple-50 p-3 rounded-xl border border-purple-100">
            <Text className="text-xs font-bold text-[#6A1B9A] mb-1">UGC Refund Matrix:</Text>
            <Text className="text-xs text-gray-700">• 15 Days Before Start: 100% Refund (Less Rs.1000)</Text>
            <Text className="text-xs text-gray-700">• Less Than 15 Days Before: 90% Refund</Text>
            <Text className="text-xs text-gray-700">• Within 15 Days After Start: 80% Refund</Text>
            <Text className="text-xs text-gray-700">• More Than 30 Days After Start: 0% Refund</Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Hostel Accommodation & Fees</Text>
          <Text className="text-xs text-gray-600 mb-3">Separate hostels for Boys, Girls, and Working Women with mess facilities.</Text>
          <View className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <Text className="text-xs font-bold text-emerald-900 mb-1">Annual Hostel Fee Structure:</Text>
            <Text className="text-xs text-emerald-800">• Caution Deposit (Refundable): Rs. 3,000</Text>
            <Text className="text-xs text-emerald-800">• Room Rent & Establishments: Rs. 6,500 / Year</Text>
            <Text className="text-xs text-emerald-800">• Mess Charges (Dividing System): Approx Rs. 2,500 / Month</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
