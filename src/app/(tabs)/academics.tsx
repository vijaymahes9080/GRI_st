import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Radio, Clock, BookOpen } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function AcademicsScreen() {
  const [scanning, setScanning] = useState(false);
  const [marked, setMarked] = useState(false);
  const { isTablet } = useResponsive();

  const courses = [
    { code: 'CS-401', name: 'Mobile Application Architecture', time: '09:30 AM - 10:30 AM', faculty: 'Dr. R. Ramanathan', status: 'PRESENT' },
    { code: 'CS-402', name: 'Distributed Cloud Systems', time: '10:30 AM - 11:30 AM', faculty: 'Dr. S. Meenakshi', status: 'PRESENT' },
    { code: 'CS-403', name: 'Deep Learning & Vector RAG', time: '11:45 AM - 12:45 PM', faculty: 'Dr. K. Swaminathan', status: 'UPCOMING' },
    { code: 'CS-404', name: 'Software Project Management', time: '02:00 PM - 03:00 PM', faculty: 'Dr. V. Rajesh', status: 'UPCOMING' },
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
      <Header title="Academics & Attendance" subtitle="Semester 4 · Computer Science" variant="white" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 24 : 16 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          {/* Geo-fenced BLE Attendance Scanner Card */}
          <Card className="bg-[#0D47A1] border-0 p-6 mb-8 shadow-md">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Radio size={20} color="#93C5FD" />
                <Text className="text-xs font-bold text-blue-200 ml-2 tracking-wider uppercase">GEO-FENCED BLE ATTENDANCE</Text>
              </View>
              <Badge label={marked ? 'VERIFIED' : 'READY'} variant={marked ? 'success' : 'info'} />
            </View>
            <Text className="text-white font-bold text-xl mb-1">CS-403: Deep Learning & Vector RAG</Text>
            <Text className="text-sm text-blue-200 mb-6">Location: Computer Lab 2 (Beacon GRI-CS-LAB-01)</Text>
            <Button
              title={marked ? 'Attendance Marked ✓' : scanning ? 'Scanning Beacon...' : 'Mark Geo Attendance'}
              onPress={handleScanBleAttendance}
              loading={scanning}
              disabled={marked}
              variant={marked ? 'secondary' : 'primary'}
              size="md"
            />
          </Card>

          {/* Timetable Schedule */}
          <Text className="text-lg font-bold text-slate-900 mb-4 px-1">Today's Class Schedule</Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {courses.map((course, idx) => (
              <Card key={idx} className="p-5 border-slate-200 shadow-sm bg-white" style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
                    <BookOpen size={16} color="#0D47A1" />
                    <Text className="text-sm font-bold text-khadi-blue ml-2 tracking-wider">{course.code}</Text>
                  </View>
                  <Badge
                    label={course.status}
                    variant={course.status === 'PRESENT' ? 'success' : 'neutral'}
                  />
                </View>
                <Text className="text-base font-bold text-slate-900 mb-1">{course.name}</Text>
                <Text className="text-sm font-medium text-slate-600 mb-4">Faculty: <Text className="font-normal text-slate-500">{course.faculty}</Text></Text>
                
                <View className="flex-row items-center border-t border-slate-100 pt-3">
                  <Clock size={16} color="#94A3B8" />
                  <Text className="text-sm font-semibold text-slate-700 ml-2">{course.time}</Text>
                </View>
              </Card>
            ))}
          </View>
          
          <View className="h-12" />
        </View>
      </ScrollView>
    </View>
  );
}
