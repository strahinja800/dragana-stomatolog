import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

interface BlogPost {
  image: StaticImageData;
  title: string;
  category: string;
  date: string;
  excerpt: string;
}

interface Props {
  post: BlogPost[];
}

export function BlogArticle({ post }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {post.map((post, index) => (
        <article
          key={index}
          className="group rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
        >
          <div className="aspect-16/10 overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[rgb(217,241,252)] text-[rgb(13,162,231)] text-xs font-medium">
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground">{post.date}</span>
            </div>
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-2 group-hover:text-[rgb(13,162,231)] transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-base leading-7 mb-4">
              {post.excerpt}
            </p>
            <Link
              href="/blog"
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
