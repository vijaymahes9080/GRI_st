import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Phone, Mail } from 'lucide-react-native';

export default function FinanceOfficerScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#0D47A1] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Finance Officer</Text>
            <Text className="text-xs text-blue-100 font-medium">Head of Finance & Accounts Division</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm items-center">
          <View className="p-4 bg-blue-100 rounded-full mb-3">
            <User size={40} color="#0D47A1" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-0.5">Shri S. Ramanathan</Text>
          <Text className="text-xs font-semibold text-[#0D47A1] mb-4">Finance Officer, GRI</Text>

          <View className="w-full bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
            <Text className="text-xs font-bold text-[#0D47A1] uppercase mb-1">Responsibilities</Text>
            <Text className="text-xs text-gray-700 leading-relaxed">
              Managing university budget, UGC grants, CAG audit compliance, salary disbursements, and student fee accounts.
            </Text>
          </View>

          <View className="w-full border-t border-gray-100 pt-3">
            <TouchableOpacity onPress={() => Linking.openURL('tel:+914512452310')} className="flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-200 mb-2">
              <Phone size={16} color="#0D47A1" />
              <Text className="text-xs font-semibold text-gray-800 ml-2.5">+91 451 2452310</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:fo@ruraluniv.ac.in')} className="flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
              <Mail size={16} color="#0D47A1" />
              <Text className="text-xs font-semibold text-gray-800 ml-2.5">fo@ruraluniv.ac.in</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
