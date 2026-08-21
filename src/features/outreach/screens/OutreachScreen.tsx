import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { MapPin, Camera } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

export const OutreachScreen: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

  const surveys = [
    { village: 'Gandhigram Adoption Village 1', type: 'Sanitation Survey', responses: 42, status: 'COMPLETED' },
    { village: 'Chinnalapatti Extension Block', type: 'Solar Microgrid Survey', responses: 18, status: 'IN_PROGRESS' },
  ];

  const handleCaptureSurvey = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert('Geo-Survey Recorded', 'Captured GPS Coordinates (10.2811° N, 77.9822° E) & synced to offline queue.');
    }, 1200);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Village Outreach (UBA)" subtitle="Unnat Bharat Abhiyan · Extension Activities" showBack />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Offline Survey Capture Card */}
        <Card className="bg-lime-900 p-5 mb-5 border-0 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <MapPin size={20} color="#D9F99D" />
              <Text className="text-xs font-bold text-lime-200 ml-2">GEO-TAGGED SURVEY CAPTURE</Text>
            </View>
            <Badge label="GPS ACTIVE" variant="success" />
          </View>
          <Text className="text-white font-bold text-lg mb-1">Rural Household Water & Health Survey</Text>
          <Text className="text-xs text-lime-100 mb-4">Location: Ambathurai Village Block 3</Text>

          <Button
            title={submitting ? 'Recording Geo Tag...' : 'Capture Household Survey & Photo'}
            onPress={handleCaptureSurvey}
            loading={submitting}
            leftIcon={<Camera size={18} color="#FFFFFF" />}
            variant="secondary"
          />
        </Card>

        {/* Survey History */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Extension Fieldwork Records</Text>

        {surveys.map((sur, idx) => (
          <Card key={idx} className="p-4 mb-3 border-gray-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base font-bold text-gray-900">{sur.village}</Text>
              <Badge label={sur.status} variant={sur.status === 'COMPLETED' ? 'success' : 'warning'} />
            </View>
            <Text className="text-sm font-semibold text-khadi-blue mb-1">{sur.type}</Text>
            <Text className="text-xs text-gray-500">Collected Households: {sur.responses}</Text>
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
