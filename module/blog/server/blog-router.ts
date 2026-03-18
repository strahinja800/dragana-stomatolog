import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  BUCKET_NAME,
  deleteFile,
  generateFileKey,
  getPublicFileUrl,
  uploadFile,
} from '@/lib/minio';
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

async function uploadFeaturedImage(file: {
  fileBase64: string;
  fileName: string;
  fileType: string;
}): Promise<string> {
  const key = generateFileKey('blog', file.fileName);
  const buffer = Buffer.from(file.fileBase64, 'base64');
  await uploadFile(key, buffer, file.fileType);

  return getPublicFileUrl(key);
}

function extractFileKeyFromUrl(fileUrl: string): string {
  const url = new URL(fileUrl);
  const path = url.pathname.slice(1);
  if (path.startsWith(`${BUCKET_NAME}/`)) {
    return path.slice(BUCKET_NAME.length + 1);
  }
  return path;
}

async function deleteFeaturedImage(imageUrl: string): Promise<void> {
  try {
    const key = extractFileKeyFromUrl(imageUrl);
    await deleteFile(key);
  } catch {
    console.error('Failed to delete featured image from storage');
  }
}

export const blogRouter = createTRPCRouter({
  // ============================================
  // PUBLIC PROCEDURES
  // ============================================

  /**
   * Vraća sve objavljene blog postove (public)
   */
  getPublishedPosts: publicProcedure
    .input(
      z.object({ limit: z.number().int().positive().optional() }).optional()
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        ...(input?.limit && { take: input.limit }),
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

      let featuredImage: string | null = null;
      if (input.featuredImageFile) {
        featuredImage = await uploadFeaturedImage(input.featuredImageFile);
      }

      const post = await ctx.prisma.blogPost.create({
        data: {
          title: input.title.trim(),
          slug: input.slug.trim(),
          content: input.content,
          featuredImage,
          imageAlt: input.imageAlt?.trim() || null,
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
      const { id, featuredImageFile, removeFeaturedImage, ...data } = input;

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

      const currentPost = await ctx.prisma.blogPost.findUnique({
        where: { id },
        select: { featuredImage: true, publishedAt: true },
      });

      let publishedAt = data.publishedAt;
      if (
        data.status === 'PUBLISHED' &&
        currentPost &&
        !currentPost.publishedAt &&
        !publishedAt
      ) {
        publishedAt = new Date();
      }

      let featuredImage: string | null | undefined = undefined;

      if (featuredImageFile) {
        if (currentPost?.featuredImage) {
          await deleteFeaturedImage(currentPost.featuredImage);
        }
        featuredImage = await uploadFeaturedImage(featuredImageFile);
      } else if (removeFeaturedImage) {
        if (currentPost?.featuredImage) {
          await deleteFeaturedImage(currentPost.featuredImage);
        }
        featuredImage = null;
      }

      const post = await ctx.prisma.blogPost.update({
        where: { id },
        data: {
          title: data.title?.trim(),
          slug: data.slug?.trim(),
          content: data.content,
          excerpt:
            data.excerpt !== undefined
              ? data.excerpt?.trim() || null
              : undefined,
          featuredImage,
          imageAlt:
            data.imageAlt !== undefined
              ? data.imageAlt?.trim() || null
              : undefined,
          status: data.status,
          publishedAt,
          sortOrder: data.sortOrder,
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
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id: input.id },
        select: { featuredImage: true },
      });

      if (post?.featuredImage) {
        await deleteFeaturedImage(post.featuredImage);
      }

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

  //  Published posts count for dashboard
  getPublishedCount: adminProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.blogPost.count({
      where: { status: 'PUBLISHED' },
    });
    return { published: count };
  }),

  //  Draft posts count for dashboard
  getDraftCount: adminProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.blogPost.count({
      where: {
        status: 'DRAFT',
      },
    });
    return { drafts: count };
  }),
});
