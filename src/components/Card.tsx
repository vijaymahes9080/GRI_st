import React, { useRef } from 'react';
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps, Animated } from 'react-native';

export interface CardProps extends ViewProps {
  onPress?: () => void;
  activeOpacity?: number;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'muted';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  onPress, 
  className = '', 
  activeOpacity = 0.9,
  elevation = 'sm',
  variant = 'default',
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  let baseClass = 'rounded-2xl p-5 '; // Consistent border radius and larger padding
  
  if (variant === 'default') {
    baseClass += 'bg-white ';
    if (elevation === 'sm') baseClass += 'shadow-sm border border-slate-100 ';
    if (elevation === 'md') baseClass += 'shadow-md border border-slate-100 ';
    if (elevation === 'lg') baseClass += 'shadow-lg border border-slate-100 ';
  } else if (variant === 'outlined') {
    baseClass += 'bg-transparent border border-slate-200 ';
  } else if (variant === 'muted') {
    baseClass += 'bg-slate-50 border border-slate-100 ';
  }

  const containerClasses = `${baseClass} ${className}`;

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={activeOpacity}
          className={containerClasses}
          {...(props as TouchableOpacityProps)}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View className={containerClasses} {...props}>
      {children}
    </View>
  );
};
