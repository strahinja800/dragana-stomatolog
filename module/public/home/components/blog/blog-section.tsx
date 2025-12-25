import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/data';

import { BlogArticle } from './blog-article';

export default function BlogSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-16">
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-[rgb(217,241,252)] text-[rgb(13,162,231)] text-sm font-medium mb-4">
              Blog
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
              Najnoviji članci
            </h2>
          </div>
          <Button
            variant="hero-outline"
            size="lg"
            asChild
            className="text-lg px-8 py-6 border-[rgb(13,162,231)] hover:bg-[rgb(13,162,231)] text-[rgb(13,162,231)] rounded-3xl"
          >
            <Link href="/blog">
              Svi članci
              <BookOpen className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <BlogArticle post={blogPosts} />
      </div>
    </section>
  );
}
