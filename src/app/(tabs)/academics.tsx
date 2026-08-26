import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Radio, Clock, BookOpen, GraduationCap, MapPin, Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';

export default function AcademicsScreen() {
  const [scanning, setScanning] = useState(false);
  const [marked, setMarked] = useState(false);
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;

  const courses = [
    { code: 'CS-401', name: 'Mobile Application Architecture', time: '09:30 AM - 10:30 AM', faculty: 'Dr. R. Ramanathan', status: 'PRESENT', room: 'Lecture Hall 1' },
    { code: 'CS-402', name: 'Distributed Cloud Systems', time: '10:30 AM - 11:30 AM', faculty: 'Dr. S. Meenakshi', status: 'PRESENT', room: 'Lecture Hall 2' },
    { code: 'CS-403', name: 'Deep Learning & Vector RAG', time: '11:45 AM - 12:45 PM', faculty: 'Dr. K. Swaminathan', status: 'UPCOMING', room: 'Computer Lab 2' },
    { code: 'CS-404', name: 'Software Project Management', time: '02:00 PM - 03:00 PM', faculty: 'Dr. V. Rajesh', status: 'UPCOMING', room: 'Seminar Hall' },
  ];

  const handleScanBleAttendance = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setMarked(true);
      Alert.alert('BLE Attendance Recorded', 'Verified via BLE Beacon GRI-CS-LAB-01 (Geo-fence Confirmed)');
    }, 1500);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 32 : 20, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeIn.duration(400)} className="mb-6">
            <Text className="text-sm font-medium text-slate-500 mb-1 tracking-wider uppercase">BCA (Hons) • Semester 4</Text>
            <Text className="text-3xl font-bold text-slate-900">Academics</Text>
          </Animated.View>

          {/* Geo-fenced BLE Attendance Scanner Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-primary-200 overflow-hidden">
              <View className="absolute -right-8 -top-8 w-40 h-40 bg-primary-50 rounded-full blur-xl" />
              
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full">
                  <Radio size={16} color={colors.primary} />
                  <Text className="text-xs font-bold text-primary-700 ml-2 tracking-widest uppercase">Live Class Scanner</Text>
                </View>
                {marked && (
                  <View className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Verified</Text>
                  </View>
                )}
              </View>

              <Text className="text-2xl font-bold text-slate-900 mb-2 leading-tight">CS-403: Deep Learning</Text>
              
              <View className="flex-row items-center mb-6">
                <MapPin size={16} color={colors.primary} />
                <Text className="text-sm font-medium text-slate-600 ml-2">Beacon: GRI-CS-LAB-01 (Verified Range)</Text>
              </View>

              <TouchableOpacity 
                className={`w-full py-4 rounded-2xl flex-row items-center justify-center ${marked ? 'bg-emerald-50 border border-emerald-200' : 'bg-primary-600'} shadow-sm`}
                onPress={handleScanBleAttendance}
                disabled={marked || scanning}
                activeOpacity={0.8}
              >
                <Radio size={20} color={marked ? '#059669' : '#FFFFFF'} />
                <Text className={`text-base font-bold ml-2 ${marked ? 'text-emerald-700' : 'text-white'}`}>
                  {marked ? 'Attendance Captured ✓' : scanning ? 'Scanning Beacons...' : 'Mark Geo Attendance'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Timetable Schedule */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-slate-900">Today's Timetable</Text>
              <Text className="text-sm font-semibold text-primary-600">View Full</Text>
            </View>
            
            <View style={{ flexDirection: isTablet ? 'row' : 'column', flexWrap: 'wrap', gap: 16 }}>
              {courses.map((course, idx) => (
                <Card 
                  key={idx} 
                  className="p-5 border-slate-100 shadow-sm bg-white" 
                  style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}
                >
                  <View className="flex-row items-start justify-between mb-4">
                    <View className="flex-1 pr-4">
                      <View className="flex-row items-center mb-2">
                        <View className={`w-2 h-2 rounded-full mr-2 ${course.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                        <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">{course.code}</Text>
                      </View>
                      <Text className="text-lg font-bold text-slate-900 leading-tight">{course.name}</Text>
                    </View>
                    <View className={`px-3 py-1.5 rounded-lg border ${course.status === 'PRESENT' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                      <Text className={`text-xs font-bold ${course.status === 'PRESENT' ? 'text-emerald-700' : 'text-orange-700'}`}>
                        {course.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center bg-slate-50 p-3 rounded-xl">
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Faculty</Text>
                      <Text className="text-sm font-semibold text-slate-800">{course.faculty}</Text>
                    </View>
                    <View className="w-[1px] h-8 bg-slate-200 mx-4" />
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Time</Text>
                      <Text className="text-sm font-semibold text-slate-800">{course.time}</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </Animated.View>
          
          {/* Quick Links */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-10">
            <View className="flex-row gap-4">
              <TouchableOpacity className="flex-1 bg-primary-50 p-4 rounded-2xl border border-primary-100 items-center">
                <GraduationCap size={24} color={colors.primary} className="mb-2" />
                <Text className="text-sm font-bold text-primary-900">Grades</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-amber-50 p-4 rounded-2xl border border-amber-100 items-center">
                <BookOpen size={24} color={colors.warning} className="mb-2" />
                <Text className="text-sm font-bold text-amber-900">Syllabus</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 items-center">
                <Search size={24} color={colors.success} className="mb-2" />
                <Text className="text-sm font-bold text-emerald-900">Library</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
        </View>
      </ScrollView>
    </View>
  );
}
