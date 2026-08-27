import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  Send, 
  UserCheck, 
  Award, 
  BookOpen,
  ArrowRight
} from 'lucide-react-native';
import { themeTokens } from '../../core/theme/tokens';

export interface ServiceActionModalData {
  id: string;
  title: string;
  category: string;
  icon: any;
  color: string;
  type: 'hall_ticket' | 'results' | 'attendance' | 'fees' | 'hostel_outpass' | 'cia_entry' | 'faculty_leave' | 'scholar_progress' | 'circular_broadcast' | 'plagiarism_check' | 'generic';
  data?: any;
}

interface ServiceActionModalProps {
  visible: boolean;
  onClose: () => void;
  actionData: ServiceActionModalData | null;
}

export const ServiceActionModal: React.FC<ServiceActionModalProps> = ({ visible, onClose, actionData }) => {
  const { colors } = themeTokens;
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formInput, setFormInput] = useState('');

  if (!actionData) return null;

  const handleAction = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1600);
    }, 900);
  };

  const renderContent = () => {
    if (success) {
      return (
        <View className="py-12 items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4 border border-emerald-200">
            <CheckCircle2 size={36} color="#059669" />
          </View>
          <Text className="text-xl font-bold text-slate-900 mb-1">Request Processed</Text>
          <Text className="text-sm text-slate-500 text-center px-6">
            Action completed successfully through Gandhigram Rural Institute Central Services.
          </Text>
        </View>
      );
    }

    switch (actionData.type) {
      case 'hall_ticket':
        return (
          <View className="py-2">
            <View className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-4">
              <Text className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">May 2026 End Semester Exam (ESE)</Text>
              <Text className="text-sm text-blue-950 font-semibold mb-2">Hall Ticket Verified & Ready for Download</Text>
              <Text className="text-xs text-blue-700 leading-relaxed">
                Attendance requirement met (88.4%). Examination fee cleared. Roll Number: 21BCA042.
              </Text>
            </View>

            <View className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 space-y-2">
              <View className="flex-row justify-between py-1 border-b border-slate-200/60">
                <Text className="text-xs text-slate-500 font-medium">Candidate Name</Text>
                <Text className="text-xs font-bold text-slate-900">Vijay Kumar S.</Text>
              </View>
              <View className="flex-row justify-between py-1 border-b border-slate-200/60">
                <Text className="text-xs text-slate-500 font-medium">Examination Center</Text>
                <Text className="text-xs font-bold text-slate-900">Main Academic Block (Hall 3B)</Text>
              </View>
              <View className="flex-row justify-between py-1">
                <Text className="text-xs text-slate-500 font-medium">Commencement Date</Text>
                <Text className="text-xs font-bold text-slate-900">May 14, 2026 (09:30 AM)</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAction}
              disabled={submitting}
              className="bg-primary-600 h-14 rounded-2xl flex-row items-center justify-center shadow-md shadow-primary-600/30"
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Download size={18} color="#FFFFFF" className="mr-2" />
                  <Text className="text-white font-bold text-base">Download Official ESE Hall Ticket (PDF)</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'results':
        return (
          <View className="py-2">
            <View className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xs font-bold text-slate-500 uppercase">Semester V Statement of Marks</Text>
                <View className="bg-emerald-100 px-2 py-0.5 rounded-md">
                  <Text className="text-[10px] font-bold text-emerald-800">SGPA: 8.84</Text>
                </View>
              </View>
              {[
                { code: 'CS501', title: 'Data Structures & Algorithms', credits: 4, grade: 'A+' },
                { code: 'CS502', title: 'Database Management Systems', credits: 4, grade: 'O' },
                { code: 'CS503', title: 'Web Application Development', credits: 4, grade: 'A+' },
                { code: 'CS504', title: 'Rural Extension & Community Practicum', credits: 3, grade: 'O' },
              ].map((sub, i) => (
                <View key={i} className="flex-row items-center justify-between py-2 border-b border-slate-100 last:border-none">
                  <View className="flex-1 pr-2">
                    <Text className="text-xs font-bold text-slate-900">{sub.code} • {sub.title}</Text>
                    <Text className="text-[10px] text-slate-500">{sub.credits} Credits</Text>
                  </View>
                  <Text className="text-sm font-bold text-primary-700">{sub.grade}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={handleAction} className="bg-slate-900 py-3.5 rounded-2xl items-center flex-row justify-center">
              <Download size={18} color="#FFFFFF" className="mr-2" />
              <Text className="text-white font-bold text-sm">Download Cumulative Marksheet</Text>
            </TouchableOpacity>
          </View>
        );

      case 'cia_entry':
        return (
          <View className="py-2">
            <Text className="text-xs text-slate-500 mb-3 font-medium">Select Course and upload Continuous Internal Assessment (CIA) marks:</Text>
            <View className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
              <Text className="text-xs font-bold text-slate-800">CS-601: Cloud Computing & Systems (BCA VI Sem)</Text>
              <Text className="text-[11px] text-slate-500">Enrolled: 42 Students • Max CIA Marks: 25</Text>
            </View>
            <TextInput
              placeholder="Enter batch marks or notes..."
              value={formInput}
              onChangeText={setFormInput}
              multiline
              numberOfLines={3}
              className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 mb-4"
            />
            <TouchableOpacity onPress={handleAction} disabled={submitting} className="bg-emerald-600 py-3.5 rounded-2xl items-center flex-row justify-center">
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-bold text-sm">Submit CIA Marks to Controller of Exams</Text>}
            </TouchableOpacity>
          </View>
        );

      case 'faculty_leave':
        return (
          <View className="py-2">
            <Text className="text-xs text-slate-500 mb-3 font-medium">Apply for Casual Leave (CL) / Duty Leave (OD):</Text>
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Text className="text-[10px] text-slate-500 uppercase font-bold">CL Balance</Text>
                <Text className="text-base font-bold text-slate-900">8 Days</Text>
              </View>
              <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Text className="text-[10px] text-slate-500 uppercase font-bold">EL Balance</Text>
                <Text className="text-base font-bold text-slate-900">12 Days</Text>
              </View>
            </View>
            <TextInput
              placeholder="Reason for leave & date range (e.g., Aug 30 - Sep 01)..."
              value={formInput}
              onChangeText={setFormInput}
              className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 mb-4"
            />
            <TouchableOpacity onPress={handleAction} disabled={submitting} className="bg-primary-600 py-3.5 rounded-2xl items-center flex-row justify-center">
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-bold text-sm">Submit e-Leave for HOD Approval</Text>}
            </TouchableOpacity>
          </View>
        );

      case 'scholar_progress':
        return (
          <View className="py-2">
            <View className="bg-purple-50 p-4 rounded-2xl border border-purple-100 mb-4">
              <Text className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">Doctoral Research Progress</Text>
              <Text className="text-xs text-purple-900 font-medium">Research Topic: Socio-Economic Impact of Smart Micro-Irrigation in Rural Tamil Nadu</Text>
              <Text className="text-[11px] text-purple-700 mt-1">Supervisor: Dr. R. Subburaman</Text>
            </View>
            <TouchableOpacity onPress={handleAction} disabled={submitting} className="bg-purple-600 py-3.5 rounded-2xl items-center flex-row justify-center mb-2">
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-bold text-sm">Submit RAC Milestone Report</Text>}
            </TouchableOpacity>
          </View>
        );

      case 'circular_broadcast':
        return (
          <View className="py-2">
            <TextInput
              placeholder="Notice title (e.g., Independence Day Celebration)..."
              value={formInput}
              onChangeText={setFormInput}
              className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 mb-3"
            />
            <TouchableOpacity onPress={handleAction} disabled={submitting} className="bg-red-600 py-3.5 rounded-2xl items-center flex-row justify-center">
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-bold text-sm">Dispatch to All Students & Staff</Text>}
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <View className="py-4 items-center">
            <Text className="text-sm text-slate-600 mb-4 text-center">
              Access the official {actionData.title} gateway from the Gandhigram Rural Institute portal.
            </Text>
            <TouchableOpacity onPress={handleAction} disabled={submitting} className="bg-primary-600 px-6 py-3 rounded-2xl items-center flex-row justify-center">
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-bold text-sm">Open Module</Text>}
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end sm:justify-center sm:items-center sm:p-4">
        <View className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100">
          {/* Header */}
          <View className="p-5 border-b border-slate-100 flex-row items-center justify-between bg-slate-50">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-10 h-10 rounded-2xl items-center justify-center mr-3" style={{ backgroundColor: `${actionData.color}15` }}>
                <actionData.icon size={20} color={actionData.color} />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold uppercase tracking-wider" style={{ color: actionData.color }}>
                  {actionData.category}
                </Text>
                <Text className="text-base font-bold text-slate-900" numberOfLines={1}>{actionData.title}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full bg-slate-200/70">
              <X size={18} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView className="p-5 max-h-[65vh]" showsVerticalScrollIndicator={false}>
            {renderContent()}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};
