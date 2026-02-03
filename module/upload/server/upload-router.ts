import {
  deleteFile,
  generateFileKey,
  getPresignedDownloadUrl,
  getPresignedUploadUrl,
  getPublicFileUrl,
} from '@/lib/minio';
import {
  deleteFileSchema,
  getDownloadUrlSchema,
  getUploadUrlSchema,
} from '@/module/upload/types/upload-schemas';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

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
