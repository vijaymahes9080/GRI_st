import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, GraduationCap, Building, ChevronRight, Award, CheckCircle2 } from 'lucide-react-native';
import { GRI_SCHOOLS, GRI_DEPARTMENTS_SAMPLE } from '../../core/data/griBlueprintData';

export default function AcademicsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'SCHOOLS' | 'DEPTS' | 'CBCS' | 'CALENDAR'>('SCHOOLS');

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#F16236] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Academics & Schools</Text>
            <Text className="text-xs text-orange-100 font-medium">7 Schools, 30+ Departments, CBCS & Research</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Tab Selector */}
        <View className="flex-row bg-white p-1.5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          {[
            { id: 'SCHOOLS', label: '7 Schools' },
            { id: 'DEPTS', label: 'Depts' },
            { id: 'CBCS', label: 'CBCS System' },
            { id: 'CALENDAR', label: 'Calendar' },
          ].map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setSelectedTab(tab.id as any)}
                className={`flex-1 py-2 rounded-xl items-center ${isActive ? 'bg-[#F16236]' : ''}`}
              >
                <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedTab === 'SCHOOLS' && (
          <View>
            <Text className="text-sm font-bold text-gray-800 uppercase mb-3">7 Major Schools Directory</Text>
            {GRI_SCHOOLS.map((school) => (
              <View key={school.id} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3.5 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1 pr-2">
                    <View className="p-2.5 bg-orange-100 rounded-xl mr-3">
                      <Building size={20} color="#F16236" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900">{school.name}</Text>
                      <Text className="text-xs text-[#F16236] font-semibold">Dean: {school.deanName}</Text>
                    </View>
                  </View>
                  <View className="bg-orange-100 px-2.5 py-1 rounded-full">
                    <Text className="text-[10px] font-bold text-[#F16236]">{school.departmentsCount} Depts</Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-600 mb-3">{school.description}</Text>
                <View className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                  <Text className="text-xs font-bold text-gray-800 mb-1">Departments:</Text>
                  <Text className="text-xs text-gray-700 leading-relaxed">{school.departments.join(' • ')}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'DEPTS' && (
          <View>
            <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Department Detail Explorer</Text>
            {GRI_DEPARTMENTS_SAMPLE.map((dept) => (
              <TouchableOpacity
                key={dept.id}
                onPress={() => router.push({ pathname: '/academics/department_detail', params: { deptId: dept.id } })}
                className="bg-white p-4 rounded-2xl border border-gray-200 mb-3.5 shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-[#F16236] uppercase mb-0.5">{dept.schoolName}</Text>
                  <Text className="text-base font-bold text-gray-900 mb-1">{dept.name}</Text>
                  <Text className="text-xs text-gray-600 font-medium">HOD: {dept.hodName} ({dept.hodDesignation})</Text>
                  <Text className="text-xs text-emerald-700 font-semibold mt-1">{dept.programmes.length} Academic Programmes Offered</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedTab === 'CBCS' && (
          <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Award size={22} color="#F16236" />
              <Text className="text-base font-bold text-gray-900 ml-2.5">Choice Based Credit System (CBCS)</Text>
            </View>
            <Text className="text-xs text-gray-600 leading-relaxed mb-4">
              GRI adopted CBCS in 2008 and updated regulations in 2015, 2018, 2021, and 2024. Evaluation combines Continuous Internal Assessment (CIA - 40%) and End Semester Examination (ESE - 60%).
            </Text>
            <View className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-3">
              <Text className="text-xs font-bold text-gray-800 mb-1">Evaluation Component Ratio:</Text>
              <Text className="text-xs text-gray-700">• Continuous Internal Assessment (CIA): 40% Marks</Text>
              <Text className="text-xs text-gray-700">• End Semester Examination (ESE): 60% Marks</Text>
            </View>
            <View className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <Text className="text-xs font-bold text-emerald-900 mb-1">Grading System (CGPA / SGPA):</Text>
              <Text className="text-xs text-emerald-800">• 10-Point Letter Grade System (O, A+, A, B+, B, C, P, F)</Text>
            </View>
          </View>
        )}

        {selectedTab === 'CALENDAR' && (
          <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
            <Text className="text-base font-bold text-gray-900 mb-2">Academic Calendar & Student Handbook</Text>
            <Text className="text-xs text-gray-600 leading-relaxed mb-3">
              Contains semester start dates, Working Days schedules, Mid-Semester examinations, CIA tests, sports meet, and official university holidays.
            </Text>
            <View className="bg-orange-50 p-3 rounded-xl border border-orange-200">
              <Text className="text-xs font-bold text-orange-900 mb-1">2026-2027 Odd Semester Schedule:</Text>
              <Text className="text-xs text-orange-800">• Semester Commencement: July 01, 2026</Text>
              <Text className="text-xs text-orange-800">• CIA Test I: August 25, 2026</Text>
              <Text className="text-xs text-orange-800">• CIA Test II: October 15, 2026</Text>
              <Text className="text-xs text-orange-800">• ESE Examinations: November 18, 2026</Text>
            </View>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
