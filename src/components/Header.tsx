import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Menu } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuPress?: () => void;
  rightAction?: React.ReactNode;
  variant?: 'blue' | 'green' | 'maroon';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showMenu = true,
  onMenuPress,
  rightAction,
  variant = 'green',
}) => {
  const router = useRouter();

  const bgClass =
    variant === 'green'
      ? 'bg-[#518214]'
      : variant === 'maroon'
      ? 'bg-[#911C03]'
      : 'bg-[#0D47A1]';

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      router.push('/navigation');
    }
  };

  return (
    <View className={`flex-row items-center justify-between px-4 py-3.5 ${bgClass} border-b border-white/10 shadow-sm`}>
      <View className="flex-row items-center flex-1">
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1.5 bg-white/15 rounded-full" activeOpacity={0.7}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : showMenu ? (
          <TouchableOpacity onPress={handleMenuPress} className="mr-3 p-1.5 bg-white/15 rounded-full" activeOpacity={0.7}>
            <Menu size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
        <View className="flex-1">
          <Text className="text-xl font-bold text-white tracking-wide" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-xs text-emerald-100 font-medium" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightAction && <View className="ml-3">{rightAction}</View>}
    </View>
  );
};

