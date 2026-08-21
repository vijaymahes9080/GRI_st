import { apiClient, ApiResponse } from './index';

export interface FileUploadResponse {
  fileId: string;
  url: string;
  filename: string;
  size: number;
}

export const uploadFile = async (
  fileUri: string,
  filename: string,
  mimeType: string = 'image/jpeg'
): Promise<ApiResponse<FileUploadResponse>> => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: filename,
    type: mimeType,
  } as any);

  const response = await apiClient.post<ApiResponse<FileUploadResponse>>('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
