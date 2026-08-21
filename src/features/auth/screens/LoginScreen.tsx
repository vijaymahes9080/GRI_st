import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, User, Lock, Fingerprint } from 'lucide-react-native';

import { LoginSchema, LoginFormData } from '../types';
import { TextField } from '../../../components/TextField';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../core/auth/authStore';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const { apiClient } = await import('../../../core/api');
      const email = data.username.includes('@') ? data.username.toLowerCase() : `${data.username.toLowerCase()}@ruraluniv.ac.in`;
      const response = await apiClient.post('/auth/login', {
        email,
        password: data.password,
      });

      const { access_token, refresh_token, role } = response.data;
      setAuth(
        {
          id: `usr_${email.split('@')[0]}`,
          username: data.username,
          email,
          fullName: email.split('@')[0],
          role: (role || 'STUDENT').toUpperCase() as any,
          department: 'Computer Science & Applications',
        },
        access_token,
        refresh_token
      );
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Login Failed', err?.response?.data?.detail || err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="bg-khadi-blue pt-16 pb-12 px-6 items-center rounded-b-3xl shadow-md">
        <View className="bg-white/10 p-5 rounded-full mb-4">
          <GraduationCap size={48} color="#FFFFFF" />
        </View>
        <Text className="text-2xl font-bold text-white text-center">GRI Portal Login</Text>
        <Text className="text-sm text-khadi-light text-center mt-1">
          Gandhigram Rural Institute · Deemed to be University
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8 pb-6 justify-between">
        <View>
          <Text className="text-lg font-bold text-gray-900 mb-1">Welcome Back</Text>
          <Text className="text-sm text-gray-500 mb-6">Enter your credentials to access your dashboard</Text>

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Roll Number / Staff ID"
                placeholder="e.g. GRI-2024-8841"
                leftIcon={<User size={20} color="#6B7280" />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                error={errors.username?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Password"
                placeholder="••••••••"
                leftIcon={<Lock size={20} color="#6B7280" />}
                isPassword
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity className="align-self-end mb-6" activeOpacity={0.7}>
            <Text className="text-xs font-semibold text-khadi-blue text-right">Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Sign In" onPress={handleSubmit(onSubmit)} loading={loading} className="mb-4" />

          <TouchableOpacity
            onPress={() => Alert.alert('Biometric Login', 'Place your finger on the sensor')}
            className="flex-row items-center justify-center p-3 rounded-xl bg-gray-50 border border-gray-200"
            activeOpacity={0.7}
          >
            <Fingerprint size={22} color="#0D47A1" />
            <Text className="text-sm font-semibold text-gray-700 ml-2">Quick Biometric Login</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 items-center">
          <Text className="text-xs text-gray-400 text-center">
            Need technical help? Contact GRI Computer Center Support
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
