import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Button } from './Button';

export interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'Failed to load content. Please check your network connection.',
  onRetry,
}) => (
  <View className="flex-1 items-center justify-center p-6 bg-gray-50">
    <AlertCircle size={48} color="#D32F2F" />
    <Text className="text-lg font-bold text-gray-900 mt-3 text-center">Something went wrong</Text>
    <Text className="text-sm text-gray-500 mt-1 text-center mb-6">{message}</Text>
    {onRetry && <Button title="Try Again" onPress={onRetry} variant="outline" size="sm" />}
  </View>
);
