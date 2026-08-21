import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText, Download } from 'lucide-react-native';

export default function GovernanceDocumentsScreen() {
  const router = useRouter();

  const docs = [
    { title: 'Memorandum of Association (MoA)', size: '2.4 MB', date: 'Official MoE Document' },
    { title: 'GRI Rules & Regulations Booklet', size: '3.1 MB', date: 'Statutory Body Code' },
    { title: 'Board of Management Resolution Archive 2025', size: '1.8 MB', date: 'BoM Records' },
    { title: 'Academic Council Ordinance Manual', size: '4.2 MB', date: 'Academic Regulations' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#911C03] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Governance Documents</Text>
            <Text className="text-xs text-orange-100 font-medium">Official MoA, Statutes & Gazette Regulations</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Official Publications</Text>
        {docs.map((d, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="p-3 bg-red-50 rounded-xl mr-3">
                <FileText size={20} color="#911C03" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-gray-900 mb-0.5">{d.title}</Text>
                <Text className="text-[11px] text-gray-500">{d.date} · {d.size}</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-red-50 p-2.5 rounded-xl border border-red-100">
              <Download size={18} color="#911C03" />
            </TouchableOpacity>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
