import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { generateFileKey, getPresignedUploadUrl } from '@/lib/minio';
import {
  createBlogPostSchema,
  deleteBlogPostSchema,
  generateSlugSchema,
  getBlogPostBySlugSchema,
  reorderBlogPostsSchema,
  updateBlogPostSchema,
} from '@/module/blog/types/blog-schemas';
import { adminProcedure, createTRPCRouter, publicProcedure } from '@/trpc/init';

/**
 * Helper function to generate slug from title
 * Handles Serbian characters and creates URL-safe slugs
 */
function generateSlugFromTitle(title: string): string {
  const serbianMap: Record<string, string> = {
    č: 'c',
    ć: 'c',
    ž: 'z',
    š: 's',
    đ: 'd',
    Č: 'c',
    Ć: 'c',
    Ž: 'z',
    Š: 's',
    Đ: 'd',
  };

  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[čćžšđČĆŽŠĐ]/g, (char) => serbianMap[char] || char)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const blogRouter = createTRPCRouter({
  // ============================================
  // PUBLIC PROCEDURES
  // ============================================

  /**
   * Vraća sve objavljene blog postove (public)
   */
  getPublishedPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        imageAlt: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    return posts;
  }),

  /**
   * Vraća jedan blog post po slug-u (public)
   */
  getPostBySlug: publicProcedure
    .input(getBlogPostBySlugSchema)
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { slug: input.slug },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Članak nije pronađen',
        });
      }

      if (post.status !== 'PUBLISHED') {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Članak nije pronađen',
        });
      }

      return post;
    }),

  // ============================================
  // ADMIN PROCEDURES
  // ============================================

  /**
   * Vraća sve blog postove (admin)
   */
  getAllPosts: adminProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.blogPost.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return posts;
  }),

  /**
   * Vraća jedan blog post po ID-u (admin)
   */
  getPostById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Članak nije pronađen',
        });
      }

      return post;
    }),

  /**
   * Kreira novi blog post
   */
  createPost: adminProcedure
    .input(createBlogPostSchema)
    .mutation(async ({ ctx, input }) => {
      const existingPost = await ctx.prisma.blogPost.findUnique({
        where: { slug: input.slug },
      });

      if (existingPost) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Članak sa ovim slug-om već postoji',
        });
      }

      let sortOrder = input.sortOrder;
      if (sortOrder === undefined) {
        const last = await ctx.prisma.blogPost.findFirst({
          orderBy: { sortOrder: 'desc' },
        });
        sortOrder = last ? last.sortOrder + 1 : 1;
      }

      const post = await ctx.prisma.blogPost.create({
        data: {
          title: input.title.trim(),
          slug: input.slug.trim(),
          content: input.content,
          excerpt: input.excerpt?.trim(),
          featuredImage: input.featuredImage,
          imageAlt: input.imageAlt?.trim(),
          status: input.status,
          publishedAt:
            input.status === 'PUBLISHED'
              ? (input.publishedAt ?? new Date())
              : null,
          sortOrder,
        },
      });

      return post;
    }),

  /**
   * Ažurira blog post
   */
  updatePost: adminProcedure
    .input(updateBlogPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (data.slug) {
        const existingPost = await ctx.prisma.blogPost.findFirst({
          where: {
            slug: data.slug,
            id: { not: id },
          },
        });

        if (existingPost) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Članak sa ovim slug-om već postoji',
          });
        }
      }

      let publishedAt = data.publishedAt;
      if (data.status === 'PUBLISHED') {
        const currentPost = await ctx.prisma.blogPost.findUnique({
          where: { id },
        });
        if (currentPost && !currentPost.publishedAt && !publishedAt) {
          publishedAt = new Date();
        }
      }

      const post = await ctx.prisma.blogPost.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title.trim() }),
          ...(data.slug !== undefined && { slug: data.slug.trim() }),
          ...(data.content !== undefined && { content: data.content }),
          ...(data.excerpt !== undefined && {
            excerpt: data.excerpt?.trim() || null,
          }),
          ...(data.featuredImage !== undefined && {
            featuredImage: data.featuredImage,
          }),
          ...(data.imageAlt !== undefined && {
            imageAlt: data.imageAlt?.trim() || null,
          }),
          ...(data.status !== undefined && { status: data.status }),
          ...(publishedAt !== undefined && { publishedAt }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        },
      });

      return post;
    }),

  /**
   * Briše blog post
   */
  deletePost: adminProcedure
    .input(deleteBlogPostSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.blogPost.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Menja redosled blog postova
   */
  reorderPosts: adminProcedure
    .input(reorderBlogPostsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(
        input.items.map((item) =>
          ctx.prisma.blogPost.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );

      return { success: true };
    }),

  /**
   * Generiše slug iz naslova
   */
  generateSlug: adminProcedure
    .input(generateSlugSchema)
    .mutation(async ({ ctx, input }) => {
      const baseSlug = generateSlugFromTitle(input.title);

      let slug = baseSlug;
      let counter = 1;

      while (await ctx.prisma.blogPost.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      return { slug };
    }),

  // ============================================
  // FILE UPLOADS
  // ============================================

  /**
   * Generiše presigned URL za upload featured slike
   */
  getFeaturedImageUploadUrl: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const key = generateFileKey('blog', input.fileName);
      const uploadUrl = await getPresignedUploadUrl(key);

      const endpoint = process.env.MINIO_ENDPOINT;
      const port = process.env.MINIO_PORT || '9000';
      const bucket = process.env.MINIO_BUCKET || 'dental-clinic';
      const useSSL = process.env.MINIO_USE_SSL === 'true';
      const protocol = useSSL ? 'https' : 'http';

      const publicUrl = `${protocol}://${endpoint}:${port}/${bucket}/${key}`;

      return {
        uploadUrl,
        publicUrl,
        key,
      };
    }),
});
