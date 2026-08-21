import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileCheck, Calendar, CheckCircle, Search, Award, FileText } from 'lucide-react-native';

export default function ExaminationScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#00838F] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Examination System</Text>
            <Text className="text-xs text-cyan-100 font-medium">Controller of Examinations (CoE) Portal</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Quick Tools Tile */}
        <TouchableOpacity
          onPress={() => router.push('/examination/timetable')}
          className="bg-[#00838F] p-4 rounded-2xl mb-4 shadow-sm flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <View className="p-3 bg-white/20 rounded-xl mr-3">
              <Calendar size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white">ESE Examination Timetable Query</Text>
              <Text className="text-xs text-cyan-100 font-medium">Search exam schedule by course, department, or date</Text>
            </View>
          </View>
          <View className="bg-white px-3 py-1.5 rounded-xl">
            <Text className="text-xs font-bold text-[#00838F]">OPEN →</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Examination Services & Applications</Text>

        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-bold text-gray-900">Official Academic Transcripts</Text>
            <View className="bg-cyan-100 px-2.5 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-[#00838F]">Procedure</Text>
            </View>
          </View>
          <Text className="text-xs text-gray-600 mb-3">Guidelines for requesting official transcripts for higher studies abroad or WES evaluation.</Text>
          <View className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <Text className="text-xs text-gray-700">• Application Fee: Rs. 500 per copy</Text>
            <Text className="text-xs text-gray-700">• Processing Time: 7 Working Days</Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-bold text-gray-900">Duplicate Degree Certificate</Text>
            <View className="bg-cyan-100 px-2.5 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-[#00838F]">Procedure</Text>
            </View>
          </View>
          <Text className="text-xs text-gray-600 mb-2">Requires Police FIR copy, Non-Traceable Certificate, and sworn Affidavit before Judicial Magistrate.</Text>
        </View>

        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">e-SANAD Document Verification</Text>
          <Text className="text-xs text-gray-600 mb-3">Digital verification of academic documents integrated with Ministry of External Affairs (MEA), Govt of India.</Text>
          <View className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <Text className="text-xs font-bold text-emerald-900 mb-1">Verification Steps:</Text>
            <Text className="text-xs text-emerald-800">1. Register on e-SANAD portal with Register Number</Text>
            <Text className="text-xs text-emerald-800">2. Pay University Verification Fee (Rs. 1,000)</Text>
            <Text className="text-xs text-emerald-800">3. MEA Attestation completes digitally</Text>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
