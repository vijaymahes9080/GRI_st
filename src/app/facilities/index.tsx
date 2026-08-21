import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, ChevronRight, BookOpen, Cpu, Activity, Disc, Layers, Video } from 'lucide-react-native';
import { GRI_INSTITUTIONAL_DATA } from '../../core/services/institutionalData';

export default function FacilitiesDirectoryScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#33691E] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Campus Facilities & Labs</Text>
            <Text className="text-xs text-lime-100 font-medium">15+ Specialized Academic & Research Infrastructures</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {GRI_INSTITUTIONAL_DATA.facilities.map((fac) => (
          <TouchableOpacity
            key={fac.id}
            onPress={() => {
              if (fac.id === 'lib') router.push('/facilities/library');
              else if (fac.id === 'cc') router.push('/facilities/computer_centre');
            }}
            className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="p-3 bg-lime-50 rounded-xl mr-3 border border-lime-100">
                <MapPin size={22} color="#33691E" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-[#33691E] uppercase mb-0.5">{fac.category}</Text>
                <Text className="text-base font-bold text-gray-900">{fac.name}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">{fac.description}</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
