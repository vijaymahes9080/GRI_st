import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Monitor, RefreshCw, Server, Activity, Globe, Database } from 'lucide-react-native';
import { apiClient } from '../../core/api';
import { themeTokens } from '../../core/theme/tokens';
import { Card } from '../../components/Card';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DiagnosticsScreen() {
  const router = useRouter();
  const { colors } = themeTokens;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDiagnostics = async () => {
    setLoading(true);
    setError('');
    try {
      // Direct axios call to bypass api v1 prefix for this specific route
      const res = await apiClient.get('/diagnostics', {
        baseURL: process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '/api') || '/api'
      });
      setData(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="pt-12 pb-4 px-4 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100">
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Backend Diagnostics</Text>
        <TouchableOpacity onPress={fetchDiagnostics} className="p-2 rounded-full bg-blue-50 border border-blue-200" disabled={loading}>
          {loading ? <ActivityIndicator size="small" color={colors.primary} /> : <RefreshCw size={18} color="#3B82F6" />}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View className="bg-white border border-slate-100 p-6 rounded-3xl mb-6 shadow-sm">
              <View className="flex-row items-center mb-6 border-b border-slate-100 pb-4">
                <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mr-4 border border-blue-100">
                  <Activity size={24} color="#3B82F6" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-slate-900">System Connection Status</Text>
                  <Text className="text-xs text-slate-500 font-medium">Live polling from Express server</Text>
                </View>
                <View className="flex-1 items-end">
                  {loading ? (
                     <View className="bg-amber-100 px-3 py-1 rounded-full">
                       <Text className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Checking...</Text>
                     </View>
                  ) : error ? (
                     <View className="bg-red-100 px-3 py-1 rounded-full">
                       <Text className="text-[10px] font-bold text-red-800 uppercase tracking-widest">Error</Text>
                     </View>
                  ) : (
                     <View className="bg-emerald-100 px-3 py-1 rounded-full flex-row items-center">
                       <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                       <Text className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Online</Text>
                     </View>
                  )}
                </View>
              </View>

              {error ? (
                <View className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <Text className="text-sm text-red-800 font-semibold">{error}</Text>
                </View>
              ) : data ? (
                <View className="space-y-4">
                  <DiagnosticRow icon={<Server size={18} color="#64748B" />} label="Status" value={data.status} valueStyle="text-emerald-600 font-bold capitalize" />
                  <DiagnosticRow icon={<Monitor size={18} color="#64748B" />} label="Environment" value={data.nodeEnv} />
                  <DiagnosticRow icon={<Server size={18} color="#64748B" />} label="Server Port" value={data.serverPort?.toString()} />
                  <DiagnosticRow icon={<Globe size={18} color="#64748B" />} label="Host" value={data.host} />
                  <DiagnosticRow icon={<Globe size={18} color="#64748B" />} label="Protocol" value={data.proto} />
                  <DiagnosticRow icon={<Globe size={18} color="#64748B" />} label="Forwarded For" value={data.forwardedFor} />
                  <DiagnosticRow icon={<Database size={18} color="#64748B" />} label="Proxy Detected" value={data.proxyDetected ? 'Yes' : 'No'} />
                  <DiagnosticRow icon={<Activity size={18} color="#64748B" />} label="Port Interference" value={data.portInterference ? 'Yes' : 'No'} />
                  
                  <View className="mt-4 pt-4 border-t border-slate-100">
                     <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">User Agent</Text>
                     <Text className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{data.userAgent}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}

function DiagnosticRow({ icon, label, value, valueStyle = "text-slate-900 font-medium" }: { icon: React.ReactNode, label: string, value: string, valueStyle?: string }) {
  return (
    <View className="flex-row items-center justify-between py-2 border-b border-slate-50">
      <View className="flex-row items-center">
        {icon}
        <Text className="text-sm text-slate-600 font-medium ml-3">{label}</Text>
      </View>
      <Text className={`text-sm ${valueStyle}`}>{value || 'N/A'}</Text>
    </View>
  );
}
