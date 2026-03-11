'use client';

import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { BookOpen } from '@/constants/icons';
import { useTRPC } from '@/trpc/client';

import { BlogArticle } from './blog-article';

export default function BlogSection() {
  const trpc = useTRPC();

  const { data: posts } = useSuspenseQuery(
    trpc.blog.getPublishedPosts.queryOptions({ limit: 3 })
  );

  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="section-kicker">Blog</span>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
              Najnoviji članci
            </h2>
          </div>
          <Button variant="outline" asChild className="rounded-full px-6">
            <Link href="/blog">
              Svi članci
              <BookOpen className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <BlogArticle posts={posts} />
      </div>
    </section>
  );
}
