import Image from 'next/image';
import Link from 'next/link';

import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { BookOpen, ChevronRight } from 'lucide-react';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  imageAlt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
}

interface Props {
  posts: BlogPost[];
}

export function BlogArticle({ posts }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
        >
          <div className="aspect-16/10 overflow-hidden bg-muted">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.imageAlt ?? stripHtml(post.title)}
                width={600}
                height={375}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
          <div className="p-6">
            <span className="text-sm text-muted-foreground">
              {format(post.publishedAt ?? post.createdAt, 'd. MMMM yyyy.', {
                locale: sr,
              })}
            </span>
            <h3 className="text-2xl font-heading font-semibold text-foreground mt-2 mb-2 line-clamp-2 group-hover:text-[rgb(13,162,231)] transition-colors">
              {stripHtml(post.title)}
            </h3>
            {post.excerpt && (
              <p className="text-muted-foreground text-base leading-7 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-[rgb(13,162,231)] font-medium text-sm hover:gap-2 transition-all"
            >
              Pročitaj više
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
