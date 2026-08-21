import React from 'react';
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface CardProps extends ViewProps {
  onPress?: () => void;
  activeOpacity?: number;
}

export const Card: React.FC<CardProps> = ({ children, onPress, className = '', activeOpacity = 0.7, ...props }) => {
  const containerClasses = `bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        className={containerClasses}
        {...(props as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={containerClasses} {...props}>
      {children}
    </View>
  );
};
