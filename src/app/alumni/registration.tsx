import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Award, Heart, CheckCircle2 } from 'lucide-react-native';

export default function AlumniRegistrationScreen() {
  const router = useRouter();
  const [registered, setRegistered] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#E65100] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Alumni Cell Registration</Text>
            <Text className="text-xs text-orange-100 font-medium">Join 40,000+ Alumni & Contribute to RaiseGRI</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {!registered ? (
          <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
            <Text className="text-base font-bold text-gray-900 mb-1">Alumni Network Membership</Text>
            <Text className="text-xs text-gray-500 mb-4">Register your batch details & connect with GRI community</Text>

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Full Name</Text>
            <TextInput placeholder="Your official name" className="border border-gray-300 p-3 rounded-xl mb-3 text-sm text-gray-900" />

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Programme & Graduation Year</Text>
            <TextInput placeholder="e.g. M.Sc. Physics (2018 Batch)" className="border border-gray-300 p-3 rounded-xl mb-3 text-sm text-gray-900" />

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Current Organization & Designation</Text>
            <TextInput placeholder="e.g. Senior Researcher at ISRO" className="border border-gray-300 p-3 rounded-xl mb-4 text-sm text-gray-900" />

            <TouchableOpacity onPress={() => setRegistered(true)} className="bg-[#E65100] p-3.5 rounded-xl items-center shadow-sm">
              <Text className="text-white font-bold text-sm uppercase">Complete Registration</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-orange-50 p-6 rounded-2xl border border-orange-200 items-center shadow-sm mb-4">
            <CheckCircle2 size={48} color="#E65100" className="mb-2" />
            <Text className="text-lg font-bold text-gray-900 text-center mb-1">Welcome to GRI Alumni Association!</Text>
            <Text className="text-xs text-gray-600 text-center mb-4">
              Your alumni registration ID is <Text className="font-bold text-[#E65100]">ALUM-GRI-2026-881</Text>.
            </Text>
            <TouchableOpacity onPress={() => setRegistered(false)} className="bg-[#E65100] px-5 py-2.5 rounded-xl">
              <Text className="text-white font-bold text-xs">Back to Form</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
