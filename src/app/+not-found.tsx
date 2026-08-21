import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { AlertTriangle, Home, Search, ArrowLeft } from 'lucide-react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <View className="flex-1 bg-gray-50 justify-center items-center p-6">
        {/* Decorative Container */}
        <View className="bg-emerald-50 p-6 rounded-full mb-6 border border-emerald-100 shadow-sm">
          <AlertTriangle size={56} color="#518214" />
        </View>

        <Text className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Page Not Found
        </Text>

        <Text className="text-sm text-gray-600 text-center mb-8 px-4 leading-relaxed font-medium">
          The GRI portal page or route you requested does not exist or may have been moved.
        </Text>

        {/* Action Buttons */}
        <View className="w-full max-w-xs gap-3">
          <TouchableOpacity
            onPress={() => router.replace('/')}
            className="flex-row items-center justify-center bg-[#518214] py-3.5 px-6 rounded-2xl shadow-sm"
            activeOpacity={0.8}
          >
            <Home size={18} color="#FFFFFF" className="mr-2" />
            <Text className="text-white font-bold text-base ml-2">Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/search')}
            className="flex-row items-center justify-center bg-white border border-gray-300 py-3.5 px-6 rounded-2xl shadow-sm"
            activeOpacity={0.8}
          >
            <Search size={18} color="#374151" className="mr-2" />
            <Text className="text-gray-800 font-bold text-base ml-2">Search Directory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            className="flex-row items-center justify-center py-2.5 px-6"
            activeOpacity={0.7}
          >
            <ArrowLeft size={16} color="#6B7280" />
            <Text className="text-gray-500 font-semibold text-sm ml-1.5">Go Back Previous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
