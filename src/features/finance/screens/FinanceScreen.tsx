import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { CreditCard, Download } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

export const FinanceScreen: React.FC = () => {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const feeDues = [
    { title: 'Semester 4 Tuition Fee', dueDate: '15 May 2026', amount: '₹ 12,500', status: 'PENDING' },
    { title: 'Hostel & Mess Charges (May)', dueDate: '20 May 2026', amount: '₹ 4,200', status: 'PENDING' },
    { title: 'Semester 3 Examination Fee', dueDate: '10 Jan 2026', amount: '₹ 1,800', status: 'PAID' },
  ];

  const handlePayFee = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      Alert.alert('Payment Successful', 'Transaction ID: TXN_GRI_99218841. Receipt PDF generated.');
    }, 1500);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Finance & Fee Payments" subtitle="UPI · Net Banking · Razorpay Gateway" showBack />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Active Fee Payment Banner Card */}
        <Card className="bg-emerald-900 p-5 mb-5 border-0 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <CreditCard size={20} color="#A7F3D0" />
              <Text className="text-xs font-bold text-emerald-200 ml-2">PAYMENT GATEWAY</Text>
            </View>
            <Badge label={paid ? 'PAID' : 'DUE SOON'} variant={paid ? 'success' : 'warning'} />
          </View>
          <Text className="text-white font-bold text-xl mb-1">Semester 4 Tuition Fee</Text>
          <Text className="text-2xl font-extrabold text-emerald-300 mb-1">₹ 12,500.00</Text>
          <Text className="text-xs text-emerald-100 mb-4">Due Date: 15 May 2026 · No late fine applicable</Text>

          <Button
            title={paid ? 'Receipt Downloaded ✓' : paying ? 'Processing UPI Gateway...' : 'Pay via UPI / Net Banking'}
            onPress={handlePayFee}
            loading={paying}
            disabled={paid}
            variant={paid ? 'secondary' : 'primary'}
          />
        </Card>

        {/* Transaction History & Dues */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Fee Breakdown & Receipts</Text>

        {feeDues.map((item, idx) => (
          <Card key={idx} className="p-4 mb-3 border-gray-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base font-bold text-gray-900">{item.title}</Text>
              <Badge label={item.status} variant={item.status === 'PAID' ? 'success' : 'warning'} />
            </View>
            <Text className="text-sm font-semibold text-khadi-blue mb-2">Amount: {item.amount}</Text>
            <View className="flex-row items-center justify-between border-t border-gray-100 pt-2.5">
              <Text className="text-xs text-gray-500">Due: {item.dueDate}</Text>
              {item.status === 'PAID' && (
                <TouchableOpacity
                  onPress={() => Alert.alert('Downloading Receipt', 'Downloading PDF receipt for ' + item.title)}
                  className="flex-row items-center"
                >
                  <Download size={14} color="#0D47A1" />
                  <Text className="text-xs font-semibold text-khadi-blue ml-1">Download PDF</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
