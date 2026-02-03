'use client';

import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';

import { BlogArticle } from './blog-article';

export default function BlogSection() {
  const trpc = useTRPC();

  const { data: posts } = useSuspenseQuery(
    trpc.blog.getPublishedPosts.queryOptions({ limit: 3 })
  );

  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-16">
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-(--primary-light) text-primary text-sm font-medium mb-4">
              Blog
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
              Najnoviji članci
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog">
              Svi članci
              <BookOpen className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <BlogArticle posts={posts} />
      </div>
    </section>
  );
}
