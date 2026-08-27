import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  BookOpen, 
  CheckCircle2, 
  Quote
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { 
  GRI_FOUNDERS, 
  GRI_COMMUNITY_LIFE, 
  GRI_SISTER_INSTITUTIONS
} from '../../core/data/griBlueprintData';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function GandhianHeritageScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const [activeTab, setActiveTab] = useState<'founders' | 'naitalim' | 'traditions' | 'sister_trust'>('founders');

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header Banner */}
      <View className="bg-[#B45309] pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2.5 bg-white/20 rounded-full mr-3 active:bg-white/30"
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-bold text-amber-200 tracking-wider uppercase">Living Gandhian Legacy</Text>
              <View className="bg-amber-800/80 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] text-white font-bold">Since 1956</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-white mt-0.5">Founders & Heritage</Text>
          </View>
        </View>
        <Text className="text-xs text-amber-100 font-medium leading-relaxed">
          Founded on the bedrock of Mahatma Gandhi's Nai Talim (Basic Education) and dedicated service to rural India.
        </Text>
      </View>

      {/* Navigation Tabs */}
      <View className="bg-white border-b border-slate-200 px-4 py-2 flex-row justify-between">
        {[
          { id: 'founders', label: 'Founders' },
          { id: 'naitalim', label: 'Nai Talim' },
          { id: 'traditions', label: 'Community Life' },
          { id: 'sister_trust', label: 'Sister Trusts' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3 rounded-xl ${
              activeTab === tab.id ? 'bg-amber-100 border border-amber-300' : 'bg-transparent'
            }`}
          >
            <Text className={`text-xs font-bold ${
              activeTab === tab.id ? 'text-amber-900' : 'text-slate-600'
            }`}>
              {tab.label}
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

          {/* FOUNDERS TAB */}
          {activeTab === 'founders' && (
            <View className="gap-5">
              <Animated.View entering={FadeIn.duration(300)}>
                <Text className="text-base font-bold text-slate-900 mb-1">The Visionary Architects of Gandhigram</Text>
                <Text className="text-xs text-slate-500 mb-4">
                  Guided directly by Mahatma Gandhi to build an educational oasis for rural self-reliance.
                </Text>
              </Animated.View>

              {GRI_FOUNDERS.map((founder, idx) => (
                <Animated.View 
                  key={idx} 
                  entering={FadeInDown.delay(idx * 100).duration(400)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-slate-100">
                    <View className="flex-1 pr-2">
                      <Text className="text-lg font-bold text-slate-900">{founder.name}</Text>
                      <Text className="text-xs font-bold text-amber-700">{founder.role}</Text>
                    </View>
                    <View className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Text className="text-[11px] font-bold text-amber-900">{founder.lifespan}</Text>
                    </View>
                  </View>

                  <Text className="text-xs text-slate-700 leading-relaxed mb-4">
                    {founder.bio}
                  </Text>

                  {/* Quote Block */}
                  <View className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/70 mb-4 flex-row items-start">
                    <Quote size={18} color="#B45309" className="mr-2 mt-0.5" />
                    <Text className="text-xs italic text-amber-950 font-medium flex-1 leading-snug">
                      {founder.quote}
                    </Text>
                  </View>

                  <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Key Historical Milestones
                  </Text>
                  <View className="gap-1.5">
                    {founder.contributions.map((c, cIdx) => (
                      <View key={cIdx} className="flex-row items-start">
                        <CheckCircle2 size={14} color="#B45309" className="mr-2 mt-0.5" />
                        <Text className="text-xs text-slate-600 flex-1 leading-snug">{c}</Text>
                      </View>
                    ))}
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          {/* NAI TALIM TAB */}
          {activeTab === 'naitalim' && (
            <Animated.View entering={FadeIn.duration(300)} className="gap-4">
              <View className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 rounded-xl bg-amber-100 items-center justify-center mr-3">
                    <BookOpen size={22} color="#B45309" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-900">Nai Talim (Basic Education)</Text>
                    <Text className="text-xs font-medium text-amber-700">Education for Life, through Life</Text>
                  </View>
                </View>
                <Text className="text-xs text-slate-700 leading-relaxed mb-4">
                  Formulated by Mahatma Gandhi at the Wardha Educational Conference in 1937, Nai Talim posits that true education integrates the hand (physical craft), the head (intellect), and the heart (ethics & compassion).
                </Text>

                <View className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                  <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Core Pedagogical Principles
                  </Text>
                  <View className="gap-2">
                    {[
                      { t: 'Productive Work as Medium of Instruction', d: 'Learning scientific principles, mathematics, and language through practical agriculture, weaving, and rural technologies.' },
                      { t: 'Self-Reliance (Swavalamban)', d: 'Training students to be physically self-sufficient, capable of producing their own food, clothing, and community resources.' },
                      { t: 'Harmonious Synthesis of 3H', d: 'Simultaneous cultivation of the Head (intellect), Heart (spiritual unity), and Hand (productive labor).' },
                      { t: 'Non-Exploitative Social Order', d: 'Fostering democratic equality where physical labor carries the highest dignity alongside intellectual endeavor.' },
                    ].map((item, idx) => (
                      <View key={idx} className="flex-row items-start">
                        <View className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 mr-2.5" />
                        <View className="flex-1">
                          <Text className="text-xs font-bold text-slate-800">{item.t}</Text>
                          <Text className="text-[11px] text-slate-600 mt-0.5">{item.d}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 3D Tripillar Connection */}
                <View className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <Text className="text-xs font-bold text-amber-950 mb-1">
                    From Nai Talim to the University 3D Dimension
                  </Text>
                  <Text className="text-xs text-amber-900 leading-relaxed">
                    At Gandhigram Rural Institute, this philosophy evolved into the accredited Three-Dimensional System: Teaching, Research, and Extension. Every degree syllabus integrates mandatory village field immersion and practical community problem-solving.
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* TRADITIONS TAB */}
          {activeTab === 'traditions' && (
            <Animated.View entering={FadeIn.duration(300)} className="gap-4">
              <View className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <Text className="text-base font-bold text-slate-900 mb-1">{GRI_COMMUNITY_LIFE.title}</Text>
                <Text className="text-xs text-slate-600 leading-relaxed mb-4">
                  {GRI_COMMUNITY_LIFE.description}
                </Text>

                <View className="gap-3.5">
                  {GRI_COMMUNITY_LIFE.traditions.map((trad, idx) => (
                    <View key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <View className="flex-row items-center justify-between mb-1.5">
                        <Text className="text-sm font-bold text-slate-900">{trad.title}</Text>
                        <View className="bg-amber-100 px-2 py-0.5 rounded-md">
                          <Text className="text-[10px] font-bold text-amber-900">{trad.time}</Text>
                        </View>
                      </View>
                      <Text className="text-xs text-slate-600 leading-relaxed">{trad.details}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          )}

          {/* SISTER TRUSTS TAB */}
          {activeTab === 'sister_trust' && (
            <Animated.View entering={FadeIn.duration(300)} className="gap-4">
              <View className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <Text className="text-base font-bold text-slate-900 mb-1">Gandhigram Trust Ecosystem</Text>
                <Text className="text-xs text-slate-600 leading-relaxed mb-4">
                  The wider complex of philanthropic, medical, and cottage industrial institutions founded alongside GRI at Gandhigram:
                </Text>

                <View className="gap-3.5">
                  {GRI_SISTER_INSTITUTIONS.map((inst, idx) => (
                    <View key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-sm font-bold text-slate-900">{inst.name}</Text>
                        <Text className="text-[11px] font-bold text-emerald-700">{inst.founded}</Text>
                      </View>
                      <Text className="text-xs text-slate-600 leading-relaxed">{inst.description}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}
