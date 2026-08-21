import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Bus, MapPin, QrCode } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

export const TransportScreen: React.FC = () => {
  const routes = [
    { routeNo: 'Route 01', path: 'Dindigul Bus Stand ➔ GRI Campus', time: '07:45 AM / 05:15 PM', busNo: 'TN-57-N-2024', status: 'ON TIME' },
    { routeNo: 'Route 04', path: 'Vadipatti ➔ GRI Campus', time: '08:00 AM / 05:15 PM', busNo: 'TN-57-N-2028', status: 'IN TRANSIT' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Transport & GPS Bus Tracking" subtitle="University Bus Routes · Pass Verification" showBack />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Digital Bus Pass Card */}
        <Card className="bg-amber-900 p-5 mb-5 border-0 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Bus size={20} color="#FDE68A" />
              <Text className="text-xs font-bold text-amber-200 ml-2">DIGITAL BUS PASS</Text>
            </View>
            <Badge label="VERIFIED PASS" variant="success" />
          </View>
          <Text className="text-white font-bold text-lg mb-1">Route 01: Dindigul ➔ GRI Campus</Text>
          <Text className="text-xs text-amber-100 mb-4">Valid till End of Semester May 2026</Text>

          <Button
            title="Display Conductor Bus Pass QR"
            onPress={() => Alert.alert('Conductor Scan QR Token', 'Displaying AES-256 Bus Pass token.')}
            leftIcon={<QrCode size={18} color="#0D47A1" />}
            variant="outline"
            className="bg-white border-0"
          />
        </Card>

        {/* Live GPS Bus Location */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Live Bus Schedules & GPS</Text>

        {routes.map((rt, idx) => (
          <Card key={idx} className="p-4 mb-3 border-gray-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base font-bold text-gray-900">{rt.routeNo} ({rt.busNo})</Text>
              <Badge label={rt.status} variant={rt.status === 'ON TIME' ? 'success' : 'info'} />
            </View>
            <Text className="text-sm font-semibold text-khadi-blue mb-1">{rt.path}</Text>
            <Text className="text-xs text-gray-500 mb-3">Schedule: {rt.time}</Text>

            <Button
              title="Track Live Bus Location (GPS)"
              onPress={() => Alert.alert('GPS Live Tracking', `Tracking Bus ${rt.busNo} on map. 2.4 km from your stop.`)}
              size="sm"
              variant="outline"
              leftIcon={<MapPin size={16} color="#0D47A1" />}
            />
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
