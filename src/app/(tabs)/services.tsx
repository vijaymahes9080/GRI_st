import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import {
  CreditCard,
  Building2,
  Library,
  AlertCircle,
  Download,
  Bus,
  ShieldCheck,
  Search,
  ArrowRight,
  Wifi,
  FileText
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';

export default function ServicesScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    { title: 'Fee Portal', subtitle: 'Pay semester fees & view receipts', icon: CreditCard, color: colors.primary, route: '/(tabs)/services' },
    { title: 'Hostel & Mess', subtitle: 'Out-pass, menus & attendance', icon: Building2, color: colors.warning, route: '/(tabs)/services' },
    { title: 'Library OPAC', subtitle: 'Search catalogs & renewals', icon: Library, color: colors.tertiary, route: '/(tabs)/services' },
    { title: 'Grievance Cell', subtitle: 'Lodge & track complaints', icon: AlertCircle, color: colors.error, route: '/(tabs)/services' },
    { title: 'Document Vault', subtitle: 'Hall tickets & transcripts', icon: Download, color: colors.info, route: '/(tabs)/services' },
    { title: 'Transport', subtitle: 'Bus routes & passes', icon: Bus, color: colors.secondary, route: '/(tabs)/services' },
    { title: 'Campus WiFi', subtitle: 'Manage device access', icon: Wifi, color: '#8B5CF6', route: '/(tabs)/services' },
    { title: 'Certificates', subtitle: 'Apply for bonafide & TC', icon: FileText, color: '#14B8A6', route: '/(tabs)/services' },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 32 : 20, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          
          <Animated.View entering={FadeIn.duration(400)} className="mb-6">
            <Text className="text-sm font-medium text-slate-500 mb-1 tracking-wider uppercase">Help Desk & Portals</Text>
            <Text className="text-3xl font-bold text-slate-900">Services</Text>
          </Animated.View>

          {/* Search */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
            <View className="flex-row items-center bg-white h-14 rounded-2xl px-4 shadow-sm border border-slate-100">
              <Search size={20} color={colors.textMuted} />
              <TextInput 
                placeholder="Find a service or portal..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 h-full text-base font-medium text-slate-900"
              />
            </View>
          </Animated.View>

          {/* Featured Service: IT Support */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
            <TouchableOpacity activeOpacity={0.8} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary-200 p-6 flex-row items-center">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center mb-3 bg-primary-50 px-2.5 py-1 rounded-md self-start">
                  <ShieldCheck size={16} color={colors.primary} />
                  <Text className="text-xs font-bold text-primary-700 ml-2 uppercase tracking-widest">IT Support</Text>
                </View>
                <Text className="text-xl font-bold text-slate-900 mb-2 leading-tight">Need Technical Help?</Text>
                <Text className="text-sm text-slate-500">Reset passwords, email access, and Smart ID issues.</Text>
              </View>
              <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center border border-primary-100">
                <ArrowRight size={24} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Services Grid */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-10">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {services.map((svc, index) => {
                const Icon = svc.icon;
                return (
                  <Card
                    key={index}
                    onPress={() => {}}
                    className="bg-white border-slate-100 shadow-sm"
                    style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}
                  >
                    <View className="flex-row items-start">
                      <View className="p-3 rounded-2xl mr-4" style={{ backgroundColor: `${svc.color}15` }}>
                        <Icon size={24} color={svc.color} strokeWidth={2} />
                      </View>
                      <View className="flex-1 pt-1">
                        <Text className="text-base font-bold text-slate-900 mb-1">{svc.title}</Text>
                        <Text className="text-sm font-medium text-slate-500 leading-relaxed">{svc.subtitle}</Text>
                      </View>
                      <View className="pt-2 pl-2">
                        <ChevronRightIcon size={20} color={colors.textMuted} />
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}

function ChevronRightIcon(props) {
  return <ArrowRight {...props} />;
}
