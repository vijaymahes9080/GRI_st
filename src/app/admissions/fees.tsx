import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, ShieldCheck } from 'lucide-react-native';

export default function AdmissionsFeesScreen() {
  const router = useRouter();

  const feesList = [
    { programme: 'B.Sc. (Hons) Agriculture', tuition: '₹14,500 / Sem', hostel: '₹8,000 / Yr', caution: '₹2,000 (Refundable)' },
    { programme: 'B.Sc. Computer Science', tuition: '₹9,200 / Sem', hostel: '₹8,000 / Yr', caution: '₹1,500 (Refundable)' },
    { programme: 'MCA (Master of Computer Applications)', tuition: '₹18,000 / Sem', hostel: '₹8,000 / Yr', caution: '₹2,500 (Refundable)' },
    { programme: 'M.Sc. Agronomy', tuition: '₹12,000 / Sem', hostel: '₹8,000 / Yr', caution: '₹2,000 (Refundable)' },
    { programme: 'Ph.D. Coursework Programmes', tuition: '₹15,000 / Yr', hostel: '₹10,000 / Yr', caution: '₹3,000 (Refundable)' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#6A1B9A] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Fee Structure & Refund Policy</Text>
            <Text className="text-xs text-purple-100 font-medium">Programme Fees, Hostel Charges & UGC Refund Rules</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Fee Structure 2026-2027</Text>
        {feesList.map((f, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
            <Text className="text-sm font-bold text-gray-900 mb-2">{f.programme}</Text>
            <View className="flex-row items-center justify-between border-t border-gray-100 pt-2 text-xs">
              <Text className="text-xs text-gray-600">Tuition: <Text className="font-bold text-[#6A1B9A]">{f.tuition}</Text></Text>
              <Text className="text-xs text-gray-600">Hostel: <Text className="font-bold text-gray-800">{f.hostel}</Text></Text>
            </View>
          </View>
        ))}

        <View className="bg-purple-50 p-4 rounded-2xl border border-purple-200 mb-4">
          <View className="flex-row items-center mb-1">
            <ShieldCheck size={18} color="#6A1B9A" />
            <Text className="text-xs font-bold text-[#6A1B9A] ml-1.5 uppercase">UGC Fee Refund Policy</Text>
          </View>
          <Text className="text-xs text-purple-950 leading-relaxed">
            100% refund of tuition fee upon cancellation of admission 15 days prior to published last date of admission, as per UGC norms.
          </Text>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
