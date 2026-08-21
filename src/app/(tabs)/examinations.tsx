import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Download, Award, FileText } from 'lucide-react-native';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export default function ExaminationsScreen() {
  const results = [
    { code: 'CS-301', title: 'Data Structures & Algorithms', grade: 'A+', credits: 4, points: 10.0 },
    { code: 'CS-302', title: 'Database Management Systems', grade: 'A', credits: 4, points: 9.0 },
    { code: 'CS-303', title: 'Computer Networks', grade: 'A+', credits: 3, points: 10.0 },
    { code: 'CS-304', title: 'Operating Systems', grade: 'B+', credits: 4, points: 8.0 },
  ];

  const handleDownloadHallTicket = () => {
    Alert.alert('Download Started', 'Downloading Sem 4 Hall Ticket (PDF) to device storage.');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Examinations & Results" subtitle="Roll: GRI-2024-8841" />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Hall Ticket Card */}
        <Card className="bg-saffron p-5 mb-5 border-0 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <FileText size={20} color="#FFFFFF" />
              <Text className="text-sm font-bold text-white ml-2">HALL TICKET AVAILABLE</Text>
            </View>
            <Badge label="SEM 4" variant="neutral" />
          </View>
          <Text className="text-white font-bold text-lg mb-1">End Semester Examinations May 2026</Text>
          <Text className="text-xs text-orange-100 mb-4">Exam Center: Block-A Main Auditorium</Text>

          <Button
            title="Download Hall Ticket PDF"
            onPress={handleDownloadHallTicket}
            leftIcon={<Download size={18} color="#0D47A1" />}
            variant="outline"
            className="bg-white border-0"
          />
        </Card>

        {/* CGPA Summary Card */}
        <Card className="p-4 mb-5 border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Award size={24} color="#2E7D32" />
              <View className="ml-3">
                <Text className="text-xs text-gray-500 font-medium">Cumulative Grade Point (CGPA)</Text>
                <Text className="text-2xl font-bold text-gray-900">8.85 / 10.0</Text>
              </View>
            </View>
            <Badge label="FIRST CLASS WITH DISTINCTION" variant="success" />
          </View>
        </Card>

        {/* Recent Results */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Semester 3 Marksheet</Text>

        {results.map((res, idx) => (
          <Card key={idx} className="p-4 mb-3 border-gray-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm font-bold text-khadi-blue">{res.code}</Text>
              <Badge label={`GRADE ${res.grade}`} variant="success" />
            </View>
            <Text className="text-base font-semibold text-gray-800 mb-2">{res.title}</Text>
            <View className="flex-row items-center justify-between border-t border-gray-100 pt-2">
              <Text className="text-xs text-gray-500">Credits: {res.credits}</Text>
              <Text className="text-xs font-semibold text-gray-700">Grade Points: {res.points}</Text>
            </View>
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
