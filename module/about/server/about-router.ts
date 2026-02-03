import { z } from 'zod';

import {
  generateFileKey,
  getPresignedUploadUrl,
  getPublicFileUrl,
} from '@/lib/minio';
import {
  createAboutValueSchema,
  createMilestoneSchema,
  createTeamMemberSchema,
  deleteAboutValueSchema,
  deleteMilestoneSchema,
  deleteTeamMemberSchema,
  reorderAboutValuesSchema,
  reorderMilestonesSchema,
  reorderTeamMembersSchema,
  updateAboutValueSchema,
  updateMilestoneSchema,
  updateTeamMemberSchema,
} from '@/module/about/types/about-schemas';
import { adminProcedure, createTRPCRouter, publicProcedure } from '@/trpc/init';

export const aboutRouter = createTRPCRouter({
  // ============================================
  // ABOUT VALUES
  // ============================================

  /**
   * Vraća aktivne About vrednosti (public)
   */
  getActiveAboutValues: publicProcedure.query(async ({ ctx }) => {
    const values = await ctx.prisma.aboutValue.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return values;
  }),

  /**
   * Vraća sve About vrednosti (admin)
   */
  getAllAboutValues: adminProcedure.query(async ({ ctx }) => {
    const values = await ctx.prisma.aboutValue.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return values;
  }),

  /**
   * Kreira novu About vrednost
   */
  createAboutValue: adminProcedure
    .input(createAboutValueSchema)
    .mutation(async ({ ctx, input }) => {
      let sortOrder = input.sortOrder;

      if (sortOrder === undefined) {
        const last = await ctx.prisma.aboutValue.findFirst({
          orderBy: { sortOrder: 'desc' },
        });
        sortOrder = last ? last.sortOrder + 1 : 1;
      }

      const value = await ctx.prisma.aboutValue.create({
        data: {
          icon: input.icon.trim(),
          title: input.title.trim(),
          description: input.description.trim(),
          sortOrder,
          isActive: input.isActive,
        },
      });

      return value;
    }),

  /**
   * Ažurira About vrednost
   */
  updateAboutValue: adminProcedure
    .input(updateAboutValueSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const value = await ctx.prisma.aboutValue.update({
        where: { id },
        data: {
          ...(data.icon !== undefined && { icon: data.icon.trim() }),
          ...(data.title !== undefined && { title: data.title.trim() }),
          ...(data.description !== undefined && {
            description: data.description.trim(),
          }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      return value;
    }),

  /**
   * Briše About vrednost
   */
  deleteAboutValue: adminProcedure
    .input(deleteAboutValueSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.aboutValue.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Menja redosled About vrednosti
   */
  reorderAboutValues: adminProcedure
    .input(reorderAboutValuesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(
        input.items.map((item) =>
          ctx.prisma.aboutValue.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );

      return { success: true };
    }),

  // ============================================
  // MILESTONES
  // ============================================

  /**
   * Vraća aktivne Milestone (public)
   */
  getActiveMilestones: publicProcedure.query(async ({ ctx }) => {
    const milestones = await ctx.prisma.milestone.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return milestones;
  }),

  /**
   * Vraća sve Milestone (admin)
   */
  getAllMilestones: adminProcedure.query(async ({ ctx }) => {
    const milestones = await ctx.prisma.milestone.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return milestones;
  }),

  /**
   * Kreira novi Milestone
   */
  createMilestone: adminProcedure
    .input(createMilestoneSchema)
    .mutation(async ({ ctx, input }) => {
      let sortOrder = input.sortOrder;

      if (sortOrder === undefined) {
        const last = await ctx.prisma.milestone.findFirst({
          orderBy: { sortOrder: 'desc' },
        });
        sortOrder = last ? last.sortOrder + 1 : 1;
      }

      const milestone = await ctx.prisma.milestone.create({
        data: {
          year: input.year.trim(),
          title: input.title.trim(),
          description: input.description.trim(),
          sortOrder,
          isActive: input.isActive,
        },
      });

      return milestone;
    }),

  /**
   * Ažurira Milestone
   */
  updateMilestone: adminProcedure
    .input(updateMilestoneSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const milestone = await ctx.prisma.milestone.update({
        where: { id },
        data: {
          ...(data.year !== undefined && { year: data.year.trim() }),
          ...(data.title !== undefined && { title: data.title.trim() }),
          ...(data.description !== undefined && {
            description: data.description.trim(),
          }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      return milestone;
    }),

  /**
   * Briše Milestone
   */
  deleteMilestone: adminProcedure
    .input(deleteMilestoneSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.milestone.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Menja redosled Milestone
   */
  reorderMilestones: adminProcedure
    .input(reorderMilestonesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(
        input.items.map((item) =>
          ctx.prisma.milestone.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );

      return { success: true };
    }),

  // ============================================
  // TEAM MEMBERS
  // ============================================

  /**
   * Vraća aktivne članove tima (public)
   */
  getActiveTeamMembers: publicProcedure.query(async ({ ctx }) => {
    const members = await ctx.prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return members;
  }),

  /**
   * Vraća sve članove tima (admin)
   */
  getAllTeamMembers: adminProcedure.query(async ({ ctx }) => {
    const members = await ctx.prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return members;
  }),

  /**
   * Kreira novog člana tima
   */
  createTeamMember: adminProcedure
    .input(createTeamMemberSchema)
    .mutation(async ({ ctx, input }) => {
      let sortOrder = input.sortOrder;

      if (sortOrder === undefined) {
        const last = await ctx.prisma.teamMember.findFirst({
          orderBy: { sortOrder: 'desc' },
        });
        sortOrder = last ? last.sortOrder + 1 : 1;
      }

      const member = await ctx.prisma.teamMember.create({
        data: {
          name: input.name.trim(),
          role: input.role.trim(),
          specialty: input.specialty?.trim(),
          bio: input.bio?.trim(),
          imageUrl: input.imageUrl,
          imageAlt: input.imageAlt?.trim(),
          sortOrder,
          isActive: input.isActive,
        },
      });

      return member;
    }),

  /**
   * Ažurira člana tima
   */
  updateTeamMember: adminProcedure
    .input(updateTeamMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const member = await ctx.prisma.teamMember.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name.trim() }),
          ...(data.role !== undefined && { role: data.role.trim() }),
          ...(data.specialty !== undefined && {
            specialty: data.specialty?.trim() || null,
          }),
          ...(data.bio !== undefined && { bio: data.bio?.trim() || null }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          ...(data.imageAlt !== undefined && {
            imageAlt: data.imageAlt?.trim() || null,
          }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      return member;
    }),

  /**
   * Briše člana tima
   */
  deleteTeamMember: adminProcedure
    .input(deleteTeamMemberSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.teamMember.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Menja redosled članova tima
   */
  reorderTeamMembers: adminProcedure
    .input(reorderTeamMembersSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(
        input.items.map((item) =>
          ctx.prisma.teamMember.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );

      return { success: true };
    }),

  // ============================================
  // FILE UPLOADS
  // ============================================

  /**
   * Generiše presigned URL za upload slike člana tima
   */
  getTeamMemberImageUploadUrl: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const key = generateFileKey('team-members', input.fileName);
      const uploadUrl = await getPresignedUploadUrl(key);
      const publicUrl = getPublicFileUrl(key);

      return {
        uploadUrl,
        publicUrl,
        key,
      };
    }),
});
