'use client';

import { useTranslations } from 'next-intl';

import { useSuspenseQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { Plus } from '@/constants/icons';
import { BlogPostForm } from '@/module/admin/blog/components/blog-posts-form/blog-posts-form';
import { BlogPostsTable } from '@/module/admin/blog/components/blog-posts-table/blog-posts-table';
import type { BlogPostRow } from '@/module/admin/blog/components/blog-posts-table/blog-posts-table-columns';
import { useTRPC } from '@/trpc/client';

export default function BlogAdminView() {
  const t = useTranslations('admin.blog');
  const trpc = useTRPC();

  const [blogPostId, setBlogPostId] = useQueryState(
    'blogPostId',
    parseAsString
  );

  const { data: posts = [] } = useSuspenseQuery(
    trpc.blog.getAllPosts.queryOptions()
  );

  const handleEdit = (post: BlogPostRow) => {
    setBlogPostId(post.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('description')}</p>
        </div>
        <Button onClick={() => setBlogPostId('new')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('newPost')}
        </Button>
      </div>

      <BlogPostsTable data={posts} onEditPost={handleEdit} />

      <BlogPostForm
        blogPostId={blogPostId}
        onClose={() => setBlogPostId(null)}
      />
    </div>
  );
}
