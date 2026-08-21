import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, Calendar, Clock, BookOpen, Filter } from 'lucide-react-native';
import { GRI_EXAM_TIMETABLE_SAMPLE } from '../../core/data/griBlueprintData';

export default function ExamTimetableScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('ALL');

  const filteredExams = GRI_EXAM_TIMETABLE_SAMPLE.filter((item) => {
    const matchesSearch =
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.programme.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProg = selectedProgramme === 'ALL' || item.programme.includes(selectedProgramme);
    return matchesSearch && matchesProg;
  });

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#00838F] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">ESE Examination Timetable</Text>
            <Text className="text-xs text-cyan-100 font-medium">End Semester Schedule Query Tool</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-3.5 py-2.5 mb-3 shadow-sm">
          <Search size={18} color="#6B7280" />
          <TextInput
            placeholder="Filter by course title, code (e.g. 24CSU101)..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2.5 text-sm text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Programme Selector Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {['ALL', 'B.Sc. CS', 'MCA', 'B.Sc. Agri'].map((prog) => {
            const isActive = selectedProgramme === prog;
            return (
              <TouchableOpacity
                key={prog}
                onPress={() => setSelectedProgramme(prog)}
                className={`px-3.5 py-1.5 rounded-full mr-2 border ${
                  isActive ? 'bg-[#00838F] border-[#00838F]' : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-700'}`}>{prog}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text className="text-xs font-bold text-gray-700 uppercase mb-3">Scheduled Examination Papers ({filteredExams.length})</Text>

        {filteredExams.map((exam, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="bg-cyan-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-[#00838F]">{exam.courseCode}</Text>
              </View>
              <Text className="text-xs font-semibold text-gray-500">{exam.programme} • {exam.sem}</Text>
            </View>

            <Text className="text-base font-bold text-gray-900 mb-3">{exam.courseName}</Text>

            <View className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Calendar size={14} color="#00838F" />
                <Text className="text-xs font-bold text-gray-800 ml-1.5">{exam.date}</Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={14} color="#00838F" />
                <Text className="text-xs font-bold text-gray-800 ml-1.5">{exam.time}</Text>
              </View>
            </View>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
