import { z } from 'zod';

import { deleteFile } from '@/lib/storage';
import { adminProcedure, createTRPCRouter } from '@/trpc/init';

export const attachmentRouter = createTRPCRouter({
  listByMedicalRecord: adminProcedure
    .input(z.object({ medicalRecordId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.attachment.findMany({
        where: { medicalRecordId: input.medicalRecordId },
        orderBy: { uploadedAt: 'desc' },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        medicalRecordId: z.string(),
        fileUrl: z.string(),
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.attachment.create({
        data: input,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const attachment = await ctx.prisma.attachment.findUnique({
        where: { id: input.id },
      });

      if (attachment) {
        // Extract key from fileUrl and delete from storage
        try {
          const url = new URL(attachment.fileUrl);
          const key = url.pathname.slice(1); // Remove leading slash
          await deleteFile(key);
        } catch {
          // If file deletion fails, still delete the record
          console.error('Failed to delete file from storage');
        }
      }

      return ctx.prisma.attachment.delete({
        where: { id: input.id },
      });
    }),
});
