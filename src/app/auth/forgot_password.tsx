import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Key, CheckCircle2 } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [sent, setSent] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Reset Account Password</Text>
            <Text className="text-xs text-emerald-100 font-medium">GRI Student, Scholar & Staff Password Recovery</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {!sent ? (
          <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
            <Text className="text-base font-bold text-gray-900 mb-1">Recover Credentials</Text>
            <Text className="text-xs text-gray-500 mb-4">Enter your registered Roll Number or institutional Email ID</Text>

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Roll Number / User ID</Text>
            <TextInput placeholder="e.g. GRI-2024-8841" className="border border-gray-300 p-3 rounded-xl mb-3 text-sm text-gray-900" />

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Registered Email ID</Text>
            <TextInput placeholder="student@ruraluniv.ac.in" keyboardType="email-address" className="border border-gray-300 p-3 rounded-xl mb-4 text-sm text-gray-900" />

            <TouchableOpacity onPress={() => setSent(true)} className="bg-[#518214] p-3.5 rounded-xl items-center shadow-sm">
              <Text className="text-white font-bold text-sm uppercase">Send Recovery OTP</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 items-center shadow-sm mb-4">
            <CheckCircle2 size={48} color="#518214" className="mb-2" />
            <Text className="text-lg font-bold text-gray-900 text-center mb-1">Recovery OTP Sent!</Text>
            <Text className="text-xs text-gray-600 text-center mb-4">
              Password reset link has been dispatched to your institutional mail address.
            </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/student_login')} className="bg-[#518214] px-5 py-2.5 rounded-xl">
              <Text className="text-white font-bold text-xs">Return to Login</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
