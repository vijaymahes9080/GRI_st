import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  KeyRound,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { apiClient } from '../../core/api';
import { themeTokens } from '../../core/theme/tokens';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = themeTokens;

  const [registerType, setRegisterType] = useState<'USER_REQUEST' | 'ADMIN_SELF'>('USER_REQUEST');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [department, setDepartment] = useState('Computer Science & Applications');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields (Full Name, Email, Password).');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (registerType === 'ADMIN_SELF' && !adminSecret.trim()) {
      setErrorMsg('Admin secret key is required for Admin self-registration.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (registerType === 'ADMIN_SELF') {
        const response = await apiClient.post('/auth/admin/register', {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password: password.trim(),
          admin_secret: adminSecret.trim(),
        });
        if (response.data) {
          setSuccessMsg('Admin registration successful! You can now sign in with your credentials.');
          Alert.alert('Admin Account Created', 'Your admin account has been created.', [
            { text: 'Go to Sign In', onPress: () => router.replace('/auth/login' as any) },
          ]);
        }
      } else {
        const response = await apiClient.post('/auth/register', {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          university_id: universityId.trim() || undefined,
          password: password.trim(),
          role: 'student',
          department: department,
          programme: 'B.Sc. Computer Science',
          year: 1,
        });
        setSuccessMsg('Registration successful! You can now sign in with your credentials.');
        Alert.alert('Account Registered', 'Your GRI user account has been registered.', [
          { text: 'Go to Sign In', onPress: () => router.replace('/auth/login' as any) },
        ]);
      }
    } catch (err: any) {
      console.warn('[RegisterScreen] Registration error:', err?.response?.data || err.message);
      const detail = err?.response?.data?.detail;
      setErrorMsg(typeof detail === 'string' ? detail : 'Registration failed. Please check inputs and secret key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.surface }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-row items-center pt-16 pb-4 px-4 bg-white border-b border-slate-100 z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-slate-50 rounded-full mr-3 border border-slate-100">
          <ChevronLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-slate-900">Request Access</Text>
          <Text className="text-xs text-slate-500 font-medium">GRI Multi-User Portal</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View className="flex-row bg-slate-100 p-1.5 rounded-2xl mb-8">
            <TouchableOpacity
              onPress={() => { setRegisterType('USER_REQUEST'); setErrorMsg(null); }}
              className={`flex-1 py-3 rounded-xl items-center ${registerType === 'USER_REQUEST' ? 'bg-white shadow-sm border border-slate-200' : ''}`}
            >
              <Text className={`text-sm font-bold ${registerType === 'USER_REQUEST' ? 'text-primary-800' : 'text-slate-500'}`}>Student/Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setRegisterType('ADMIN_SELF'); setErrorMsg(null); }}
              className={`flex-1 py-3 rounded-xl items-center ${registerType === 'ADMIN_SELF' ? 'bg-white shadow-sm border border-slate-200' : ''}`}
            >
              <Text className={`text-sm font-bold ${registerType === 'ADMIN_SELF' ? 'text-rose-700' : 'text-slate-500'}`}>Admin Self-Reg</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          {errorMsg && (
            <View className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-6 flex-row items-center">
              <AlertCircle size={20} color={colors.error} />
              <Text className="text-sm text-red-700 font-medium ml-3 flex-1">{errorMsg}</Text>
            </View>
          )}
          {successMsg && (
            <View className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-6 flex-row items-center">
              <CheckCircle size={20} color={colors.success} />
              <Text className="text-sm text-emerald-800 font-medium ml-3 flex-1">{successMsg}</Text>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</Text>
            <View className="flex-row items-center bg-slate-50 h-14 border border-slate-200 rounded-2xl px-4 focus:border-primary-400 focus:bg-white">
              <User size={20} color={colors.textMuted} />
              <TextInput value={fullName} onChangeText={setFullName} placeholder="e.g. Vijay Kumar" className="flex-1 ml-3 h-full text-base font-medium text-slate-900" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center bg-slate-50 h-14 border border-slate-200 rounded-2xl px-4 focus:border-primary-400 focus:bg-white">
              <Mail size={20} color={colors.textMuted} />
              <TextInput value={email} onChangeText={setEmail} placeholder="user@ruraluniv.ac.in" keyboardType="email-address" autoCapitalize="none" className="flex-1 ml-3 h-full text-base font-medium text-slate-900" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Phone Number</Text>
            <View className="flex-row items-center bg-slate-50 h-14 border border-slate-200 rounded-2xl px-4 focus:border-primary-400 focus:bg-white">
              <Phone size={20} color={colors.textMuted} />
              <TextInput value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" className="flex-1 ml-3 h-full text-base font-medium text-slate-900" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Department / School</Text>
            <View className="flex-row items-center bg-slate-50 h-14 border border-slate-200 rounded-2xl px-4 focus:border-primary-400 focus:bg-white">
              <Building size={20} color={colors.textMuted} />
              <TextInput value={department} onChangeText={setDepartment} placeholder="Computer Science" className="flex-1 ml-3 h-full text-base font-medium text-slate-900" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</Text>
            <View className="flex-row items-center bg-slate-50 h-14 border border-slate-200 rounded-2xl px-4 focus:border-primary-400 focus:bg-white">
              <Lock size={20} color={colors.textMuted} />
              <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" className="flex-1 ml-3 h-full text-base font-medium text-slate-900" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Confirm Password</Text>
            <View className="flex-row items-center bg-slate-50 h-14 border border-slate-200 rounded-2xl px-4 focus:border-primary-400 focus:bg-white">
              <Lock size={20} color={colors.textMuted} />
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="••••••••" className="flex-1 ml-3 h-full text-base font-medium text-slate-900" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          {registerType === 'ADMIN_SELF' && (
            <Animated.View entering={FadeInUp.duration(400)} className="mb-6 bg-red-50 p-4 rounded-2xl border border-red-100">
              <Text className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 ml-1">Admin Secret Key</Text>
              <View className="flex-row items-center bg-white h-14 border border-red-200 rounded-xl px-4">
                <KeyRound size={20} color={colors.error} />
                <TextInput value={adminSecret} onChangeText={setAdminSecret} secureTextEntry placeholder="ADMIN_REGISTER_SECRET" className="flex-1 ml-3 h-full text-base font-medium text-slate-900" placeholderTextColor={colors.textMuted} />
              </View>
              <Text className="text-[10px] text-red-600 font-medium mt-2 ml-1">Required to authorize creation of an admin account.</Text>
            </Animated.View>
          )}

          <TouchableOpacity onPress={handleRegister} disabled={isLoading} className="bg-primary-700 h-14 rounded-2xl items-center justify-center shadow-md mb-8">
            {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-bold text-lg">Submit Request</Text>}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
