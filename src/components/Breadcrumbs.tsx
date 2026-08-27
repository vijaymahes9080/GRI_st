import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ChevronRight, Home } from 'lucide-react-native';

export const Breadcrumbs: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Handle root or tabs
  if (pathname === '/' || pathname.startsWith('/(tabs)')) {
    return null;
  }

  const paths = pathname.split('/').filter(Boolean);
  
  return (
    <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100 flex-wrap">
      <TouchableOpacity onPress={() => router.push('/')} className="flex-row items-center">
        <Home size={14} color="#6B7280" />
      </TouchableOpacity>
      
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        const route = `/${paths.slice(0, index + 1).join('/')}`;
        const formattedPath = path.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        
        return (
          <React.Fragment key={path}>
            <ChevronRight size={14} color="#9CA3AF" className="mx-1" />
            <TouchableOpacity 
              disabled={isLast} 
              onPress={() => router.push(route as any)}
            >
              <Text className={`text-xs ${isLast ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                {formattedPath}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
};
