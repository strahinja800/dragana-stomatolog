'use client';

import { BlogPostForm } from '@/module/admin/blog/components/blog-posts-form/blog-posts-form';

export default function BlogAdminView() {
  return <BlogPostForm open={true} onClose={() => {}} />;
}
