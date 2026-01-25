import {
  BUCKET_NAME,
  deleteFile,
  generateFileKey,
  getPresignedDownloadUrl,
  getPresignedUploadUrl,
} from '@/lib/minio';
import {
  deleteFileSchema,
  getDownloadUrlSchema,
  getUploadUrlSchema,
} from '@/module/upload/types/upload-schemas';
import { createTRPCRouter,protectedProcedure } from '@/trpc/init';

function getPublicFileUrl(key: string): string {
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  const port = process.env.MINIO_PORT || '9000';
  const useSSL = process.env.MINIO_USE_SSL === 'true';
  const protocol = useSSL ? 'https' : 'http';

  // If a public URL is configured, use it
  if (process.env.MINIO_PUBLIC_URL) {
    return `${process.env.MINIO_PUBLIC_URL}/${BUCKET_NAME}/${key}`;
  }

  return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${key}`;
}

export const uploadRouter = createTRPCRouter({
  /**
   * Generiše presigned URL za upload fajla
   */
  getUploadUrl: protectedProcedure
    .input(getUploadUrlSchema)
    .mutation(async ({ input }) => {
      const key = generateFileKey(input.folder, input.fileName);
      const uploadUrl = await getPresignedUploadUrl(key);
      const fileUrl = getPublicFileUrl(key);

      return {
        uploadUrl,
        fileUrl,
        key,
      };
    }),

  /**
   * Generiše presigned URL za download fajla
   */
  getDownloadUrl: protectedProcedure
    .input(getDownloadUrlSchema)
    .query(async ({ input }) => {
      const url = await getPresignedDownloadUrl(input.key);

      return { url };
    }),

  /**
   * Briše fajl iz storage-a
   */
  deleteFile: protectedProcedure
    .input(deleteFileSchema)
    .mutation(async ({ input }) => {
      await deleteFile(input.key);

      return { success: true };
    }),
});
