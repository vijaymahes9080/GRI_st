import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Home, 
  Sprout, 
  Sparkles, 
  Globe, 
  BookOpen, 
  Radio, 
  Layers, 
  Users, 
  CheckCircle2, 
  MapPin, 
  Award,
  ChevronRight,
  HeartHandshake
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GRI_EXTENSION_CENTRES, GRI_TRIPILLAR_MODEL } from '../../core/data/griBlueprintData';
import { themeTokens } from '../../core/theme/tokens';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function ExtensionOutreachScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;
  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'flagship' | 'community'>('all');

  const activeCentreData = GRI_EXTENSION_CENTRES.find(c => c.id === selectedCentre);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header Banner */}
      <View className="bg-[#1B5E20] pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2.5 bg-white/20 rounded-full mr-3 active:bg-white/30"
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-bold text-emerald-200 tracking-wider uppercase">GRI Official Extension</Text>
              <View className="bg-emerald-800/80 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] text-white font-bold">3rd Dimension</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-white mt-0.5">Extension & Rural Outreach</Text>
          </View>
        </View>
        <Text className="text-xs text-emerald-100 font-medium leading-relaxed">
          The heart of Gandhigram Rural Institute: Translating laboratory research into grassroots village transformation since 1956.
        </Text>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: isTablet ? 24 : 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>
          
          {/* Tripillar Dimension Banner */}
          <Animated.View entering={FadeInDown.duration(400)} className="mb-6">
            <View className="bg-gradient-to-br bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <View className="flex-row items-center mb-2.5">
                <View className="w-10 h-10 rounded-xl bg-emerald-100 items-center justify-center mr-3">
                  <Layers size={22} color="#1B5E20" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900">{GRI_TRIPILLAR_MODEL.title}</Text>
                  <Text className="text-xs font-medium text-emerald-700">Lab-to-Land and Land-to-Lab Philosophy</Text>
                </View>
              </View>
              <Text className="text-xs text-slate-600 leading-relaxed mb-4">
                {GRI_TRIPILLAR_MODEL.description}
              </Text>
              
              <View className="gap-2.5">
                {GRI_TRIPILLAR_MODEL.pillars.map((pillar, idx) => (
                  <View key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex-row items-start">
                    <View className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 mr-2.5" />
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-slate-800">{pillar.title}</Text>
                      <Text className="text-[11px] text-slate-600 mt-0.5 leading-normal">{pillar.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Extension Centres Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-slate-900">Flagship Extension Centres</Text>
                <Text className="text-xs font-medium text-slate-500">Official field wings, programmes & village cells</Text>
              </View>
              <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <Text className="text-xs font-bold text-emerald-800">{GRI_EXTENSION_CENTRES.length} Units</Text>
              </View>
            </View>
          </Animated.View>

          {/* Extension Centres List */}
          <View className="gap-3.5 mb-8">
            {GRI_EXTENSION_CENTRES.map((centre, idx) => {
              const isSelected = selectedCentre === centre.id;
              
              return (
                <Animated.View key={centre.id} entering={FadeInDown.delay(150 + idx * 50).duration(400)}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setSelectedCentre(isSelected ? null : centre.id)}
                    className={`bg-white rounded-2xl border p-4.5 shadow-sm transition-all ${
                      isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                    }`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row items-start flex-1 pr-3">
                        <View 
                          className="w-12 h-12 rounded-2xl items-center justify-center mr-3.5 shadow-sm"
                          style={{ backgroundColor: `${centre.color}15` }}
                        >
                          {centre.id === 'shanti_sena' && <ShieldCheck size={24} color={centre.color} />}
                          {centre.id === 'vpp' && <Home size={24} color={centre.color} />}
                          {centre.id === 'kvk' && <Sprout size={24} color={centre.color} />}
                          {centre.id === 'sanitary_park' && <Sparkles size={24} color={centre.color} />}
                          {centre.id === 'uba' && <Globe size={24} color={centre.color} />}
                          {centre.id === 'clle' && <BookOpen size={24} color={centre.color} />}
                          {centre.id === 'community_radio' && <Radio size={24} color={centre.color} />}
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                            <Text className="text-base font-bold text-slate-900">{centre.name}</Text>
                            <View className="bg-slate-100 px-2 py-0.5 rounded-md">
                              <Text className="text-[10px] font-bold text-slate-600">Est. {centre.established}</Text>
                            </View>
                          </View>
                          <Text className="text-xs font-semibold text-emerald-800 mb-1">{centre.head}</Text>
                          <Text className="text-xs text-slate-600 leading-relaxed" numberOfLines={isSelected ? undefined : 2}>
                            {centre.description}
                          </Text>
                        </View>
                      </View>
                      <View className="items-center justify-center pt-1">
                        <ChevronRight 
                          size={18} 
                          color={isSelected ? '#059669' : '#94A3B8'} 
                          style={{ transform: [{ rotate: isSelected ? '90deg' : '0deg' }] }}
                        />
                      </View>
                    </View>

                    {/* Expanded Highlights */}
                    {isSelected && (
                      <View className="mt-4 pt-3.5 border-t border-slate-100">
                        <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                          Key Functions & Mandates
                        </Text>
                        <View className="gap-2">
                          {centre.highlights.map((point, pIdx) => (
                            <View key={pIdx} className="flex-row items-start">
                              <CheckCircle2 size={15} color={centre.color} className="mr-2 mt-0.5" />
                              <Text className="text-xs text-slate-700 flex-1 leading-snug">{point}</Text>
                            </View>
                          ))}
                        </View>

                        <View className="mt-4 pt-3 flex-row items-center justify-between border-t border-slate-100">
                          <View className="flex-row items-center gap-1.5">
                            <MapPin size={13} color="#64748B" />
                            <Text className="text-[11px] font-medium text-slate-500">Gandhigram Rural Institute Campus</Text>
                          </View>
                          <View className="bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                            <Text className="text-[11px] font-bold text-emerald-800">{centre.category}</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Quick Navigation Cards to other institutional hubs */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Text className="text-base font-bold text-slate-900 mb-3">Explore Institutional Knowledge</Text>
            <View className="flex-row gap-3 flex-wrap">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/about/heritage')}
                className="flex-1 min-w-[160px] bg-amber-50 border border-amber-200 p-4 rounded-2xl"
              >
                <Award size={20} color="#D97706" className="mb-2" />
                <Text className="text-sm font-bold text-amber-950">Gandhian Heritage</Text>
                <Text className="text-xs text-amber-800 mt-0.5">Founders, Nai Talim & Community Life</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/facilities/museums')}
                className="flex-1 min-w-[160px] bg-sky-50 border border-sky-200 p-4 rounded-2xl"
              >
                <Layers size={20} color="#0284C7" className="mb-2" />
                <Text className="text-sm font-bold text-sky-950">Museums & Archives</Text>
                <Text className="text-xs text-sky-800 mt-0.5">Constructive Programme & Art Gallery</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}
