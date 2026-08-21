import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api';

export interface ExamResult {
  code: string;
  title: string;
  grade: string;
  credits: number;
  points: number;
}

export const useExamResults = (semester: number) => {
  return useQuery({
    queryKey: ['examinations', 'results', semester],
    queryFn: async (): Promise<ExamResult[]> => {
      const response = await apiClient.get(`/examinations/results?semester=${semester}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
