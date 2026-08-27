import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Microscope, 
  CheckCircle2, 
  Mail,
  Phone,
  Clock
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function CentralInstrumentationScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const [selectedEquip, setSelectedEquip] = useState<string>('fesem');

  const instruments = [
    {
      id: 'fesem',
      name: 'Field Emission Scanning Electron Microscope (FE-SEM)',
      make: 'Carl Zeiss / JEOL',
      purpose: 'Ultra-high resolution surface topography, nanoscale morphology, and EDX elemental composition analysis.',
      applications: ['Nanotechnology & thin films', 'Biological & botanical sample imaging', 'Polymer & composite microstructure'],
      funding: 'DST-PURSE Grant',
      specs: 'Magnification up to 1,000,000x • Resolution 1.0 nm at 15 kV',
      color: '#7C3AED',
    },
    {
      id: 'xrd',
      name: 'High-Resolution Powder X-Ray Diffractometer (XRD)',
      make: 'Bruker D8 Advance / Rigaku',
      purpose: 'Phase identification, crystal structure determination, crystallite size calculation, and lattice parameter indexing.',
      applications: ['Inorganic nanomaterials', 'Pharmaceutical drug formulations', 'Mineral & soil crystal studies'],
      funding: 'DST-FIST Phase II',
      specs: 'Cu-Ka radiation source • High precision scintillation detector • Range: 2θ from 5° to 90°',
      color: '#2563EB',
    },
    {
      id: 'nmr',
      name: 'Nuclear Magnetic Resonance Spectrometer (NMR - 400 MHz)',
      make: 'Bruker Avance 400',
      purpose: '1H, 13C, 31P, 19F 1D and 2D NMR spectroscopy for organic molecule structure elucidation and natural product isolation.',
      applications: ['Synthetic organic chemistry', 'Phytochemical extract screening', 'Biomolecular conformers'],
      funding: 'DST-FIST Grant',
      specs: '400 MHz High Resolution Superconducting Magnet with multinuclear broadband probe',
      color: '#059669',
    },
    {
      id: 'ftir',
      name: 'Fourier Transform Infrared Spectrometer (FTIR)',
      make: 'PerkinElmer Spectrum Two with ATR',
      purpose: 'Identification of organic, inorganic functional groups and polymer bond characterization in liquid, solid, and powder forms.',
      applications: ['Phytochemical functional group identification', 'Polymer cross-linking analysis', 'Water pollutant detection'],
      funding: 'UGC Non-SAP / GRI R&D',
      specs: 'Spectral Range: 4000 to 400 cm⁻¹ • Diamond ATR Crystal Accessory',
      color: '#D97706',
    },
    {
      id: 'hplc',
      name: 'High Performance Liquid Chromatography (HPLC)',
      make: 'Shimadzu Prominence',
      purpose: 'Quantitative and qualitative separation, identification, and purification of active medicinal compounds and agro-chemicals.',
      applications: ['Medicinal plant active ingredient isolation', 'Pesticide residue testing in crops', 'Food nutrient profiling'],
      funding: 'ICAR / MoE Project Support',
      specs: 'Quaternary pump system • UV-Vis photodiode array (PDA) detector',
      color: '#DC2626',
    },
  ];

  const activeEquip = instruments.find(i => i.id === selectedEquip) || instruments[0];

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-[#4C1D95] pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2.5 bg-white/20 rounded-full mr-3 active:bg-white/30"
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-bold text-purple-200 tracking-wider uppercase">Central Research Facility</Text>
              <View className="bg-purple-800/80 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] text-white font-bold">DST-FIST / PURSE</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-white mt-0.5">Central Instrumentation (CIF)</Text>
          </View>
        </View>
        <Text className="text-xs text-purple-100 font-medium leading-relaxed">
          State-of-the-art multi-crore characterization and analytical instrumentation for Ph.D. scholars, faculty, and industry.
        </Text>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: isTablet ? 24 : 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>

          {/* Instrument Selector Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5 -mx-4 px-4">
            <View className="flex-row gap-2">
              {instruments.map((inst) => (
                <TouchableOpacity
                  key={inst.id}
                  onPress={() => setSelectedEquip(inst.id)}
                  className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-2 ${
                    selectedEquip === inst.id
                      ? 'bg-purple-100 border-purple-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Microscope size={15} color={selectedEquip === inst.id ? '#6B21A8' : '#64748B'} />
                  <Text className={`text-xs font-bold ${
                    selectedEquip === inst.id ? 'text-purple-950' : 'text-slate-700'
                  }`}>
                    {inst.id.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Selected Instrument Detail Card */}
          <Animated.View entering={FadeIn.duration(300)} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
            <View className="flex-row items-start justify-between mb-3 pb-3 border-b border-slate-100">
              <View className="flex-1 pr-3">
                <Text className="text-lg font-bold text-slate-900">{activeEquip.name}</Text>
                <Text className="text-xs font-bold text-purple-700 mt-0.5">Model / Make: {activeEquip.make}</Text>
              </View>
              <View className="bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                <Text className="text-[11px] font-bold text-purple-900">{activeEquip.funding}</Text>
              </View>
            </View>

            <Text className="text-xs text-slate-700 leading-relaxed mb-4">
              {activeEquip.purpose}
            </Text>

            {/* Technical Specifications */}
            <View className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
              <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Technical Specifications
              </Text>
              <Text className="text-xs font-semibold text-slate-800 leading-relaxed">
                {activeEquip.specs}
              </Text>
            </View>

            {/* Research Applications */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Key Research & Industrial Applications
            </Text>
            <View className="gap-1.5 mb-4">
              {activeEquip.applications.map((app, idx) => (
                <View key={idx} className="flex-row items-start">
                  <CheckCircle2 size={14} color="#6B21A8" className="mr-2 mt-0.5" />
                  <Text className="text-xs text-slate-600 flex-1 leading-snug">{app}</Text>
                </View>
              ))}
            </View>

            {/* Booking Guidelines */}
            <View className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                <Text className="text-xs font-bold text-purple-950">Online Slot Booking Available</Text>
                <Text className="text-[11px] text-purple-800 mt-0.5">
                  Internal research scholars & external university users can submit sample test requisitions.
                </Text>
              </View>
              <View className="bg-purple-700 px-3 py-1.5 rounded-lg">
                <Text className="text-xs font-bold text-white">CIF Portal</Text>
              </View>
            </View>
          </Animated.View>

          {/* Contact and Location */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <Text className="text-sm font-bold text-slate-900 mb-2.5">Central Instrumentation Facility Secretariat</Text>
            <View className="gap-2 text-xs text-slate-600">
              <View className="flex-row items-center">
                <Clock size={14} color="#6B21A8" className="mr-2.5" />
                <Text className="text-xs text-slate-700">Sample Analysis Timings: 09:30 AM – 04:30 PM (Mon–Fri)</Text>
              </View>
              <View className="flex-row items-center">
                <Mail size={14} color="#6B21A8" className="mr-2.5" />
                <Text className="text-xs text-slate-700">cif@ruraluniv.ac.in</Text>
              </View>
              <View className="flex-row items-center">
                <Phone size={14} color="#6B21A8" className="mr-2.5" />
                <Text className="text-xs text-slate-700">+91 451 2452371 Ext. 2240</Text>
              </View>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}
