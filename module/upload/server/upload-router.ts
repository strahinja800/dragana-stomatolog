import { TRPCError } from '@trpc/server';

import {
  deleteFile,
  generateFileKey,
  getPresignedDownloadUrl,
  getPresignedUploadUrl,
  getPublicFileUrl,
} from '@/lib/storage';
import {
  deleteFileSchema,
  getDownloadUrlSchema,
  getUploadUrlSchema,
  managedUploadFolders,
} from '@/module/upload/types/upload-schemas';
import { adminProcedure, createTRPCRouter } from '@/trpc/init';

function assertManagedStorageKey(key: string) {
  const isInManagedFolder = managedUploadFolders.some((folder) =>
    key.startsWith(`${folder}/`)
  );

  const isManagedAttachmentKey =
    isInManagedFolder &&
    !key.includes('..') &&
    !key.includes('\\') &&
    !key.includes('//') &&
    !key.startsWith('/');

  if (!isManagedAttachmentKey) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Nevažeći storage ključ',
    });
  }
}

export const uploadRouter = createTRPCRouter({
  /**
   * Generiše presigned URL za upload fajla
   */
  getUploadUrl: adminProcedure
    .input(getUploadUrlSchema)
    .mutation(async ({ input }) => {
      const key = generateFileKey(input.folder, input.fileName);
      const uploadUrl = await getPresignedUploadUrl(key, input.fileType);
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
  getDownloadUrl: adminProcedure
    .input(getDownloadUrlSchema)
    .query(async ({ input }) => {
      assertManagedStorageKey(input.key);
      const url = await getPresignedDownloadUrl(input.key);

      return { url };
    }),

  /**
   * Briše fajl iz storage-a
   */
  deleteFile: adminProcedure
    .input(deleteFileSchema)
    .mutation(async ({ input }) => {
      assertManagedStorageKey(input.key);
      await deleteFile(input.key);

      return { success: true };
    }),
});
