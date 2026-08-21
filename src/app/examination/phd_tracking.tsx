import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Award, Search, CheckCircle, Clock } from 'lucide-react-native';

export default function PhdTrackingScreen() {
  const router = useRouter();
  const [regNo, setRegNo] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#6A1B9A] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Online Ph.D. Status Tracking</Text>
            <Text className="text-xs text-purple-100 font-medium">Research Scholar Thesis & Viva Verification</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-xs font-bold text-gray-700 uppercase mb-2">Search Scholar Record</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 mb-3">
            <Search size={18} color="#6B7280" />
            <TextInput
              placeholder="Enter Ph.D. Registration No (e.g. PHD2024CS001)..."
              value={regNo}
              onChangeText={setRegNo}
              className="flex-1 ml-2 text-sm text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity
            onPress={() => setSearched(true)}
            className="bg-[#6A1B9A] p-3 rounded-xl items-center shadow-sm"
          >
            <Text className="text-xs font-bold text-white uppercase">Track Status</Text>
          </TouchableOpacity>
        </View>

        {searched && (
          <View className="bg-white p-4 rounded-2xl border border-purple-200 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold text-gray-900">Registration: PHD2024CS001</Text>
              <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-emerald-800">In Evaluation</Text>
              </View>
            </View>
            <Text className="text-xs text-gray-600 mb-1">Scholar: K. Senthil Kumar</Text>
            <Text className="text-xs text-gray-600 mb-3">Department: Department of Computer Science & Applications</Text>

            <Text className="text-xs font-bold text-gray-800 uppercase mb-2">Milestone Timeline</Text>

            {[
              { title: 'Course Work Completion & Examination', status: 'Completed', date: 'Jan 2025' },
              { title: 'Doctoral Committee Comprehensive Viva', status: 'Completed', date: 'Jun 2025' },
              { title: 'Synopsis Submission & Approval', status: 'Completed', date: 'Dec 2025' },
              { title: 'Thesis Submission & Foreign Examiner Review', status: 'In Progress', date: 'Aug 2026' },
              { title: 'Public Defense & Open Viva-Voce', status: 'Pending', date: 'Expected Nov 2026' },
            ].map((m, idx) => (
              <View key={idx} className="flex-row items-start mb-2.5">
                {m.status === 'Completed' ? (
                  <CheckCircle size={16} color="#2E7D32" style={{ marginTop: 2 }} />
                ) : m.status === 'In Progress' ? (
                  <Clock size={16} color="#F16236" style={{ marginTop: 2 }} />
                ) : (
                  <View className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2 mt-0.5" />
                )}
                <View className="ml-2 flex-1">
                  <Text className="text-xs font-bold text-gray-800">{m.title}</Text>
                  <Text className="text-[11px] text-gray-500">{m.status} • {m.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
