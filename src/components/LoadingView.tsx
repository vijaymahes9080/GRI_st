import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message = 'Loading content...' }) => (
  <View className="flex-1 items-center justify-center p-6 bg-gray-50">
    <ActivityIndicator size="large" color="#0D47A1" />
    <Text className="text-sm font-medium text-gray-600 mt-3">{message}</Text>
  </View>
);
