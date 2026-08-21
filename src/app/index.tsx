import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap, ArrowRight, LogIn } from 'lucide-react-native';
import { useAuthStore } from '../core/auth/authStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const handleEnter = () => {
    if (isAuthenticated && user) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    <View className="flex-1 bg-khadi-blue items-center justify-center p-6">
      <View className="bg-white/10 p-6 rounded-full mb-6">
        <GraduationCap size={64} color="#FFFFFF" />
      </View>
      <Text className="text-3xl font-bold text-white text-center mb-2">
        Gandhigram Rural Institute
      </Text>
      <Text className="text-base text-khadi-light text-center mb-10">
        Deemed to be University · Multi-User Enterprise Platform
      </Text>

      <TouchableOpacity
        onPress={handleEnter}
        className="flex-row items-center bg-saffron px-8 py-4 rounded-xl shadow-lg mb-4"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-lg mr-2">
          {isAuthenticated ? `Continue as ${user?.fullName?.split(' ')[0] || 'User'}` : 'Enter Portal'}
        </Text>
        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {!isAuthenticated && (
        <TouchableOpacity
          onPress={() => router.replace('/auth/login')}
          className="flex-row items-center bg-white/15 px-6 py-3 rounded-xl border border-white/20"
          activeOpacity={0.8}
        >
          <LogIn size={18} color="#FFFFFF" className="mr-2" />
          <Text className="text-white font-medium text-base ml-2">Sign In to Multi-User Account</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

