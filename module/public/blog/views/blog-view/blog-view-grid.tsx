import { BookOpen } from '@/constants/icons';

import BlogViewCard from './blog-view-card';

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

interface BlogViewGridProps {
  posts: BlogPost[];
}

export default function BlogViewGrid({ posts }: BlogViewGridProps) {
  if (posts.length === 0) {
    return (
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
          <h2 className="mb-2 text-2xl font-semibold text-foreground">
            Nema objavljenih članaka
          </h2>
          <p className="text-muted-foreground">
            Uskoro ćemo objaviti nove članke. Pratite nas!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogViewCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
