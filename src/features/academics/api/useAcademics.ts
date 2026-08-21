import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../core/api';

export interface CourseSchedule {
  code: string;
  name: string;
  time: string;
  faculty: string;
  status: 'PRESENT' | 'ABSENT' | 'UPCOMING';
}

export const useTimetable = () => {
  return useQuery({
    queryKey: ['academics', 'timetable'],
    queryFn: async (): Promise<CourseSchedule[]> => {
      const response = await apiClient.get('/academics/timetable');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useMarkBleAttendance = () => {
  return useMutation({
    mutationFn: async (payload: { beaconId: string; courseCode: string }) => {
      const response = await apiClient.post('/academics/attendance/ble', payload);
      return response.data;
    },
  });
};
