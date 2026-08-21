import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api';

export interface BookItem {
  id: string;
  title: string;
  author: string;
  callNo: string;
  status: 'AVAILABLE' | 'ISSUED';
  rack: string;
}

export const useOpacSearch = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ['library', 'opac', query, page],
    queryFn: async (): Promise<{ items: BookItem[]; total: number }> => {
      const response = await apiClient.get(`/library/search?q=${encodeURIComponent(query)}&page=${page}`);
      return response.data.data;
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
