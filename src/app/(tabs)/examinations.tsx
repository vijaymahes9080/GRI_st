import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Download, Award, FileText, Calendar, CheckCircle, ShieldCheck, LogIn, ChevronRight } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';
import { useAuthStore } from '../../core/auth/authStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ExaminationsScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;
  const { isAuthenticated, user } = useAuthStore();
  
  const results = [
    { code: 'CS-301', title: 'Data Structures & Algorithms', grade: 'A+', credits: 4, points: 10.0 },
    { code: 'CS-302', title: 'Database Management Systems', grade: 'A', credits: 4, points: 9.0 },
    { code: 'CS-303', title: 'Computer Networks', grade: 'A+', credits: 3, points: 10.0 },
    { code: 'CS-304', title: 'Operating Systems', grade: 'B+', credits: 4, points: 8.0 },
  ];

  const handleDownloadHallTicket = () => {
    Alert.alert('Download Started', 'Downloading Sem 4 Hall Ticket (PDF) to device storage.');
  };

  const portalLinks = [
    { title: 'Examination Timetable', desc: 'Schedules for upcoming internal and external exams.', icon: Calendar, route: '/examination/timetable', color: '#0284C7' },
    { title: 'e-SANAD Portal', desc: 'Online document verification and attestation.', icon: CheckCircle, route: '/examination/esanad', color: '#059669' },
    { title: 'Ph.D. Tracking System', desc: 'Track thesis submission and evaluation status.', icon: Award, route: '/examination/phd_tracking', color: '#7C3AED' },
    { title: 'Transcripts & Certificates', desc: 'Apply for official transcripts and degree certificates.', icon: ShieldCheck, route: '/examination/transcripts', color: '#EA580C' },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-primary-900 pt-16 pb-6 px-6 shadow-sm">
        <Text className="text-3xl font-bold text-white mb-1">Examinations</Text>
        <Text className="text-primary-200">Office of the Controller of Examinations</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 32 : 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          {!isAuthenticated && (
            <Animated.View entering={FadeInDown.duration(400)} className="mb-8">
              <View className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-bold text-slate-900 mb-1">Student Results</Text>
                  <Text className="text-sm text-slate-500 mb-4 leading-relaxed">Sign in with your university credentials to view your academic results, hall tickets, and CGPA.</Text>
                  <Button
                    title="Student Login"
                    variant="primary"
                    size="sm"
                    onPress={() => router.push('/auth/login')}
                    leftIcon={<LogIn size={16} color="#FFFFFF" />}
                    style={{ alignSelf: 'flex-start' }}
                  />
                </View>
                <View className="w-16 h-16 bg-primary-50 rounded-full items-center justify-center hidden sm:flex border border-primary-100">
                  <FileText size={28} color={colors.primary} />
                </View>
              </View>
            </Animated.View>
          )}

          {isAuthenticated && (
            <Animated.View entering={FadeInDown.duration(400)} className="mb-8">
              {/* Hall Ticket Card */}
              <Card className="bg-[#911C03] p-6 mb-6 border-0 shadow-md">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <FileText size={20} color="#FECACA" />
                    <Text className="text-xs font-bold text-red-200 ml-2 tracking-wider uppercase">HALL TICKET AVAILABLE</Text>
                  </View>
                  <View className="bg-white/20 px-3 py-1 rounded-md">
                    <Text className="text-xs font-bold text-white tracking-widest uppercase">SEM 4</Text>
                  </View>
                </View>
                <Text className="text-white font-bold text-xl mb-1">End Semester Examinations May 2026</Text>
                <Text className="text-sm text-red-100 mb-6">Exam Center: Block-A Main Auditorium</Text>
                <Button
                  title="Download Hall Ticket PDF"
                  onPress={handleDownloadHallTicket}
                  leftIcon={<Download size={18} color="#911C03" />}
                  className="bg-white border-0 shadow-sm"
                  textClassName="text-[#911C03] font-bold"
                />
              </Card>

              {/* CGPA Summary Card */}
              <Card className="p-6 mb-6 border-slate-200 shadow-sm bg-white">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <Award size={28} color="#059669" />
                    </View>
                    <View className="ml-4">
                      <Text className="text-sm text-slate-500 font-semibold tracking-wider uppercase mb-1">Cumulative Grade Point</Text>
                      <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">8.85 <Text className="text-lg text-slate-400 font-medium">/ 10.0</Text></Text>
                    </View>
                  </View>
                  <View className="bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 hidden sm:flex">
                    <Text className="text-xs font-bold text-emerald-800 tracking-widest uppercase">FIRST CLASS WITH DISTINCTION</Text>
                  </View>
                </View>
              </Card>

              {/* Recent Results */}
              <View className="flex-row items-center justify-between mb-4 px-1">
                <Text className="text-lg font-bold text-slate-900">Semester 3 Marksheet</Text>
                <TouchableOpacity>
                  <Text className="text-sm font-bold text-primary-600">Full Transcript</Text>
                </TouchableOpacity>
              </View>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {results.map((res, idx) => (
                  <Card key={idx} className="p-5 border-slate-200 shadow-sm bg-white" style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}>
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-sm font-bold text-primary-800 tracking-wider">{res.code}</Text>
                      <Badge label={`GRADE ${res.grade}`} variant="success" />
                    </View>
                    <Text className="text-base font-bold text-slate-900 mb-4">{res.title}</Text>
                    
                    <View className="flex-row items-center justify-between border-t border-slate-100 pt-3">
                      <Text className="text-sm font-medium text-slate-500">Credits: <Text className="font-semibold text-slate-700">{res.credits}</Text></Text>
                      <Text className="text-sm font-medium text-slate-500">Grade Points: <Text className="font-semibold text-slate-700">{res.points}</Text></Text>
                    </View>
                  </Card>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Official Portals */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-10">
            <Text className="text-lg font-bold text-slate-900 mb-4 px-1 mt-4">Examination Portals</Text>
            <View className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              {portalLinks.map((portal, idx) => {
                const Icon = portal.icon;
                const isLast = idx === portalLinks.length - 1;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => router.push(portal.route as any)}
                    className={`flex-row items-center p-4 bg-white ${!isLast ? 'border-b border-slate-100' : ''}`}
                    activeOpacity={0.7}
                  >
                    <View className="w-12 h-12 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${portal.color}15` }}>
                      <Icon size={24} color={portal.color} />
                    </View>
                    <View className="flex-1 pr-4">
                      <Text className="text-base font-bold text-slate-900 mb-1">{portal.title}</Text>
                      <Text className="text-xs text-slate-500 leading-relaxed">{portal.desc}</Text>
                    </View>
                    <ChevronRight size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
          
          <View className="h-12" />
        </View>
      </ScrollView>
    </View>
  );
}
