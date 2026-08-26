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
import { useResponsive } from '../../core/responsive/useResponsive';

export default function HomeScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  
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
    <View className="flex-1 bg-slate-50">
      <Header
        title="Dashboard"
        subtitle="Gandhigram Rural Institute"
        variant="white"
        rightAction={
          <TouchableOpacity className="p-2 bg-slate-100 rounded-full border border-slate-200">
            <Bell size={20} color="#475569" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 24 : 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
          
          {/* Official Website Live Banner */}
          <View className="bg-red-900 p-4 rounded-xl mb-6 shadow-sm border border-red-800 flex-row">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <CheckCircle2 size={16} color="#FFCC80" />
                <Text className="text-xs font-bold text-amber-200 ml-1.5 tracking-widest uppercase">
                  Important Update
                </Text>
              </View>
              <Text className="text-white font-bold text-base mb-1">
                End Semester Examinations & Samarth Portal
              </Text>
              <Text className="text-sm text-red-100 leading-relaxed">
                All students are advised to download hall tickets and clear semester fees before examination commencement.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: isTablet ? 'row' : 'column', gap: 16, marginBottom: 24 }}>
            {/* Quick Stats Grid */}
            <View className="flex-1 flex-row gap-4">
              <View className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <Text className="text-xs text-slate-500 font-medium uppercase tracking-wider">Attendance Rate</Text>
                <Text className="text-3xl font-bold text-emerald-700 mt-1">92.4%</Text>
              </View>
              <View className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <Text className="text-xs text-slate-500 font-medium uppercase tracking-wider">Cumulative CGPA</Text>
                <Text className="text-3xl font-bold text-red-800 mt-1">8.85</Text>
              </View>
            </View>
          </View>

          {/* Explore GRI Gateway */}
          <Card 
            onPress={() => router.push('/(tabs)/discover')}
            className="bg-khadi-blue p-5 rounded-xl border border-blue-900 shadow-sm flex-row items-center justify-between mb-8"
          >
            <View className="flex-1 pr-4">
              <Text className="text-lg font-bold text-white mb-1">Explore Full University</Text>
              <Text className="text-sm text-blue-100 leading-relaxed">
                Browse all Schools, Departments, Centres, Administration, Tenders, and Campus Facilities in the complete directory.
              </Text>
            </View>
            <View className="bg-white/20 p-3 rounded-full">
              <MapPin size={24} color="#FFFFFF" />
            </View>
          </Card>

          {/* Domain Modules Grid */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-slate-800">University Services</Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {modules.map((mod, index) => {
              const Icon = mod.icon;
              return (
                <Card
                  key={index}
                  onPress={() => router.push(mod.route as any)}
                  className="bg-white border-slate-200 shadow-sm"
                  style={{ width: isTablet ? 'calc(25% - 12px)' : 'calc(50% - 8px)', padding: 16, alignItems: 'center', marginBottom: 0 }}
                >
                  <View className="p-3 rounded-xl mb-3" style={{ backgroundColor: `${mod.color}15` }}>
                    <Icon size={24} color={mod.color} />
                  </View>
                  <Text className="text-sm font-semibold text-slate-700 text-center">{mod.title}</Text>
                </Card>
              );
            })}
          </View>

          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
}
