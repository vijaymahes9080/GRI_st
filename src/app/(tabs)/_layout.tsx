import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Compass, Layers, Bell, User } from 'lucide-react-native';
import { useAppConfig } from '../../core/config/useAppConfig';
import { useAuthStore } from '../../core/auth/authStore';

export default function TabsLayout() {
  const router = useRouter();
  const { theme } = useAppConfig();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme?.primaryColor || '#518214',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: theme?.surfaceColor || '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => <Layers size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="academics"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ai_chat"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="examinations"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="hostel"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

