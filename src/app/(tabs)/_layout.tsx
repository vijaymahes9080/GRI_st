import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Compass, Layers, User, BookOpen } from 'lucide-react-native';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';

function CustomTabBar({ state, descriptors, navigation }) {
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;

  if (isTablet) {
    return (
      <View style={[styles.sidebar, { backgroundColor: colors.surface }]}>
        <View className="mb-8 px-4 mt-8">
          <Text className="text-2xl font-bold text-primary-500">GRI Portal</Text>
          <Text className="text-xs text-slate-500 mt-1">Gandhigram Rural Institute</Text>
        </View>
        <View className="flex-1 px-3">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            if (options.href === null) return null;
            
            const label = options.title !== undefined ? options.title : route.name;
            const isFocused = state.index === index;
            const tintColor = colors.primary;
            
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
                {options.tabBarIcon && options.tabBarIcon({ color: isFocused ? tintColor : colors.textSecondary, size: 22 })}
                <Text style={[
                  styles.sidebarLabel,
                  { color: isFocused ? tintColor : colors.textSecondary, fontWeight: isFocused ? '600' : '500' }
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
    <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        if (options.href === null) return null;
        
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;
        const tintColor = colors.primary;
        
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
            style={styles.bottomBarItem}
          >
            <View style={[styles.iconContainer, isFocused && { backgroundColor: `${tintColor}15` }]}>
              {options.tabBarIcon && options.tabBarIcon({ color: isFocused ? tintColor : colors.textMuted, size: 22 })}
            </View>
            <Text style={[
              styles.bottomBarLabel,
              { color: isFocused ? tintColor : colors.textMuted, fontWeight: isFocused ? '600' : '500' }
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
    borderRightColor: '#F1F5F9', // surfaceMuted
    zIndex: 10,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  sidebarLabel: {
    marginLeft: 14,
    fontSize: 15,
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9', // surfaceMuted
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 12,
    elevation: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 16,
    marginBottom: 4,
  },
  bottomBarLabel: {
    fontSize: 10,
  },
});

export default function TabsLayout() {
  const { isTablet } = useResponsive();

  return (
    <View style={{ flex: 1, flexDirection: isTablet ? 'row' : 'column', backgroundColor: themeTokens.colors.background }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneContainerStyle: {
            backgroundColor: themeTokens.colors.background,
            ...(isTablet ? { marginLeft: 260 } : {}),
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="academics"
          options={{
            title: 'Academics',
            tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Campus',
            tabBarIcon: ({ color, size }) => <Compass size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: 'Services',
            tabBarIcon: ({ color, size }) => <Layers size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        
        {/* Hidden routes from tab bar */}
        <Tabs.Screen name="alerts" options={{ href: null }} />
        <Tabs.Screen name="ai_chat" options={{ href: null }} />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="examinations" options={{ href: null }} />
        <Tabs.Screen name="hostel" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

