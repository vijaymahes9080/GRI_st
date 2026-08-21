import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, Users } from 'lucide-react-native';

export default function CodeOfConductScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Code of Conduct</Text>
            <Text className="text-xs text-emerald-100 font-medium">Ethics Guidelines for Students, Teaching & Staff</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Student Code of Conduct</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            Adherence to Gandhian values, dress code guidelines, campus green practices, minimum 75% attendance rule, and prohibition of ragging or substance abuse.
          </Text>

          <Text className="text-base font-bold text-gray-900 mb-2">Teaching & Non-Teaching Code</Text>
          <Text className="text-xs text-gray-700 leading-relaxed">
            Professional integrity, punctual class attendance, timely evaluation of CIA/ESE marks, and active engagement in village extension activities.
          </Text>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
