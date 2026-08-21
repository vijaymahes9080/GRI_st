import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, ChevronRight, BookOpen, Shield, Users, GraduationCap, FileText, MapPin } from 'lucide-react-native';

export default function GlobalSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const searchResults = [
    { title: 'Department of Computer Science & Applications', category: 'Academics', route: '/academics/department_detail?deptId=cs', icon: BookOpen, color: '#518214' },
    { title: 'Department of Agriculture', category: 'Academics', route: '/academics/department_detail?deptId=agri', icon: BookOpen, color: '#518214' },
    { title: 'Board of Management (Executive Council)', category: 'Governance', route: '/governance', icon: Shield, color: '#911C03' },
    { title: 'Controller of Examinations (CoE)', category: 'Administration', route: '/administration', icon: Users, color: '#0D47A1' },
    { title: 'Admissions Prospectus 2026-2027', category: 'Admissions', route: '/admissions', icon: GraduationCap, color: '#6A1B9A' },
    { title: 'ESE Examination Timetable Query', category: 'Examinations', route: '/examination/timetable', icon: FileText, color: '#00838F' },
    { title: 'Online Ph.D. Status Tracking', category: 'Examinations', route: '/examination/phd_tracking', icon: FileText, color: '#00838F' },
    { title: 'e-SANAD Document Verification', category: 'Services', route: '/examination/esanad', icon: FileText, color: '#2E7D32' },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Global University Search</Text>
            <Text className="text-xs text-emerald-100 font-medium">Search 220+ courses, departments, rules & portals</Text>
          </View>
        </View>

        {/* Input */}
        <View className="flex-row items-center bg-white rounded-2xl px-3.5 py-2.5 shadow-sm mt-1">
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Type course, department, fee, exam..."
            value={query}
            onChangeText={setQuery}
            autoFocus
            className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-xs font-bold text-gray-700 uppercase mb-3">Search Matches ({searchResults.length})</Text>

        {searchResults.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => router.push(item.route as any)}
              className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 pr-2">
                <View className="p-2.5 rounded-xl mr-3" style={{ backgroundColor: `${item.color}15` }}>
                  <IconComp size={20} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold uppercase mb-0.5" style={{ color: item.color }}>{item.category}</Text>
                  <Text className="text-sm font-bold text-gray-900">{item.title}</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
