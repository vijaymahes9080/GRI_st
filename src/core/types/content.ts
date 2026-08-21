import { z } from 'zod';

export type EntityType =
  | 'announcement'
  | 'news'
  | 'event'
  | 'department'
  | 'programme'
  | 'faculty'
  | 'admission'
  | 'exam'
  | 'result'
  | 'document'
  | 'facility'
  | 'placement'
  | 'contact';

export const ContentAttachmentSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  url: z.string().url(),
  mimeType: z.string().default('application/pdf'),
  sizeBytes: z.number().optional(),
});

export type ContentAttachment = z.infer<typeof ContentAttachmentSchema>;

export const ContentEntitySchema = z.object({
  id: z.string().uuid(),
  entityType: z.enum([
    'announcement',
    'news',
    'event',
    'department',
    'programme',
    'faculty',
    'admission',
    'exam',
    'result',
    'document',
    'facility',
    'placement',
    'contact',
  ]),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  contentHtml: z.string().optional().nullable(),
  category: z.string().default('General'),
  status: z.enum(['draft', 'published', 'archived', 'syncing']).default('published'),
  sourceUrl: z.string().url().optional().nullable(),
  sourceId: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  attachments: z.array(ContentAttachmentSchema).default([]),
  metadata: z.record(z.string(), z.unknown()).default({}),
  checksum: z.string().optional().nullable(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
});

export type ContentEntity = z.infer<typeof ContentEntitySchema>;
