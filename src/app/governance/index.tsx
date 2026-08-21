import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Shield, Users, CheckCircle2 } from 'lucide-react-native';
import { GRI_GOVERNANCE_BODIES } from '../../core/data/griBlueprintData';

export default function GovernanceScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#911C03] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Governance System</Text>
            <Text className="text-xs text-rose-100 font-medium">Statutory Authorities & Decision-Making Bodies</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-rose-50 border border-rose-200 p-4 rounded-2xl mb-4">
          <Text className="text-xs font-bold text-[#911C03] uppercase tracking-wider mb-1">GRI Society & Statutory Structure</Text>
          <Text className="text-sm text-gray-900 font-medium leading-relaxed">
            The Gandhigram Rural Institute operates under the administrative guidance of the Board of Management, Planning & Monitoring Board, Academic Council, and Finance Committee as per UGC Regulations.
          </Text>
        </View>

        <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Statutory Councils & Boards</Text>

        {GRI_GOVERNANCE_BODIES.map((body) => (
          <View key={body.id} className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1 pr-2">
                <View className="p-2.5 bg-rose-100 rounded-xl mr-3">
                  <Shield size={20} color="#911C03" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">{body.name}</Text>
                  <Text className="text-xs text-[#911C03] font-medium">Chairman: {body.chairman}</Text>
                </View>
              </View>
              <View className="bg-rose-100 px-2.5 py-1 rounded-full">
                <Text className="text-[10px] font-bold text-[#911C03]">{body.compositionCount} Members</Text>
              </View>
            </View>

            <Text className="text-xs text-gray-600 leading-relaxed mb-3">{body.description}</Text>

            <Text className="text-xs font-bold text-gray-800 mb-1.5 uppercase">Key Functions & Mandate</Text>
            {body.keyFunctions.map((fn, idx) => (
              <View key={idx} className="flex-row items-start mb-1">
                <CheckCircle2 size={14} color="#911C03" style={{ marginTop: 2 }} />
                <Text className="text-xs text-gray-700 ml-2 flex-1">{fn}</Text>
              </View>
            ))}
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
