import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileCheck, CheckCircle2 } from 'lucide-react-native';

export default function TranscriptsApplicationScreen() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#00838F] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Transcripts & Degree Verification</Text>
            <Text className="text-xs text-cyan-100 font-medium">Official Academic Transcripts & Duplicate Degree Certificates</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {!submitted ? (
          <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
            <Text className="text-base font-bold text-gray-900 mb-1">Application for Official Transcript</Text>
            <Text className="text-xs text-gray-500 mb-4">Enter register details to issue attested academic mark statements</Text>

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Student Register Number</Text>
            <TextInput placeholder="e.g. GRI-2024-8841" className="border border-gray-300 p-3 rounded-xl mb-3 text-sm text-gray-900" />

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Programme & Department</Text>
            <TextInput placeholder="e.g. MCA - Computer Science" className="border border-gray-300 p-3 rounded-xl mb-3 text-sm text-gray-900" />

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Number of Transcript Copies</Text>
            <TextInput placeholder="e.g. 2 Copies" keyboardType="numeric" className="border border-gray-300 p-3 rounded-xl mb-4 text-sm text-gray-900" />

            <TouchableOpacity onPress={() => setSubmitted(true)} className="bg-[#00838F] p-3.5 rounded-xl items-center shadow-sm">
              <Text className="text-white font-bold text-sm uppercase">Submit Transcript Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 items-center shadow-sm mb-4">
            <CheckCircle2 size={48} color="#00838F" className="mb-2" />
            <Text className="text-lg font-bold text-gray-900 text-center mb-1">Application Received!</Text>
            <Text className="text-xs text-gray-600 text-center mb-4">
              Your transcript application token is <Text className="font-bold text-[#00838F]">TR-2026-9921</Text>. Payment request link sent to your registered email.
            </Text>
            <TouchableOpacity onPress={() => setSubmitted(false)} className="bg-[#00838F] px-5 py-2.5 rounded-xl">
              <Text className="text-white font-bold text-xs">New Request</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
