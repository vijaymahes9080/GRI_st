import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Calendar, FileText } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

export const PlacementScreen: React.FC = () => {
  const drives = [
    { company: 'TCS Digital', role: 'Software Engineer', ctc: '₹ 7.5 LPA', date: '22 May 2026', status: 'ELIGIBLE' },
    { company: 'Infosys Specialist', role: 'Systems Engineer', ctc: '₹ 6.2 LPA', date: '28 May 2026', status: 'APPLIED' },
    { company: 'Zoho Corporation', role: 'Product Developer', ctc: '₹ 8.4 LPA', date: '05 Jun 2026', status: 'ELIGIBLE' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Placement & Career Portal" subtitle="Training & Placement Cell · GRI" showBack />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Placement Resume Status */}
        <Card className="bg-cyan-900 p-4 mb-5 border-0 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <FileText size={18} color="#A5F3FC" />
              <Text className="text-xs font-bold text-cyan-200 ml-2">DIGITAL RESUME STATUS</Text>
            </View>
            <Badge label="VERIFIED" variant="success" />
          </View>
          <Text className="text-white font-bold text-base mb-1">Resume Verification Complete</Text>
          <Text className="text-xs text-cyan-100 mb-3">CGPA 8.85 verified by Placement Officer</Text>

          <Button
            title="Update Resume Profile"
            onPress={() => Alert.alert('Resume Builder', 'Opening GRI Placement Resume Builder.')}
            variant="outline"
            className="bg-white border-0"
            size="sm"
          />
        </Card>

        {/* Recruitment Drives */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Campus Recruitment Drives</Text>

        {drives.map((drive, idx) => (
          <Card key={idx} className="p-4 mb-3 border-gray-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-lg font-bold text-gray-900">{drive.company}</Text>
              <Badge label={drive.status} variant={drive.status === 'APPLIED' ? 'info' : 'warning'} />
            </View>

            <Text className="text-sm font-semibold text-khadi-blue mb-1">{drive.role}</Text>
            <Text className="text-sm font-bold text-emerald-700 mb-2">Package: {drive.ctc}</Text>

            <View className="flex-row items-center justify-between border-t border-gray-100 pt-2.5">
              <View className="flex-row items-center">
                <Calendar size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">Drive Date: {drive.date}</Text>
              </View>

              {drive.status === 'ELIGIBLE' && (
                <Button
                  title="Apply Now"
                  onPress={() => Alert.alert('Application Submitted', `Applied for ${drive.company} (${drive.role}).`)}
                  size="sm"
                />
              )}
            </View>
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
