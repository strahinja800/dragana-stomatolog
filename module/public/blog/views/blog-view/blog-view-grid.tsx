import { BookOpen } from 'lucide-react';

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
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogViewCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
