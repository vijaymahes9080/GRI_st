import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { AlertCircle, Plus } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

export const ComplaintsScreen: React.FC = () => {
  const grievances = [
    { ticketId: 'GRV-8841-01', category: 'Hostel Wifi Connectivity', date: '02 May 2026', sla: '24 Hours', status: 'IN_PROGRESS', priority: 'HIGH' },
    { ticketId: 'GRV-8841-02', category: 'Library OPAC Book Reservation', date: '25 Apr 2026', sla: '48 Hours', status: 'RESOLVED', priority: 'NORMAL' },
  ];

  const handleNewGrievance = () => {
    Alert.alert('Submit Grievance', 'Opening Multi-category Grievance Submission Form.');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Grievance & Complaint Portal" subtitle="Multi-level SLA Escalation Matrix" showBack />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* New Grievance Card */}
        <Card className="bg-rose-900 p-5 mb-5 border-0 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <AlertCircle size={20} color="#FECDD3" />
              <Text className="text-xs font-bold text-rose-200 ml-2">STUDENT GRIEVANCE REDRESSAL</Text>
            </View>
            <Badge label="24x7 PORTAL" variant="info" />
          </View>
          <Text className="text-white font-bold text-lg mb-1">Submit Academic or Infrastructure Issue</Text>
          <Text className="text-xs text-rose-100 mb-4">Direct escalation to Committee Chair after 48h SLA expiry</Text>

          <Button
            title="Register New Complaint"
            onPress={handleNewGrievance}
            leftIcon={<Plus size={18} color="#FFFFFF" />}
            variant="secondary"
          />
        </Card>

        {/* Grievance Ticket History */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Track Ticket History</Text>

        {grievances.map((ticket, idx) => (
          <Card key={idx} className="p-4 mb-3 border-gray-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-bold text-khadi-blue">{ticket.ticketId}</Text>
              <Badge label={ticket.status} variant={ticket.status === 'RESOLVED' ? 'success' : 'warning'} />
            </View>

            <Text className="text-base font-semibold text-gray-800 mb-1">{ticket.category}</Text>
            <Text className="text-xs text-gray-500 mb-3">Submitted: {ticket.date} · SLA Window: {ticket.sla}</Text>

            <View className="flex-row items-center justify-between border-t border-gray-100 pt-2.5">
              <Text className="text-xs font-semibold text-red-600">Priority: {ticket.priority}</Text>
              <Button
                title="View Progress Log"
                onPress={() => Alert.alert('Ticket SLA Log', `Ticket ${ticket.ticketId} assigned to System Administrator.`)}
                size="sm"
                variant="outline"
              />
            </View>
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
