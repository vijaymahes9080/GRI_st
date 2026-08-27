import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  MapPin, 
  ChevronRight, 
  BookOpen, 
  Server, 
  Microscope, 
  Trees, 
  HeartPulse, 
  Activity,
  Building,
  CheckCircle2
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GRI_CENTRAL_FACILITIES_INFO } from '../../core/data/griBlueprintData';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function FacilitiesDirectoryScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();

  const handleNavigate = (id: string) => {
    if (id === 'central_library') router.push('/facilities/library');
    else if (id === 'computer_centre') router.push('/facilities/computer_centre');
    else if (id === 'cif') router.push('/facilities/cif');
    else router.push('/facilities/museums');
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-[#1E3A8A] pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2.5 bg-white/20 rounded-full mr-3 active:bg-white/30">
            <ChevronLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-bold text-blue-200 tracking-wider uppercase">GRI Infrastructure</Text>
              <View className="bg-blue-800/80 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] text-white font-bold">200+ Acres</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-white mt-0.5">Central Facilities</Text>
          </View>
        </View>
        <Text className="text-xs text-blue-100 font-medium leading-relaxed">
          Comprehensive research complexes, automated central library, instructional organic farms, sports stadia, and campus healthcare.
        </Text>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: isTablet ? 24 : 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>

          <View className="gap-3.5 mb-6">
            {GRI_CENTRAL_FACILITIES_INFO.map((fac, idx) => (
              <Animated.View key={fac.id} entering={FadeInDown.delay(idx * 50).duration(400)}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleNavigate(fac.id)}
                  className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1 pr-3">
                      <View 
                        className="w-12 h-12 rounded-2xl items-center justify-center mr-3.5 shadow-sm"
                        style={{ backgroundColor: `${fac.color}15` }}
                      >
                        {fac.id === 'central_library' && <BookOpen size={24} color={fac.color} />}
                        {fac.id === 'cif' && <Microscope size={24} color={fac.color} />}
                        {fac.id === 'instructional_farm' && <Trees size={24} color={fac.color} />}
                        {fac.id === 'health_centre' && <HeartPulse size={24} color={fac.color} />}
                        {fac.id === 'computer_centre' && <Server size={24} color={fac.color} />}
                        {fac.id === 'sports_stadium' && <Activity size={24} color={fac.color} />}
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-slate-900 mb-0.5">{fac.name}</Text>
                        <Text className="text-xs font-semibold text-blue-700 mb-2">{fac.holdings}</Text>
                        
                        <View className="gap-1">
                          {fac.features.slice(0, 2).map((feat, fIdx) => (
                            <View key={fIdx} className="flex-row items-start">
                              <CheckCircle2 size={13} color={fac.color} className="mr-1.5 mt-0.5" />
                              <Text className="text-xs text-slate-600 flex-1 leading-tight">{feat}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                    <View className="items-center justify-center pt-2">
                      <ChevronRight size={18} color="#94A3B8" />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Quick Access to Museum & Archives */}
          <Animated.View entering={FadeInDown.delay(350).duration(400)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/facilities/museums')}
              className="bg-amber-50 border border-amber-200 p-4.5 rounded-2xl flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View className="w-10 h-10 rounded-xl bg-amber-100 items-center justify-center mr-3">
                  <Building size={22} color="#B45309" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-amber-950">Museum of Constructive Programme</Text>
                  <Text className="text-xs text-amber-800 mt-0.5">50 Panels showcasing Gandhian Constructive Works</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#B45309" />
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}

