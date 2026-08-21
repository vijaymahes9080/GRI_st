import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileSpreadsheet, Award } from 'lucide-react-native';

export default function AnnualReportsScreen() {
  const router = useRouter();

  const reports = [
    { year: 'Annual Report 2025-2026', status: 'Published', pages: '240 Pages' },
    { year: 'Annual Report 2024-2025', status: 'Published', pages: '228 Pages' },
    { year: 'Annual Report 2023-2024', status: 'Published', pages: '215 Pages' },
    { year: 'Annual Report 2022-2023', status: 'Published', pages: '204 Pages' },
    { year: 'Annual Accounts & Audit 2024-25', status: 'CAG Audited', pages: '145 Pages' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Annual Reports & Audit</Text>
            <Text className="text-xs text-emerald-100 font-medium">Parliamentary Tabled Official Reports</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Published Annual Reports</Text>

          {reports.map((rep, idx) => (
            <View key={idx} className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 pr-2">
                <View className="p-2.5 bg-emerald-100 rounded-xl mr-3">
                  <FileSpreadsheet size={18} color="#518214" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-900 mb-0.5">{rep.year}</Text>
                  <Text className="text-xs font-semibold text-gray-500">{rep.pages} • {rep.status}</Text>
                </View>
              </View>
              <View className="bg-[#518214] px-3 py-1 rounded-lg">
                <Text className="text-[11px] font-bold text-white">VIEW</Text>
              </View>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
