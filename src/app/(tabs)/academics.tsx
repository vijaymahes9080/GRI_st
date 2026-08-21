import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Radio, Clock, BookOpen } from 'lucide-react-native';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export default function AcademicsScreen() {
  const [scanning, setScanning] = useState(false);
  const [marked, setMarked] = useState(false);

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
    <View className="flex-1 bg-gray-50">
      <Header title="Academics & Attendance" subtitle="Semester 4 · Computer Science" />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Geo-fenced BLE Attendance Scanner Card */}
        <Card className="bg-blue-900 border-0 p-5 mb-5 shadow-md">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Radio size={20} color="#82B1FF" />
              <Text className="text-sm font-semibold text-khadi-light ml-2">GEO-FENCED BLE ATTENDANCE</Text>
            </View>
            <Badge label={marked ? 'VERIFIED' : 'READY'} variant={marked ? 'success' : 'info'} />
          </View>

          <Text className="text-white font-bold text-lg mb-1">CS-403: Deep Learning & Vector RAG</Text>
          <Text className="text-xs text-blue-200 mb-4">Location: Computer Lab 2 (Beacon GRI-CS-LAB-01)</Text>

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
        <Text className="text-lg font-bold text-gray-900 mb-3">Today's Class Schedule</Text>

        {courses.map((course, idx) => (
          <Card key={idx} className="p-4 mb-3 border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <BookOpen size={18} color="#0D47A1" />
                <Text className="text-base font-bold text-gray-900 ml-2">{course.code}</Text>
              </View>
              <Badge
                label={course.status}
                variant={course.status === 'PRESENT' ? 'success' : 'neutral'}
              />
            </View>

            <Text className="text-sm font-semibold text-gray-800 mb-1">{course.name}</Text>
            <Text className="text-xs text-gray-500 mb-2">Faculty: {course.faculty}</Text>

            <View className="flex-row items-center border-t border-gray-100 pt-2.5 mt-1">
              <Clock size={14} color="#6B7280" />
              <Text className="text-xs font-medium text-gray-600 ml-1.5">{course.time}</Text>
            </View>
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
