import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Home,
  BookOpen,
  Layers,
  Compass,
  Bot,
  User,
  FileCheck,
  CreditCard,
  Building2,
  Library,
  Briefcase,
  MapPin,
  Bus,
  AlertCircle,
  Bell,
  ShieldCheck,
  GraduationCap,
  Newspaper,
  ChevronRight,
  LucideIcon,
} from 'lucide-react-native';

import { useAppConfig } from '../../core/config/useAppConfig';
import { NavigationNode } from '../../core/types/config';

const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  'book-open': BookOpen,
  layers: Layers,
  compass: Compass,
  bot: Bot,
  user: User,
  'file-check': FileCheck,
  'credit-card': CreditCard,
  'building-2': Building2,
  library: Library,
  briefcase: Briefcase,
  'map-pin': MapPin,
  bus: Bus,
  'alert-circle': AlertCircle,
  bell: Bell,
  'shield-check': ShieldCheck,
  'graduation-cap': GraduationCap,
  newspaper: Newspaper,
};

interface DynamicMenuProps {
  layout?: 'grid' | 'list';
  customItems?: NavigationNode[];
  onItemPress?: (item: NavigationNode) => void;
}

export const DynamicMenu: React.FC<DynamicMenuProps> = ({
  layout = 'grid',
  customItems,
  onItemPress,
}) => {
  const router = useRouter();
  const { navigation, isFeatureEnabled } = useAppConfig();

  const itemsToRender = (customItems || navigation).filter(
    (item: NavigationNode) => item.enabled !== false && (!item.featureFlagKey || isFeatureEnabled(item.featureFlagKey))
  );

  const handlePress = (item: NavigationNode) => {
    if (onItemPress) {
      onItemPress(item);
      return;
    }
    if (item.route) {
      router.push(item.route as any);
    }
  };

  if (layout === 'list') {
    return (
      <View className="gap-2.5">
        {itemsToRender.map((item: NavigationNode) => {
          const IconComponent = ICON_MAP[item.icon] || Layers;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
              className="bg-white p-4 rounded-2xl border border-gray-200 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="bg-emerald-50 p-2.5 rounded-xl mr-3">
                  <IconComponent size={20} color="#518214" />
                </View>

                <View>
                  <Text className="text-base font-semibold text-gray-900">{item.title}</Text>
                  {item.featureFlagKey && (
                    <Text className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
                      {item.featureFlagKey} Module Active
                    </Text>
                  )}
                </View>
              </View>

              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap justify-between">
      {itemsToRender.map((item: NavigationNode) => {
        const IconComponent = ICON_MAP[item.icon] || Layers;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => handlePress(item)}
            activeOpacity={0.75}
            className="w-[48%] mb-3.5 p-4 items-center justify-center border border-gray-200 rounded-2xl bg-white shadow-sm"
          >
            <View className="p-3 rounded-2xl mb-2 bg-emerald-50">
              <IconComponent size={26} color="#518214" />
            </View>

            <Text className="text-sm font-semibold text-gray-900 text-center">{item.title}</Text>

            {item.featureFlagKey && (
              <View className="bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                <Text className="text-[9px] font-bold text-emerald-800 uppercase">ACTIVE</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
