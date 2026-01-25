import { z } from 'zod';

export const getUploadUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  folder: z.string().optional().default('uploads'),
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
