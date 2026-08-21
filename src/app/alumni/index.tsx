import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, Award, Heart, UserPlus } from 'lucide-react-native';

export default function AlumniScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#E65100] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">GRI Alumni Association</Text>
            <Text className="text-xs text-orange-100 font-medium">Global Network, Reunions & RaiseGRI Fund</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Welcome GRI Alumni</Text>
          <Text className="text-xs text-gray-700 leading-relaxed mb-4">
            Connecting 40,000+ alumni across the globe. Join the Alumni Cell to register, mentor current students, participate in reunions, and contribute to RaiseGRI.
          </Text>

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity onPress={() => router.push('/auth/student_login')} className="w-[48%] bg-orange-500 p-3.5 rounded-xl items-center shadow-sm">
              <UserPlus size={18} color="#FFFFFF" style={{ marginBottom: 4 }} />
              <Text className="text-xs font-bold text-white uppercase">Register / Login</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[48%] bg-emerald-700 p-3.5 rounded-xl items-center shadow-sm">
              <Heart size={18} color="#FFFFFF" style={{ marginBottom: 4 }} />
              <Text className="text-xs font-bold text-white uppercase">RaiseGRI Fund</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-orange-50 p-4 rounded-xl border border-orange-200 mb-2">
            <Text className="text-xs font-bold text-[#E65100] uppercase mb-1">Distinguished Alumni Recognition</Text>
            <Text className="text-xs text-orange-950 leading-relaxed">
              Honoring GRI alumni excelling in civil services, scientific research, organic agriculture startups, and global academic leadership.
            </Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
