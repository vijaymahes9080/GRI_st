import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../core/api';
import { enqueueOfflineAction } from '../../../core/offline/syncQueue';

export interface SurveyPayload {
  village: string;
  surveyType: string;
  householdData: Record<string, any>;
  geoLat: number;
  geoLong: number;
  imageUri?: string;
}

export const useSubmitSurvey = () => {
  return useMutation({
    mutationFn: async (payload: SurveyPayload) => {
      try {
        const response = await apiClient.post('/outreach/surveys', payload);
        return response.data;
      } catch {
        // Enqueue offline action if network fails
        enqueueOfflineAction('/outreach/surveys', 'POST', payload);
        return { success: true, offlineQueued: true, message: 'Saved to offline sync queue' };
      }
    },
  });
};
