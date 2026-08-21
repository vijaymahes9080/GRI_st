import React from 'react';
import { View, Text } from 'react-native';

export interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <View className={`px-2.5 py-1 rounded-full align-self-start ${getVariantStyles().split(' ')[0]}`}>
      <Text className={`text-xs font-semibold ${getVariantStyles().split(' ')[1]}`}>{label}</Text>
    </View>
  );
};
