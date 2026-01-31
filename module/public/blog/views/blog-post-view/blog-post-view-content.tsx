interface BlogPostViewContentProps {
  content: string;
}

export default function BlogPostViewContent({
  content,
}: BlogPostViewContentProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <article
          className="prose prose-lg max-w-4xl mx-auto prose-headings:font-heading prose-a:text-[rgb(13,162,231)]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
