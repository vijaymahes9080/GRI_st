import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Menu, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Breadcrumbs } from './Breadcrumbs';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuPress?: () => void;
  rightAction?: React.ReactNode;
  variant?: 'blue' | 'green' | 'maroon' | 'white';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showMenu = true,
  onMenuPress,
  rightAction,
  variant = 'white',
}) => {
  const router = useRouter();

  const isLight = variant === 'white';
  
  const bgClass =
    variant === 'green'
      ? 'bg-[#518214]'
      : variant === 'maroon'
      ? 'bg-[#911C03]'
      : variant === 'blue'
      ? 'bg-[#0D47A1]'
      : 'bg-white border-b border-slate-200 shadow-sm';
      
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subtitleColor = isLight ? 'text-slate-500' : 'text-white/80';
  const iconColor = isLight ? '#475569' : '#FFFFFF';
  const buttonBg = isLight ? 'bg-slate-100 border border-slate-200' : 'bg-white/15 rounded-full';

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      router.push('/navigation');
    }
  };

  return (
    <View className="flex-col">
      <View className={`flex-row items-center justify-between px-6 py-4 ${bgClass}`}>
        <View className="flex-row items-center flex-1">
          {showBack ? (
            <TouchableOpacity onPress={() => router.back()} className={`mr-4 p-2 rounded-lg ${buttonBg}`} activeOpacity={0.7}>
              <ArrowLeft size={20} color={iconColor} />
            </TouchableOpacity>
          ) : showMenu ? (
            <TouchableOpacity onPress={handleMenuPress} className={`mr-4 p-2 rounded-lg ${buttonBg}`} activeOpacity={0.7}>
              <Menu size={20} color={iconColor} />
            </TouchableOpacity>
          ) : null}
          <View className="flex-1">
            <Text className={`text-xl font-bold tracking-tight ${textColor}`} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text className={`text-xs mt-0.5 font-medium ${subtitleColor}`} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => router.push('/search')} className={`p-2 rounded-lg ${buttonBg} ml-2`} activeOpacity={0.7}>
            <Search size={20} color={iconColor} />
          </TouchableOpacity>
          {rightAction && <View className="ml-2">{rightAction}</View>}
        </View>
      </View>
      <Breadcrumbs />
    </View>
  );
};

