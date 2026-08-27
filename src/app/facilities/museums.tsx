import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Building, 
  Award, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Info,
  Calendar
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GRI_MUSEUMS_AND_HERITAGE } from '../../core/data/griBlueprintData';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function MuseumsArchivesScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const [selectedMuseum, setSelectedMuseum] = useState<string>(GRI_MUSEUMS_AND_HERITAGE[0].id);

  const activeData = GRI_MUSEUMS_AND_HERITAGE.find(m => m.id === selectedMuseum) || GRI_MUSEUMS_AND_HERITAGE[0];

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header Banner */}
      <View className="bg-[#854D0E] pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2.5 bg-white/20 rounded-full mr-3 active:bg-white/30"
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-bold text-amber-200 tracking-wider uppercase">GRI Cultural Heritage</Text>
              <View className="bg-amber-900/80 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] text-white font-bold">Archives & Galleries</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-white mt-0.5">Museums & Art Galleries</Text>
          </View>
        </View>
        <Text className="text-xs text-amber-100 font-medium leading-relaxed">
          Preserving the living memory of Mahatma Gandhi\'s Constructive Programme and the Indian Freedom Struggle.
        </Text>
      </View>

      {/* Tabs */}
      <View className="bg-white border-b border-slate-200 px-4 py-2 flex-row gap-2">
        {GRI_MUSEUMS_AND_HERITAGE.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setSelectedMuseum(m.id)}
            className={`flex-1 py-2 px-3 rounded-xl items-center ${
              selectedMuseum === m.id ? 'bg-amber-100 border border-amber-300' : 'bg-slate-50'
            }`}
          >
            <Text className={`text-xs font-bold ${
              selectedMuseum === m.id ? 'text-amber-950' : 'text-slate-600'
            }`} numberOfLines={1}>
              {m.id.includes('constructive') ? 'Constructive Programme' : 'Freedom Fighter Gallery'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: isTablet ? 24 : 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>

          <Animated.View entering={FadeIn.duration(300)} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
            <View className="flex-row items-start justify-between mb-3 pb-3 border-b border-slate-100">
              <View className="flex-1 pr-3">
                <Text className="text-lg font-bold text-slate-900">{activeData.title}</Text>
                <Text className="text-xs font-bold text-amber-700 mt-0.5">Inaugurated: {activeData.inaugurated}</Text>
              </View>
              <View className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 items-center justify-center">
                {activeData.id.includes('constructive') ? <Building size={20} color="#854D0E" /> : <Award size={20} color="#854D0E" />}
              </View>
            </View>

            <Text className="text-xs text-slate-700 leading-relaxed mb-4">
              {activeData.description}
            </Text>

            {/* Quick Details Box */}
            <View className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-5 gap-2">
              <View className="flex-row items-center">
                <MapPin size={15} color="#854D0E" className="mr-2.5" />
                <Text className="text-xs text-slate-700 flex-1 font-medium">{activeData.location}</Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={15} color="#854D0E" className="mr-2.5" />
                <Text className="text-xs text-slate-700 flex-1 font-medium">{activeData.timings}</Text>
              </View>
              <View className="flex-row items-center">
                <Info size={15} color="#854D0E" className="mr-2.5" />
                <Text className="text-xs text-slate-700 flex-1 font-medium">Admission: {activeData.entry}</Text>
              </View>
            </View>

            {/* Thematic Exhibition Panels */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Permanent Exhibition Panels & Collections
            </Text>
            <View className="gap-2">
              {activeData.panels.map((panel, idx) => (
                <View key={idx} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex-row items-center">
                  <View className="w-6 h-6 rounded-full bg-amber-200 items-center justify-center mr-3">
                    <Text className="text-[11px] font-bold text-amber-900">{idx + 1}</Text>
                  </View>
                  <Text className="text-xs font-bold text-slate-800 flex-1">{panel}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* J.C. Kumarappa Memorial Card */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <View className="flex-row items-center mb-2.5">
              <View className="w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center mr-3">
                <Sparkles size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900">Dr. J.C. Kumarappa Heritage Collection</Text>
                <Text className="text-xs font-semibold text-emerald-700">Pioneer of Gandhian Rural Economics</Text>
              </View>
            </View>
            <Text className="text-xs text-slate-600 leading-relaxed">
              Gandhigram Rural Institute preserves original manuscripts and publications of Dr. J.C. Kumarappa (author of "Economy of Permanence"), detailing ecological economics, decentralized village industries, and rural trusteeship.
            </Text>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}
