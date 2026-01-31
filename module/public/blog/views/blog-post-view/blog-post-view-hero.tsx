import Image from 'next/image';
import Link from 'next/link';

import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

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
    <section className="py-24 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nazad na blog
            </Link>

            <span className="inline-block text-sm text-muted-foreground mb-4 ml-6">
              {format(
                post.publishedAt ?? post.createdAt,
                'EEEE, d. MMMM yyyy.',
                {
                  locale: sr,
                }
              )}
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />

          {post.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        {post.featuredImage && (
          <div className="max-w-5xl mx-auto mt-12">
            <Image
              src={post.featuredImage}
              alt={post.imageAlt ?? stripHtml(post.title)}
              width={1200}
              height={630}
              className="w-full rounded-2xl shadow-card object-cover"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
