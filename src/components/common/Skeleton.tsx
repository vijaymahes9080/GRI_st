import React, { useEffect } from 'react';
import { View, Animated, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style
}) => {
  const [animatedValue] = React.useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB', // gray-200
          opacity,
        },
        style
      ]}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center justify-between">
      <View className="flex-row items-center flex-1 pr-3">
        <Skeleton width={48} height={48} borderRadius={12} style={{ marginRight: 12 }} />
        <View className="flex-1">
          <Skeleton width={80} height={12} style={{ marginBottom: 6 }} />
          <Skeleton width="90%" height={16} style={{ marginBottom: 6 }} />
          <Skeleton width={50} height={10} />
        </View>
      </View>
      <Skeleton width={36} height={36} borderRadius={10} />
    </View>
  );
};
