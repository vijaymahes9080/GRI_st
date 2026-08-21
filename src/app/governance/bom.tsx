import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Shield, Users, CheckCircle2 } from 'lucide-react-native';

export default function BoardOfManagementScreen() {
  const router = useRouter();

  const members = [
    { name: 'Dr. M. K. Surappa', role: 'Chairman', detail: 'Vice-Chancellor, GRI' },
    { name: 'Shri Joint Secretary (Higher Education)', role: 'Member', detail: 'Nominee of Govt of India, MoE' },
    { name: 'Prof. UGC Nominee Expert', role: 'Member', detail: 'Nominee of University Grants Commission' },
    { name: 'Dr. L. Raja', role: 'Secretary', detail: 'Registrar, GRI' },
    { name: 'Dr. M. Seetharaman', role: 'Member', detail: 'Dean, School of Agriculture & Rural Dev' },
    { name: 'Dr. S. Ramesh', role: 'Member', detail: 'Dean, School of Sciences' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#911C03] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Board of Management (BoM)</Text>
            <Text className="text-xs text-rose-100 font-medium">Apex Executive Council Composition & Functions</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Composition of Board of Management</Text>

          {members.map((m, idx) => (
            <View key={idx} className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100 mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="p-2 bg-rose-100 rounded-lg mr-3">
                  <Users size={18} color="#911C03" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-900">{m.name}</Text>
                  <Text className="text-xs text-gray-600">{m.detail}</Text>
                </View>
              </View>
              <View className="bg-[#911C03] px-2.5 py-1 rounded-full">
                <Text className="text-[10px] font-bold text-white">{m.role}</Text>
              </View>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
