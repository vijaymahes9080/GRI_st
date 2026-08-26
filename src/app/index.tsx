import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap, ArrowRight, LogIn, Library, Building2, Globe } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuthStore } from '../core/auth/authStore';
import { useResponsive } from '../core/responsive/useResponsive';
import { Button } from '../components/Button';
import { themeTokens } from '../core/theme/tokens';
import { Card } from '../components/Card';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;

  const handleEnter = () => {
    if (isAuthenticated && user) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100 z-10 bg-white">
        <View className="flex-row items-center">
          <View className="bg-primary-900 p-2 rounded-xl mr-3 shadow-sm">
            <GraduationCap size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-lg font-bold text-slate-900 tracking-tight">GRI Portal</Text>
            <Text className="text-[11px] text-slate-500 font-bold uppercase tracking-widest hidden sm:flex">Gandhigram Rural Institute</Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-4 gap-4">
          {!isAuthenticated ? (
            <Button 
              title="Sign In" 
              variant="outline" 
              size="sm" 
              onPress={() => router.push('/auth/login')}
              leftIcon={<LogIn size={16} color={colors.primary} />}
            />
          ) : (
            <Button 
              title="Dashboard" 
              variant="primary" 
              size="sm" 
              onPress={() => router.replace('/(tabs)/home')}
            />
          )}
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 64 }} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-slate-50 border-b border-slate-100 overflow-hidden relative">
          <View className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -mr-20 -mt-20" />
          <View className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center', padding: isTablet ? 64 : 24, paddingVertical: isTablet ? 96 : 64 }}>
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View className="bg-primary-50 px-3 py-1.5 rounded-md border border-primary-100 self-start mb-6">
                <Text className="text-primary-800 text-[11px] font-bold tracking-widest uppercase">Deemed to be University</Text>
              </View>
              <Text className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
                Gandhigram{'\n'}Rural Institute
              </Text>
              <Text className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                Empowering rural communities through education, research, and extension programs since 1956. Access the official digital campus.
              </Text>
              <View className="flex-row flex-wrap gap-4">
                <Button 
                  title={isAuthenticated ? `Continue to Dashboard` : 'Student & Staff Portal'}
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
                  onPress={handleEnter}
                />
                {!isAuthenticated && (
                  <Button 
                    title="Explore Public Content"
                    variant="outline"
                    size="lg"
                    onPress={() => router.push('/(tabs)/discover')}
                  />
                )}
              </View>
            </Animated.View>
          </View>
        </View>

        {/* Quick Links Section */}
        <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center', padding: isTablet ? 64 : 24, paddingTop: 48 }}>
          <Animated.View entering={FadeIn.delay(300).duration(500)}>
            <Text className="text-2xl font-bold text-slate-900 mb-2">Institutional Access</Text>
            <Text className="text-slate-500 mb-8 text-base">Quick access to major university systems and information.</Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
              {[
                { title: 'Academic Programs', desc: 'Browse courses, curriculum, and departments.', icon: Library },
                { title: 'Campus Facilities', desc: 'Hostels, libraries, and transport details.', icon: Building2 },
                { title: 'Global Outreach', desc: 'International relations and rural extension.', icon: Globe }
              ].map((item, i) => (
                <Animated.View key={i} entering={FadeInDown.delay(400 + (i * 100)).duration(500)} style={{ width: isTablet ? 'calc(33.333% - 16px)' : '100%' }}>
                  <Card elevation="sm" className="bg-white p-8 rounded-3xl h-full border-slate-100" onPress={() => {}}>
                    <View className="bg-primary-50 w-14 h-14 rounded-2xl items-center justify-center mb-6 border border-primary-100">
                      <item.icon size={28} color={colors.primary} />
                    </View>
                    <Text className="text-xl font-bold text-slate-900 mb-3">{item.title}</Text>
                    <Text className="text-slate-500 leading-relaxed text-sm">{item.desc}</Text>
                  </Card>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

