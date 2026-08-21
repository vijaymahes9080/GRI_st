import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Newspaper, Archive, Bell, Calendar } from 'lucide-react-native';

export default function ENewsScreen() {
  const router = useRouter();

  const newsItems = [
    { title: 'GRI Signs MoU for Agricultural Biotechnology Research', date: 'Aug 09, 2026', tag: 'Research' },
    { title: 'National Seminar on Rural Extension & Village Adoption', date: 'Aug 04, 2026', tag: 'Extension' },
    { title: 'Special Lecture on Gandhian Peace Science', date: 'Jul 28, 2026', tag: 'Seminar' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#E65100] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">GRI e-News & Bulletins</Text>
            <Text className="text-xs text-orange-100 font-medium">Latest University News, Circulars & Archives</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Recent News & Press Releases</Text>

          {newsItems.map((n, idx) => (
            <View key={idx} className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100 mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <View className="bg-orange-100 px-2.5 py-0.5 rounded-full">
                  <Text className="text-[10px] font-bold text-[#E65100]">{n.tag}</Text>
                </View>
                <Text className="text-xs text-gray-500 font-medium">{n.date}</Text>
              </View>
              <Text className="text-sm font-bold text-gray-900 leading-snug">{n.title}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
