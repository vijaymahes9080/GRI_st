import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Building, BookOpen, Users, Award, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react-native';
import { GRI_DEPARTMENTS_SAMPLE } from '../../core/data/griBlueprintData';

export default function DepartmentDetailScreen() {
  const router = useRouter();
  const { deptId } = useLocalSearchParams<{ deptId?: string }>();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FACULTY' | 'PROGRAMMES' | 'RESEARCH'>('OVERVIEW');

  const dept = GRI_DEPARTMENTS_SAMPLE.find((d) => d.id === deptId) || GRI_DEPARTMENTS_SAMPLE[0];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1 pr-2">
            <Text className="text-xs text-emerald-100 font-semibold uppercase">{dept.schoolName}</Text>
            <Text className="text-lg font-bold text-white">{dept.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Navigation Section Tabs */}
        <View className="flex-row bg-white p-1.5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'FACULTY', label: 'Faculty' },
            { id: 'PROGRAMMES', label: 'Courses' },
            { id: 'RESEARCH', label: 'Labs' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 rounded-xl items-center ${isActive ? 'bg-[#518214]' : ''}`}
              >
                <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'OVERVIEW' && (
          <View>
            <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
              <Text className="text-xs font-bold text-[#518214] uppercase mb-1">Department Overview</Text>
              <Text className="text-sm text-gray-800 leading-relaxed mb-4">{dept.overview}</Text>

              <View className="border-t border-gray-100 pt-3">
                <Text className="text-xs font-bold text-gray-900 mb-2">Head of Department (HOD)</Text>
                <Text className="text-sm font-bold text-gray-800">{dept.hodName}</Text>
                <Text className="text-xs text-gray-600 mb-3">{dept.hodDesignation}</Text>

                <View className="flex-row items-center justify-between">
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${dept.contactPhone}`)} className="flex-row items-center bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                    <Phone size={14} color="#518214" />
                    <Text className="text-xs font-bold text-[#518214] ml-1.5">{dept.contactPhone}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL(`mailto:${dept.contactEmail}`)} className="flex-row items-center bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                    <Mail size={14} color="#518214" />
                    <Text className="text-xs font-bold text-[#518214] ml-1.5">{dept.contactEmail}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
              <Text className="text-xs font-bold text-gray-900 mb-2 uppercase">Specialized Facilities & Labs</Text>
              {dept.facilities.map((fac, idx) => (
                <View key={idx} className="flex-row items-center mb-2">
                  <CheckCircle2 size={15} color="#518214" />
                  <Text className="text-xs text-gray-700 font-medium ml-2">{fac}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'FACULTY' && (
          <View>
            <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Department Faculty Members</Text>
            {dept.faculty.map((fac, idx) => (
              <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center">
                <View className="p-3 bg-emerald-100 rounded-full mr-3">
                  <Users size={20} color="#518214" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">{fac.name}</Text>
                  <Text className="text-xs font-semibold text-[#518214]">{fac.designation}</Text>
                  <Text className="text-xs text-gray-500">{fac.qualification}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'PROGRAMMES' && (
          <View>
            <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Academic Programmes Offered</Text>
            {dept.programmes.map((prog, idx) => (
              <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-base font-bold text-gray-900 flex-1 pr-2">{prog.name}</Text>
                  <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <Text className="text-[10px] font-bold text-[#518214]">{prog.level}</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <Text className="text-xs text-gray-600">Duration: <Text className="font-bold text-gray-800">{prog.duration}</Text></Text>
                  <Text className="text-xs text-gray-600">Intake Capacity: <Text className="font-bold text-gray-800">{prog.intake} Seats</Text></Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'RESEARCH' && (
          <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
            <Text className="text-base font-bold text-gray-900 mb-3">Department Research Focus Areas</Text>
            {dept.researchAreas.map((area, idx) => (
              <View key={idx} className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 mb-2">
                <Text className="text-xs font-bold text-[#518214]">{idx + 1}. {area}</Text>
              </View>
            ))}
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
