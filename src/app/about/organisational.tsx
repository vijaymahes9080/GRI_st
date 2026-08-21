import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, Shield, Building } from 'lucide-react-native';

export default function OrganisationalInfoScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Organisational Structure</Text>
            <Text className="text-xs text-emerald-100 font-medium">GRI Organizational Hierarchy & Divisions</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">University Governance Hierarchy</Text>

          {[
            { level: 'Level 1: Chancellor', title: 'Highest Dignitary & Ceremonial Head', desc: 'Appointed by Ministry of Education, Govt of India.' },
            { level: 'Level 2: Vice-Chancellor', title: 'Principal Executive & Academic Officer', desc: 'Provides leadership for academic, research, and administrative functions.' },
            { level: 'Level 3: Board of Management (BoM)', title: 'Apex Executive Body', desc: 'Comprising Ministry nominees, UGC experts, Deans, and Senior Professors.' },
            { level: 'Level 4: Registrar & Finance Officer', title: 'Administrative & Financial Custodians', desc: 'Head of University Administration and Finance & Accounts division.' },
            { level: 'Level 5: Deans of Schools', title: 'Academic Heads of 7 Schools', desc: 'Overseeing curriculum development, department coordination, and faculty.' },
            { level: 'Level 6: Heads of Departments (HODs)', title: 'Department Leaders', desc: 'Managing day-to-day teaching, labs, research projects, and student affairs.' },
          ].map((h, idx) => (
            <View key={idx} className="mb-3.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <Text className="text-xs font-bold text-[#518214] uppercase mb-0.5">{h.level}</Text>
              <Text className="text-sm font-bold text-gray-900 mb-1">{h.title}</Text>
              <Text className="text-xs text-gray-600 leading-relaxed">{h.desc}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
