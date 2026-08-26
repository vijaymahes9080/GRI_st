import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Download, Award, FileText } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function ExaminationsScreen() {
  const { isTablet } = useResponsive();
  
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
    <View className="flex-1 bg-slate-50">
      <Header title="Examinations & Results" subtitle="Roll: GRI-2024-8841" variant="white" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 24 : 16 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          {/* Hall Ticket Card */}
          <Card className="bg-[#911C03] p-6 mb-8 border-0 shadow-md">
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
          <Card className="p-6 mb-8 border-slate-200 shadow-sm bg-white">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <Award size={28} color="#059669" />
                </View>
                <View className="ml-4">
                  <Text className="text-sm text-slate-500 font-semibold tracking-wider uppercase mb-1">Cumulative Grade Point</Text>
                  <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">8.85 <Text className="text-lg text-slate-400 font-medium">/ 10.0</Text></Text>
                </View>
              </View>
              <View className="bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 hidden md:flex">
                <Text className="text-xs font-bold text-emerald-800 tracking-widest uppercase">FIRST CLASS WITH DISTINCTION</Text>
              </View>
            </View>
          </Card>

          {/* Recent Results */}
          <Text className="text-lg font-bold text-slate-900 mb-4 px-1">Semester 3 Marksheet</Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {results.map((res, idx) => (
              <Card key={idx} className="p-5 border-slate-200 shadow-sm bg-white" style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-sm font-bold text-khadi-blue tracking-wider">{res.code}</Text>
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
          
          <View className="h-12" />
        </View>
      </ScrollView>
    </View>
  );
}
