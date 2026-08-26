import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Home, Compass, Layers, Bell, User } from 'lucide-react-native';
import { useAppConfig } from '../../core/config/useAppConfig';
import { useAuthStore } from '../../core/auth/authStore';
import { useResponsive } from '../../core/responsive/useResponsive';

function CustomTabBar({ state, descriptors, navigation }) {
  const { isTablet } = useResponsive();
  const { theme } = useAppConfig();

  if (isTablet) {
    return (
      <View style={[styles.sidebar, { backgroundColor: theme?.surfaceColor || '#FFFFFF' }]}>
        <View className="mb-8 px-4 mt-8">
          <Text className="text-2xl font-bold text-khadi-blue">GRI Portal</Text>
          <Text className="text-xs text-slate-500 mt-1">Gandhigram Rural Institute</Text>
        </View>
        <View className="flex-1 px-3">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            if (options.href === null) return null;
            
            const label = options.title !== undefined ? options.title : route.name;
            const isFocused = state.index === index;
            const tintColor = theme?.primaryColor || '#0D47A1';
            
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };
            
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                  styles.sidebarItem,
                  isFocused && { backgroundColor: `${tintColor}15` }
                ]}
              >
                {options.tabBarIcon && options.tabBarIcon({ color: isFocused ? tintColor : '#6B7280', size: 22 })}
                <Text style={[
                  styles.sidebarLabel,
                  { color: isFocused ? tintColor : '#4B5563', fontWeight: isFocused ? '600' : '500' }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.bottomBar, { backgroundColor: theme?.surfaceColor || '#FFFFFF' }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        if (options.href === null) return null;
        
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;
        const tintColor = theme?.primaryColor || '#0D47A1';
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.bottomBarItem}
          >
            {options.tabBarIcon && options.tabBarIcon({ color: isFocused ? tintColor : '#9CA3AF', size: 24 })}
            <Text style={[
              styles.bottomBarLabel,
              { color: isFocused ? tintColor : '#9CA3AF', fontWeight: isFocused ? '600' : '500' }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 260,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    zIndex: 10,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  sidebarLabel: {
    marginLeft: 12,
    fontSize: 15,
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarLabel: {
    fontSize: 10,
    marginTop: 4,
  }
});

export default function TabsLayout() {
  const { isTablet } = useResponsive();

  return (
    <View style={{ flex: 1, flexDirection: isTablet ? 'row' : 'column' }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneContainerStyle: isTablet ? { marginLeft: 260 } : undefined,
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
        <Tabs.Screen name="academics" options={{ href: null }} />
        <Tabs.Screen name="ai_chat" options={{ href: null }} />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="examinations" options={{ href: null }} />
        <Tabs.Screen name="hostel" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

