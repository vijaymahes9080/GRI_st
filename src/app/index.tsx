import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap, ArrowRight, LogIn, Library, Building2, Globe } from 'lucide-react-native';
import { useAuthStore } from '../core/auth/authStore';
import { useResponsive } from '../core/responsive/useResponsive';
import { Button } from '../components/Button';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { isTablet, width } = useResponsive();

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
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-200">
        <View className="flex-row items-center">
          <View className="bg-khadi-blue p-2 rounded-lg mr-3">
            <GraduationCap size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-lg font-bold text-slate-900 tracking-tight">GRI Portal</Text>
            <Text className="text-xs text-slate-500 font-medium hidden sm:flex">Gandhigram Rural Institute</Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-4 gap-4">
          {!isAuthenticated ? (
            <Button 
              title="Sign In" 
              variant="outline" 
              size="sm" 
              onPress={() => router.push('/auth/login')}
              leftIcon={<LogIn size={16} color="#0D47A1" />}
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

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 64 }}>
        {/* Hero Section */}
        <View className="bg-slate-50 border-b border-slate-200">
          <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center', padding: isTablet ? 64 : 24, paddingVertical: isTablet ? 96 : 48 }}>
            <View className="bg-emerald-100 px-3 py-1 rounded-full self-start mb-6">
              <Text className="text-emerald-800 text-xs font-bold tracking-widest uppercase">Deemed to be University</Text>
            </View>
            <Text className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
              Gandhigram{'\n'}Rural Institute
            </Text>
            <Text className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
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
          </View>
        </View>

        {/* Quick Links Section */}
        <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center', padding: isTablet ? 64 : 24 }}>
          <Text className="text-2xl font-bold text-slate-900 mb-2">Institutional Access</Text>
          <Text className="text-slate-500 mb-8">Quick access to major university systems and information.</Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
            {[
              { title: 'Academic Programs', desc: 'Browse courses, curriculum, and departments.', icon: Library },
              { title: 'Campus Facilities', desc: 'Hostels, libraries, and transport details.', icon: Building2 },
              { title: 'Global Outreach', desc: 'International relations and rural extension.', icon: Globe }
            ].map((item, i) => (
              <View key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm" style={{ width: isTablet ? 'calc(33.333% - 16px)' : '100%' }}>
                <View className="bg-blue-50 w-12 h-12 rounded-lg items-center justify-center mb-4">
                  <item.icon size={24} color="#0D47A1" />
                </View>
                <Text className="text-lg font-bold text-slate-900 mb-2">{item.title}</Text>
                <Text className="text-slate-600 leading-relaxed">{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

