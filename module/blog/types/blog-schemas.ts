import { z } from 'zod';

// ============================================
// BLOG POST SCHEMAS
// ============================================

export const blogPostStatusSchema = z.enum(['DRAFT', 'PUBLISHED']);

export type BlogPostStatus = z.infer<typeof blogPostStatusSchema>;

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Naslov je obavezan'),
  slug: z
    .string()
    .min(1, 'Slug je obavezan')
    .regex(slugRegex, 'Slug može sadržati samo mala slova, brojeve i crtice'),
  content: z.string().min(1, 'Sadržaj je obavezan'),
  status: blogPostStatusSchema,
  publishedAt: z.date().optional().nullable(),
  sortOrder: z.number().optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

export const updateBlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(slugRegex, 'Slug može sadržati samo mala slova, brojeve i crtice')
    .optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  status: blogPostStatusSchema.optional(),
  publishedAt: z.date().optional().nullable(),
  sortOrder: z.number().optional(),
});

export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;

export const deleteBlogPostSchema = z.object({
  id: z.string(),
});

export type DeleteBlogPostInput = z.infer<typeof deleteBlogPostSchema>;

export const getBlogPostBySlugSchema = z.object({
  slug: z.string(),
});

export type GetBlogPostBySlugInput = z.infer<typeof getBlogPostBySlugSchema>;

export const generateSlugSchema = z.object({
  title: z.string(),
});

export type GenerateSlugInput = z.infer<typeof generateSlugSchema>;

export const reorderBlogPostsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number(),
    })
  ),
});

export type ReorderBlogPostsInput = z.infer<typeof reorderBlogPostsSchema>;
