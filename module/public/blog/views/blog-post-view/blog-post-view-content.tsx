interface BlogPostViewContentProps {
  content: string;
}

export default function BlogPostViewContent({
  content,
}: BlogPostViewContentProps) {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <article
          className="prose prose-lg mx-auto max-w-4xl prose-headings:font-heading prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
