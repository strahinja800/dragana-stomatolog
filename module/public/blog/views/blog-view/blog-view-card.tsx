import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { format } from 'date-fns';
import { enUS,sr } from 'date-fns/locale';

import { BookOpen, ChevronRight } from '@/constants/icons';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

interface BlogViewCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    imageAlt: string | null;
    publishedAt: Date | null;
    createdAt: Date;
  };
}

export default function BlogViewCard({ post }: BlogViewCardProps) {
  const t = useTranslations('home.blog');
  const locale = useLocale();
  const dateLocale = locale === 'sr' ? sr : enUS;

  return (
    <article className="section-shell group overflow-hidden transition-smooth hover:-translate-y-1 hover:shadow-hover-blue">
      <div className="aspect-16/10 overflow-hidden bg-muted">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.imageAlt ?? stripHtml(post.title)}
            width={600}
            height={375}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="p-6">
        <span className="text-sm text-muted-foreground">
          {format(post.publishedAt ?? post.createdAt, 'd. MMMM yyyy.', {
            locale: dateLocale,
          })}
        </span>

        <h3 className="mt-2 mb-3 line-clamp-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
          {stripHtml(post.title)}
        </h3>

        {post.excerpt && (
          <p className="mb-4 line-clamp-3 text-base text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm font-semibold text-primary transition-all hover:gap-2"
        >
          {t('readMore')}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
