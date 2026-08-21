import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Building2, Plus, QrCode } from 'lucide-react-native';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export default function HostelScreen() {
  const [outpasses] = useState([
    { id: 'OPT-8841-01', type: 'WEEKEND LEAVE', dates: 'May 10 - May 12', status: 'PARENT_APPROVED', warden: 'APPROVED' },
    { id: 'OPT-8841-02', type: 'LOCAL PASS', dates: 'May 04 (04:00 PM - 08:00 PM)', status: 'COMPLETED', warden: 'APPROVED' },
  ]);

  const handleRequestOutpass = () => {
    Alert.alert('Request Submitted', 'Out-Pass request submitted. Notification sent to Warden and Parent for digital signoff.');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header
        title="Hostel & Digital Out-Pass"
        subtitle="Block-C · Room 304"
        rightAction={
          <TouchableOpacityOnPressAction title="New Pass" onPress={handleRequestOutpass} />
        }
      />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Active QR Outpass Token Card */}
        <Card className="bg-emerald-800 p-5 mb-5 border-0 shadow-md">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Building2 size={20} color="#A7F3D0" />
              <Text className="text-xs font-bold text-emerald-200 ml-2">DIGITAL GATE PASS TOKEN</Text>
            </View>
            <Badge label="ACTIVE" variant="success" />
          </View>
          <Text className="text-white font-bold text-lg mb-1">Weekend Out-Pass Granted</Text>
          <Text className="text-xs text-emerald-100 mb-4">Valid: 10 May 2026 06:00 AM to 12 May 2026 08:00 PM</Text>

          <Button
            title="Show Gate QR Code"
            onPress={() => Alert.alert('Gate Security QR Token', 'Displaying AES-256 encrypted QR token for gate scanner.')}
            leftIcon={<QrCode size={18} color="#0D47A1" />}
            variant="outline"
            className="bg-white border-0"
          />
        </Card>

        <Text className="text-lg font-bold text-gray-900 mb-3">Out-Pass History & Approvals</Text>

        {outpasses.map((opt, idx) => (
          <Card key={idx} className="p-4 mb-3 border-gray-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-bold text-khadi-blue">{opt.id}</Text>
              <Badge label={opt.status} variant={opt.status === 'COMPLETED' ? 'neutral' : 'info'} />
            </View>
            <Text className="text-base font-semibold text-gray-800 mb-1">{opt.type}</Text>
            <Text className="text-xs text-gray-500 mb-3">Duration: {opt.dates}</Text>

            <View className="flex-row items-center justify-between border-t border-gray-100 pt-2.5">
              <Text className="text-xs text-gray-600">Parent Signoff: ✓ Approved</Text>
              <Text className="text-xs font-semibold text-green-700">Warden: {opt.warden}</Text>
            </View>
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

const TouchableOpacityOnPressAction = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <View className="flex-row items-center">
    <Button title={title} onPress={onPress} size="sm" variant="secondary" leftIcon={<Plus size={16} color="#FFFFFF" />} />
  </View>
);
