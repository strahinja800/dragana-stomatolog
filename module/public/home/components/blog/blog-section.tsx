import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/data";
import { BookOpen, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
          <Button variant="hero-outline" size="lg" asChild className="text-lg px-8 py-6 border-[rgb(13,162,231)] hover:bg-[rgb(13,162,231)] text-[rgb(13,162,231)] rounded-3xl">
            <Link href="/blog">
              Svi članci
              <BookOpen className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
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
      </div>
    </section>
  );
}
