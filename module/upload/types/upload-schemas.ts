import { z } from 'zod';

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

export const allowedUploadTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const managedUploadFolders = ['attachments'] as const;

export const getUploadUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.enum(allowedUploadTypes),
  fileSize: z.number().int().positive().max(MAX_UPLOAD_SIZE_BYTES),
  folder: z.enum(managedUploadFolders).default('attachments'),
});

export type GetUploadUrlInput = z.infer<typeof getUploadUrlSchema>;

export const deleteFileSchema = z.object({
  key: z.string().min(1),
});

export type DeleteFileInput = z.infer<typeof deleteFileSchema>;

export const getDownloadUrlSchema = z.object({
  key: z.string().min(1),
});

export type GetDownloadUrlInput = z.infer<typeof getDownloadUrlSchema>;
