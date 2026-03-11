import Image from 'next/image';
import Link from 'next/link';

import { format } from 'date-fns';
import { sr } from 'date-fns/locale';

import { ArrowLeft } from '@/constants/icons';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

interface BlogPostViewHeroProps {
  post: {
    title: string;
    excerpt: string | null;
    featuredImage: string | null;
    imageAlt: string | null;
    publishedAt: Date | null;
    createdAt: Date;
  };
}

export default function BlogPostViewHero({ post }: BlogPostViewHeroProps) {
  return (
    <section className="gradient-hero pt-34 pb-16 md:pt-40 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Nazad na blog
          </Link>

          <p className="mt-4 text-sm text-muted-foreground">
            {format(post.publishedAt ?? post.createdAt, 'EEEE, d. MMMM yyyy.', {
              locale: sr,
            })}
          </p>

          <h1
            className="mt-5 text-3xl font-bold text-foreground md:text-5xl"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />

          {post.excerpt && (
            <p className="mt-5 text-lg text-muted-foreground">{post.excerpt}</p>
          )}
        </div>

        {post.featuredImage && (
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-border/60 shadow-card">
            <Image
              src={post.featuredImage}
              alt={post.imageAlt ?? stripHtml(post.title)}
              width={1200}
              height={630}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
