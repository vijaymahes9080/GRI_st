import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle, ShieldCheck, FileText } from 'lucide-react-native';

export default function EsanadScreen() {
  const router = useRouter();
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [programme, setProgramme] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#2E7D32] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">e-SANAD Portal Registration</Text>
            <Text className="text-xs text-emerald-100 font-medium">Digital Attestation & Verification (MEA Integration)</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {!submitted ? (
          <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
            <Text className="text-base font-bold text-gray-900 mb-1">Online Document Verification Request</Text>
            <Text className="text-xs text-gray-600 mb-4">Official verification form for Ministry of External Affairs (MEA) e-SANAD system.</Text>

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Register / Roll Number</Text>
            <TextInput
              placeholder="e.g. 21304012"
              value={regNo}
              onChangeText={setRegNo}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm mb-3 text-gray-900"
            />

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Full Candidate Name (as in Degree)</Text>
            <TextInput
              placeholder="e.g. Vijay M"
              value={name}
              onChangeText={setName}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm mb-3 text-gray-900"
            />

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Programme Name</Text>
            <TextInput
              placeholder="e.g. M.C.A. (Master of Computer Applications)"
              value={programme}
              onChangeText={setProgramme}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm mb-4 text-gray-900"
            />

            <TouchableOpacity
              onPress={() => setSubmitted(true)}
              className="bg-[#2E7D32] p-3.5 rounded-xl items-center shadow-sm"
            >
              <Text className="text-xs font-bold text-white uppercase">Submit Verification Application</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white p-5 rounded-2xl border border-emerald-300 mb-4 shadow-sm items-center">
            <CheckCircle size={48} color="#2E7D32" style={{ marginBottom: 12 }} />
            <Text className="text-lg font-bold text-gray-900 mb-1">Application Registered Successfully!</Text>
            <Text className="text-xs text-gray-600 text-center mb-4 leading-relaxed">
              Your e-SANAD verification reference ID <Text className="font-bold text-[#2E7D32]">GRI-ES-2026-8842</Text> has been created.
            </Text>
            <TouchableOpacity onPress={() => setSubmitted(false)} className="bg-[#2E7D32] px-4 py-2 rounded-xl">
              <Text className="text-xs font-bold text-white">NEW REGISTRATION</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
