import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Award, CheckCircle2 } from 'lucide-react-native';

export default function VisionMissionScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Vision & Mission</Text>
            <Text className="text-xs text-emerald-100 font-medium">Gandhigram Rural Institute Institutional Mandate</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2">Institutional Vision</Text>
          <View className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-4">
            <Text className="text-sm font-medium text-emerald-950 leading-relaxed italic">
              "To provide value-based higher education, extension service, and research to create a classless, casteless, and non-violent society through rural development and self-reliance."
            </Text>
          </View>

          <Text className="text-base font-bold text-gray-900 mb-2">Institutional Mission</Text>
          {[
            'To foster academic excellence in rural development, agriculture, health, science, and technology.',
            'To promote Gandhian values, peace science, and Nai Talim methodology.',
            'To undertake rural extension and village adoption for community empowerment.',
            'To build sustainable green campus infrastructure and rural entrepreneurship.',
          ].map((m, idx) => (
            <View key={idx} className="flex-row items-start mb-3">
              <CheckCircle2 size={16} color="#518214" style={{ marginTop: 2 }} />
              <Text className="text-xs text-gray-700 font-medium ml-2.5 flex-1 leading-relaxed">{m}</Text>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
