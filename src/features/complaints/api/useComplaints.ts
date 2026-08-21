import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../core/api';

export interface GrievanceTicket {
  ticketId: string;
  category: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  slaExpiresAt: string;
}

export const useGrievanceTickets = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['complaints', 'tickets', statusFilter],
    queryFn: async (): Promise<GrievanceTicket[]> => {
      const url = statusFilter ? `/complaints/tickets?status=${statusFilter}` : '/complaints/tickets';
      const response = await apiClient.get(url);
      return response.data.data;
    },
  });
};

export const useCreateGrievance = () => {
  return useMutation({
    mutationFn: async (payload: { category: string; description: string; priority: string }) => {
      const response = await apiClient.post('/complaints/tickets', payload);
      return response.data;
    },
  });
};
