import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Shield, CheckCircle2 } from 'lucide-react-native';

export default function GovernanceSystemScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#911C03] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Governance System</Text>
            <Text className="text-xs text-rose-100 font-medium">Statutory Framework & UGC Guidelines</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">GRI Statutory Governance Framework</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            The Gandhigram Rural Institute was registered under the Societies Registration Act and conferred Deemed-to-be-University status under Section 3 of the UGC Act 1956.
          </Text>

          <View className="bg-rose-50 p-4 rounded-xl border border-rose-200 mb-4">
            <Text className="text-xs font-bold text-[#911C03] uppercase mb-2">Statutory Bodies Order of Authority</Text>
            {[
              '1. Board of Management (Apex Executive Council)',
              '2. Academic Council (Principal Academic Authority)',
              '3. Finance Committee (Financial Oversight)',
              '4. Planning and Monitoring Board (Strategic Growth)',
              '5. Boards of Studies (Curriculum Development per Dept)',
            ].map((item, idx) => (
              <Text key={idx} className="text-xs text-gray-800 font-medium mb-1.5">{item}</Text>
            ))}
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
