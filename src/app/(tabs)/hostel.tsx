import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Building2, Plus, QrCode } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function HostelScreen() {
  const { isTablet } = useResponsive();
  
  const [outpasses] = useState([
    { id: 'OPT-8841-01', type: 'WEEKEND LEAVE', dates: 'May 10 - May 12', status: 'PARENT_APPROVED', warden: 'APPROVED' },
    { id: 'OPT-8841-02', type: 'LOCAL PASS', dates: 'May 04 (04:00 PM - 08:00 PM)', status: 'COMPLETED', warden: 'APPROVED' },
  ]);

  const handleRequestOutpass = () => {
    Alert.alert('Request Submitted', 'Out-Pass request submitted. Notification sent to Warden and Parent for digital signoff.');
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Header
        title="Hostel & Digital Out-Pass"
        subtitle="Block-C · Room 304"
        variant="white"
      />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 24 : 16 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-slate-900 px-1">Active Token</Text>
            <TouchableOpacity 
              onPress={handleRequestOutpass}
              className="bg-khadi-blue flex-row items-center px-4 py-2 rounded-lg"
              activeOpacity={0.8}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text className="text-white font-bold text-sm ml-2">New Pass</Text>
            </TouchableOpacity>
          </View>

          {/* Active QR Outpass Token Card */}
          <Card className="bg-[#059669] p-6 mb-8 border-0 shadow-md">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Building2 size={20} color="#A7F3D0" />
                <Text className="text-xs font-bold text-emerald-200 ml-2 tracking-wider uppercase">DIGITAL GATE PASS TOKEN</Text>
              </View>
              <View className="bg-white/20 px-3 py-1 rounded-md">
                <Text className="text-xs font-bold text-white tracking-widest uppercase">ACTIVE</Text>
              </View>
            </View>
            <Text className="text-white font-bold text-xl mb-1">Weekend Out-Pass Granted</Text>
            <Text className="text-sm text-emerald-100 mb-6">Valid: 10 May 2026 06:00 AM to 12 May 2026 08:00 PM</Text>
            <Button
              title="Show Gate QR Code"
              onPress={() => Alert.alert('Gate Security QR Token', 'Displaying AES-256 encrypted QR token for gate scanner.')}
              leftIcon={<QrCode size={18} color="#059669" />}
              className="bg-white border-0 shadow-sm"
              textClassName="text-[#059669] font-bold"
            />
          </Card>

          <Text className="text-lg font-bold text-slate-900 mb-4 px-1">Out-Pass History & Approvals</Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {outpasses.map((opt, idx) => (
              <Card key={idx} className="p-5 border-slate-200 shadow-sm bg-white" style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-sm font-bold text-khadi-blue tracking-wider">{opt.id}</Text>
                  <Badge label={opt.status} variant={opt.status === 'COMPLETED' ? 'neutral' : 'info'} />
                </View>
                <Text className="text-base font-bold text-slate-900 mb-2">{opt.type}</Text>
                <Text className="text-sm text-slate-500 font-medium mb-4">Duration: {opt.dates}</Text>
                
                <View className="flex-row items-center justify-between border-t border-slate-100 pt-3">
                  <Text className="text-sm text-slate-500 font-medium">Parent Signoff: <Text className="font-semibold text-emerald-600">✓</Text></Text>
                  <Text className="text-sm font-medium text-slate-500">Warden: <Text className="font-semibold text-emerald-600">{opt.warden}</Text></Text>
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
