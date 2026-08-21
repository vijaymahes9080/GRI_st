import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Layers, Download, CheckCircle2 } from 'lucide-react-native';

export default function CBCSScreen() {
  const router = useRouter();

  const cbcsRevisions = [
    { year: '2024 Revision', status: 'ACTIVE CURRENT', desc: 'Outcome-Based Education (OBE) & NEP 2020 Aligned Credit Structure' },
    { year: '2021 Revision', status: 'ARCHIVED', desc: 'Choice-Based Credit Regulations for 2021-2023 Enrolled Batches' },
    { year: '2018 Revision', status: 'ARCHIVED', desc: 'CBCS Curriculum Framework Regulations for 2018-2020 Batches' },
    { year: '2015 Revision', status: 'ARCHIVED', desc: 'Modular Credit Regulations & Grade Point Evaluation Scheme' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#F16236] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">CBCS Regulations & Curricula</Text>
            <Text className="text-xs text-orange-100 font-medium">Versioned Choice Based Credit System Frameworks</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Regulation Frameworks</Text>
        {cbcsRevisions.map((item, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <Layers size={18} color="#F16236" />
                <Text className="text-sm font-bold text-gray-900 ml-2">{item.year}</Text>
              </View>
              <View className={`px-2 py-0.5 rounded-md ${idx === 0 ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <Text className={`text-[10px] font-bold ${idx === 0 ? 'text-emerald-800' : 'text-gray-600'}`}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text className="text-xs text-gray-600 leading-relaxed mb-3">{item.desc}</Text>
            <TouchableOpacity className="flex-row items-center justify-center bg-orange-50 py-2 rounded-xl border border-orange-100">
              <Download size={14} color="#F16236" />
              <Text className="text-xs font-bold text-[#F16236] ml-1.5">Download Regulations PDF</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
