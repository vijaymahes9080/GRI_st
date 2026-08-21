import { z } from 'zod';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  timestamp: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta?: PaginationMeta;
  error?: ApiErrorPayload | null;
  requestId: string;
}

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
        timestamp: z.string(),
      })
      .optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.array(z.unknown()).optional(),
      })
      .nullable()
      .optional(),
    requestId: z.string(),
  });
