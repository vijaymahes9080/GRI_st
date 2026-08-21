import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../core/api';

export interface OutPassRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING_PARENT' | 'PARENT_APPROVED' | 'WARDEN_APPROVED' | 'REJECTED';
}

export const useOutPassList = () => {
  return useQuery({
    queryKey: ['hostel', 'outpass'],
    queryFn: async (): Promise<OutPassRequest[]> => {
      const response = await apiClient.get('/hostel/outpass');
      return response.data.data;
    },
  });
};

export const useCreateOutPass = () => {
  return useMutation({
    mutationFn: async (payload: Omit<OutPassRequest, 'id' | 'status'>) => {
      const response = await apiClient.post('/hostel/outpass', payload);
      return response.data;
    },
  });
};
