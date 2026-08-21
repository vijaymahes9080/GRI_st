import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api';

export interface BusLocation {
  busNo: string;
  routeNo: string;
  lat: number;
  long: number;
  speed: number;
  nextStop: string;
  etaMinutes: number;
}

export const useBusGpsTracking = (busNo: string) => {
  return useQuery({
    queryKey: ['transport', 'gps', busNo],
    queryFn: async (): Promise<BusLocation> => {
      const response = await apiClient.get(`/transport/gps/${busNo}`);
      return response.data.data;
    },
    refetchInterval: 5000, // Poll GPS location every 5 seconds
  });
};
