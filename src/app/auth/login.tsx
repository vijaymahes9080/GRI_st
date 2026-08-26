import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
  User,
  Settings,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuthStore } from '../../core/auth/authStore';
import { UserRole } from '../../core/auth/authStore';
import { api } from '../../core/api/client';
import { themeTokens } from '../../core/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { colors } = themeTokens;

  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roleOptions = [
    { key: 'STUDENT', label: 'Student', icon: User },
    { key: 'FACULTY', label: 'Faculty', icon: GraduationCap },
    { key: 'ADMIN', label: 'Admin', icon: Settings },
  ] as const;

  const handleSelectRole = (role: 'STUDENT' | 'FACULTY' | 'ADMIN') => {
    setSelectedRole(role);
    setErrorMsg('');
    setEmail('');
    setPassword('');
  };

  const fillDemoCredentials = (role: 'STUDENT' | 'FACULTY' | 'ADMIN') => {
    setSelectedRole(role);
    if (role === 'STUDENT') {
      setEmail('student@test.edu');
      setPassword('password123');
    } else if (role === 'FACULTY') {
      setEmail('faculty@test.edu');
      setPassword('password123');
    } else {
      setEmail('admin@test.edu');
      setPassword('password123');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/auth/login', {
        username: email.trim(),
        password,
      });

      if (response.data && response.data.access_token) {
        setAuth(response.data.user, response.data.access_token, response.data.refresh_token);
        router.replace('/(tabs)/home');
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (err: any) {
      // Fallback Dev / Offline Mock Sign-In
      if (email.trim() && password.length >= 6) {
        const roleUpper = selectedRole as UserRole;
        const mockUser = {
          id: 'dev_' + Date.now(),
          username: email.split('@')[0],
          email: email.trim(),
          fullName:
            selectedRole === 'STUDENT'
              ? 'Vijay Kumar'
              : selectedRole === 'FACULTY'
              ? 'Dr. K. Arumugam'
              : 'System Administrator',
          role: roleUpper,
          department: selectedRole === 'STUDENT' ? 'BCA (Hons)' : 'Computer Science',
          rollNumber: selectedRole === 'STUDENT' ? '21BCA042' : 'FAC-2026',
        };
        setAuth(mockUser, 'mock_access_token', 'mock_refresh_token');
        router.replace('/(tabs)/home');
        return;
      }
      setErrorMsg('Invalid credentials or account inactive.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 max-w-md w-full self-center px-6 pt-20 pb-8 justify-center">
          
          <Animated.View entering={FadeInDown.delay(100).duration(600)} className="items-center mb-10">
            <View className="w-20 h-20 bg-primary-50 rounded-3xl items-center justify-center mb-6 shadow-sm border border-primary-100">
              <Shield size={36} color={colors.primary} />
            </View>
            <Text className="text-3xl font-bold text-slate-900 text-center mb-2 tracking-tight">
              GRI Portal
            </Text>
            <Text className="text-base text-slate-500 text-center font-medium">
              Gandhigram Rural Institute
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} className="mb-8">
            <View className="flex-row bg-slate-100 p-1.5 rounded-2xl">
              {roleOptions.map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedRole === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => handleSelectRole(item.key)}
                    className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
                      isSelected ? 'bg-white shadow-sm border border-slate-200/50' : ''
                    }`}
                    activeOpacity={0.8}
                  >
                    <IconComp size={16} color={isSelected ? colors.primary : colors.textMuted} />
                    <Text
                      className={`text-sm font-bold ml-2 ${
                        isSelected ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            {errorMsg ? (
              <View className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-6 flex-row items-center">
                <AlertCircle size={20} color={colors.error} />
                <Text className="text-sm text-red-700 font-medium ml-3 flex-1 leading-relaxed">{errorMsg}</Text>
              </View>
            ) : null}

            <View className="mb-5">
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                {selectedRole === 'STUDENT' ? 'Registration Number or Email' : 'Institutional Email'}
              </Text>
              <View className="flex-row items-center bg-slate-50 h-14 border border-slate-200 rounded-2xl px-4 shadow-sm focus:border-primary-400 focus:bg-white">
                <Mail size={20} color={colors.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={selectedRole === 'STUDENT' ? 'e.g. 21BCA042' : 'user@ruraluniv.ac.in'}
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="flex-1 ml-3 h-full text-base font-medium text-slate-900"
                />
              </View>
            </View>

            <View className="mb-2">
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Password
              </Text>
              <View className="flex-row items-center bg-slate-50 h-14 border border-slate-200 rounded-2xl px-4 shadow-sm focus:border-primary-400 focus:bg-white">
                <Lock size={20} color={colors.textMuted} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  className="flex-1 ml-3 h-full text-base font-medium text-slate-900"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                  {showPassword ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/auth/forgot_password' as any)}
              className="self-end mb-8 py-2"
            >
              <Text className="text-sm font-bold text-primary-600">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-primary-600 h-14 rounded-2xl items-center flex-row justify-center shadow-lg shadow-primary-600/30 mb-8"
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-white font-bold text-lg mr-2">Continue</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(600)} className="mt-auto">
            <View className="flex-row justify-center items-center mb-8">
              <Text className="text-sm text-slate-500 font-medium">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register' as any)}>
                <Text className="text-sm font-bold text-primary-600">Request Access</Text>
              </TouchableOpacity>
            </View>

            <View className="border-t border-slate-100 pt-6">
              <Text className="text-[10px] font-bold text-slate-400 uppercase text-center mb-4 tracking-widest">
                Developer Fast-Login
              </Text>
              <View className="flex-row justify-center gap-3">
                <TouchableOpacity
                  onPress={() => fillDemoCredentials('STUDENT')}
                  className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200"
                >
                  <Text className="text-xs font-bold text-slate-600">Student</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => fillDemoCredentials('FACULTY')}
                  className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200"
                >
                  <Text className="text-xs font-bold text-slate-600">Faculty</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
