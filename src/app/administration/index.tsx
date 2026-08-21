import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, Phone, Mail, Building, ShieldCheck } from 'lucide-react-native';
import { GRI_ADMIN_OFFICERS, GRI_SCHOOLS } from '../../core/data/griBlueprintData';

export default function AdministrationScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#0D47A1] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">University Administration</Text>
            <Text className="text-xs text-blue-100 font-medium">Officers, Deans of Schools & Section Heads</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Key Officers of the University</Text>

        {GRI_ADMIN_OFFICERS.map((officer, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1">
                <View className="p-2.5 bg-blue-100 rounded-xl mr-3">
                  <Users size={20} color="#0D47A1" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">{officer.name}</Text>
                  <Text className="text-xs font-semibold text-[#0D47A1]">{officer.title}</Text>
                </View>
              </View>
            </View>

            <View className="border-t border-gray-100 pt-2.5 mt-1">
              <View className="flex-row items-center mb-1">
                <Building size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600 ml-2">{officer.office}</Text>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${officer.phone}`)} className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                  <Phone size={13} color="#0D47A1" />
                  <Text className="text-xs font-semibold text-[#0D47A1] ml-1.5">{officer.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${officer.email}`)} className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                  <Mail size={13} color="#0D47A1" />
                  <Text className="text-xs font-semibold text-[#0D47A1] ml-1.5">{officer.email}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <Text className="text-sm font-bold text-gray-800 uppercase mt-4 mb-3">Deans of 7 Major Schools</Text>

        {GRI_SCHOOLS.map((school) => (
          <View key={school.id} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
            <Text className="text-sm font-bold text-gray-900 mb-1">{school.name}</Text>
            <Text className="text-xs font-semibold text-emerald-700 mb-2">Dean: {school.deanName}</Text>
            <Text className="text-xs text-gray-600 mb-2">{school.description}</Text>
            <View className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <Text className="text-[11px] font-bold text-gray-700 mb-1">Departments under School ({school.departmentsCount}):</Text>
              <Text className="text-xs text-gray-600">{school.departments.join(' • ')}</Text>
            </View>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
