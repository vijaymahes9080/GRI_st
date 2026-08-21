import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Lock, CheckCircle2, BookOpen, Calendar, Award, FileText, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../core/auth/authStore';

export default function StudentPortalScreen() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();
  const [username, setUsername] = useState('21304012');
  const [password, setPassword] = useState('StudentPass#123');

  const handleStudentLogin = () => {
    setAuth(
      {
        id: 'std_21304012',
        username: username,
        email: 'student@test.edu',
        fullName: 'Vijay M',
        role: 'STUDENT',
        department: 'School of Sciences — Dept of Computer Science & Applications',
        rollNumber: username || '21304012',
      },
      'student_access_token_2026',
      'student_refresh_token_2026'
    );
  };

  const handleStudentLogout = async () => {
    Alert.alert('Sign Out', 'Sign out of Student Portal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const isStudentLoggedIn = isAuthenticated && user?.role === 'STUDENT';

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#0D47A1] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">Samarth@GRI Student Portal</Text>
            <Text className="text-xs text-blue-100 font-medium">Authenticated Student Dashboard</Text>
          </View>
          {isStudentLoggedIn && (
            <TouchableOpacity onPress={handleStudentLogout} className="p-2 bg-rose-500/80 rounded-xl">
              <LogOut size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {!isStudentLoggedIn ? (
          <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <Text className="text-base font-bold text-gray-900 mb-1">Student Portal Login</Text>
            <Text className="text-xs text-gray-600 mb-4">Enter your University Register Number and Password to access your profile.</Text>

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Register Number / Roll No</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 mb-3">
              <User size={18} color="#6B7280" />
              <TextInput
                value={username}
                onChangeText={setUsername}
                className="flex-1 ml-2 text-sm text-gray-900 font-medium"
              />
            </View>

            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Portal Password</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 mb-4">
              <Lock size={18} color="#6B7280" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="flex-1 ml-2 text-sm text-gray-900 font-medium"
              />
            </View>

            <TouchableOpacity
              onPress={handleStudentLogin}
              className="bg-[#0D47A1] p-3.5 rounded-xl items-center shadow-sm mb-3"
            >
              <Text className="text-xs font-bold text-white uppercase">Access Student Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/auth/login')}
              className="p-2 items-center"
            >
              <Text className="text-xs font-semibold text-[#0D47A1]">Switch to Multi-User Role Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View className="bg-white p-4 rounded-2xl border border-blue-200 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <View>
                  <Text className="text-lg font-bold text-gray-900">Vijay M</Text>
                  <Text className="text-xs font-semibold text-[#0D47A1]">Reg No: 21304012 • MCA (Semester VI)</Text>
                </View>
                <View className="bg-blue-100 px-2.5 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-[#0D47A1]">Active Student</Text>
                </View>
              </View>
              <Text className="text-xs text-gray-600">School of Sciences — Dept of Computer Science & Applications</Text>
            </View>

            <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Student Dashboard Modules</Text>

            <View className="flex-row flex-wrap justify-between">
              {[
                { title: 'Academic Courses', sub: '6 Registered', icon: BookOpen, color: '#518214' },
                { title: 'Attendance', sub: '92.5% Present', icon: CheckCircle2, color: '#2E7D32' },
                { title: 'Internal Marks', sub: 'CIA 1 & 2 Posted', icon: Award, color: '#F16236' },
                { title: 'ESE Timetable', sub: 'Nov 2026 Exam', icon: Calendar, color: '#00838F' },
                { title: 'Fee Payment', sub: 'No Dues Pending', icon: FileText, color: '#6A1B9A' },
                { title: 'Documents', sub: 'Grade Sheets & ID', icon: User, color: '#0D47A1' },
              ].map((mod, idx) => {
                const IconComp = mod.icon;
                return (
                  <View key={idx} className="w-[48%] bg-white p-3.5 rounded-2xl border border-gray-200 mb-3 shadow-sm">
                    <View className="p-2.5 rounded-xl self-start mb-2" style={{ backgroundColor: `${mod.color}15` }}>
                      <IconComp size={20} color={mod.color} />
                    </View>
                    <Text className="text-sm font-bold text-gray-900 mb-0.5">{mod.title}</Text>
                    <Text className="text-xs font-semibold text-gray-500">{mod.sub}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
