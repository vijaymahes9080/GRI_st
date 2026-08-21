import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  FileCheck,
  CreditCard,
  Library,
  Building2,
  Briefcase,
  Bot,
  MapPin,
  Bus,
  AlertCircle,
  Bell,
  CheckCircle2,
} from 'lucide-react-native';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';

export default function HomeScreen() {
  const router = useRouter();

  const modules = [
    { title: 'Academics & Attendance', icon: BookOpen, color: '#518214', route: '/(tabs)/academics' },
    { title: 'Exams & Results', icon: FileCheck, color: '#911C03', route: '/(tabs)/examinations' },
    { title: 'Samarth & Fee Portal', icon: CreditCard, color: '#0D47A1', route: '/(tabs)/academics' },
    { title: 'Hostel & Outpass', icon: Building2, color: '#F16236', route: '/(tabs)/hostel' },
    { title: 'AI Assistant (RAG)', icon: Bot, color: '#C2185B', route: '/(tabs)/ai_chat' },
    { title: 'Library OPAC', icon: Library, color: '#6A1B9A', route: '/(tabs)/academics' },
    { title: 'Placements & Drives', icon: Briefcase, color: '#00838F', route: '/(tabs)/profile' },
    { title: 'Village Outreach', icon: MapPin, color: '#33691E', route: '/(tabs)/home' },
    { title: 'Transport & Bus', icon: Bus, color: '#F57F17', route: '/(tabs)/home' },
    { title: 'Grievance Portal', icon: AlertCircle, color: '#C62828', route: '/(tabs)/profile' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header
        title="GRI Mobile"
        subtitle="Gandhigram Rural Institute · Deemed University"
        variant="green"
        rightAction={
          <TouchableOpacity className="p-2 bg-white/20 rounded-full">
            <Bell size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Official Website Live Banner */}
        <View className="bg-[#911C03] p-4 rounded-2xl mb-5 shadow-sm border border-red-900">
          <View className="flex-row items-center justify-between mb-1.5">
            <View className="flex-row items-center">
              <CheckCircle2 size={18} color="#FFCC80" />
              <Text className="text-xs font-bold text-amber-200 ml-1.5 tracking-wider">
                LIVE FROM RURALUNIV.AC.IN
              </Text>
            </View>
            <View className="bg-emerald-600 px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-white">SYNCED</Text>
            </View>
          </View>
          <Text className="text-white font-bold text-base mb-1">
            End Semester Examinations & Samarth Portal Update
          </Text>
          <Text className="text-xs text-orange-100 leading-relaxed">
            All students are advised to download hall tickets and clear semester fees on ruraluniv.samarth.ac.in before examination commencement.
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row mb-5 gap-3">
          <View className="flex-1 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
            <Text className="text-xs text-gray-500 font-medium">Attendance Rate</Text>
            <Text className="text-2xl font-bold text-[#518214] mt-1">92.4%</Text>
          </View>

          <View className="flex-1 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
            <Text className="text-xs text-gray-500 font-medium">Cumulative CGPA</Text>
            <Text className="text-2xl font-bold text-[#911C03] mt-1">8.85</Text>
          </View>
        </View>

        {/* Domain Modules Grid */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-gray-900">University Services</Text>
          <Text className="text-xs text-emerald-800 font-semibold">Official Portals</Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <Card
                key={index}
                onPress={() => router.push(mod.route as any)}
                className="w-[48%] mb-3 p-4 items-center justify-center border-gray-200 shadow-sm bg-white"
              >
                <View className="p-3 rounded-2xl mb-2" style={{ backgroundColor: `${mod.color}15` }}>
                  <Icon size={26} color={mod.color} />
                </View>
                <Text className="text-sm font-semibold text-gray-800 text-center">{mod.title}</Text>
              </Card>
            );
          })}
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
