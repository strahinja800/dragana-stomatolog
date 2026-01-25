import { z } from 'zod';

// ============================================
// ABOUT VALUES
// ============================================

export const createAboutValueSchema = z.object({
  icon: z.string().min(1, 'Ikona je obavezna'),
  title: z.string().min(1, 'Naslov je obavezan'),
  description: z.string().min(1, 'Opis je obavezan'),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateAboutValueInput = z.infer<typeof createAboutValueSchema>;

export const updateAboutValueSchema = z.object({
  id: z.string(),
  icon: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateAboutValueInput = z.infer<typeof updateAboutValueSchema>;

export const deleteAboutValueSchema = z.object({
  id: z.string(),
});

export type DeleteAboutValueInput = z.infer<typeof deleteAboutValueSchema>;

export const reorderAboutValuesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number(),
    })
  ),
});

export type ReorderAboutValuesInput = z.infer<typeof reorderAboutValuesSchema>;

// ============================================
// MILESTONES
// ============================================

export const createMilestoneSchema = z.object({
  year: z.string().min(1, 'Godina je obavezna'),
  title: z.string().min(1, 'Naslov je obavezan'),
  description: z.string().min(1, 'Opis je obavezan'),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;

export const updateMilestoneSchema = z.object({
  id: z.string(),
  year: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;

export const deleteMilestoneSchema = z.object({
  id: z.string(),
});

export type DeleteMilestoneInput = z.infer<typeof deleteMilestoneSchema>;

export const reorderMilestonesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number(),
    })
  ),
});

export type ReorderMilestonesInput = z.infer<typeof reorderMilestonesSchema>;

// ============================================
// TEAM MEMBERS
// ============================================

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Ime je obavezno'),
  role: z.string().min(1, 'Uloga je obavezna'),
  specialty: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;

export const updateTeamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  specialty: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;

export const deleteTeamMemberSchema = z.object({
  id: z.string(),
});

export type DeleteTeamMemberInput = z.infer<typeof deleteTeamMemberSchema>;

export const reorderTeamMembersSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number(),
    })
  ),
});

export type ReorderTeamMembersInput = z.infer<typeof reorderTeamMembersSchema>;
