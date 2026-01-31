'use client';

import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { BlogPostForm } from '@/module/admin/blog/components/blog-posts-form/blog-posts-form';
import { BlogPostsTable } from '@/module/admin/blog/components/blog-posts-table/blog-posts-table';
import type { BlogPostRow } from '@/module/admin/blog/components/blog-posts-table/blog-posts-table-columns';
import { useTRPC } from '@/trpc/client';

export default function BlogAdminView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<BlogPostRow | undefined>();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const { data: posts = [] } = useQuery(trpc.blog.getAllPosts.queryOptions());

  const deletePostMutation = useMutation(
    trpc.blog.deletePost.mutationOptions({
      onSuccess: () => {
        setPostToDelete(null);
        queryClient.invalidateQueries({ queryKey: [['blog']] });
        toast.success('Članak je uspešno obrisan.');
      },
      onError: () => {
        toast.error('Došlo je do greške prilikom brisanja članka.');
      },
    })
  );

  const handleEdit = (post: BlogPostRow) => {
    setPostToEdit(post);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setPostToEdit(undefined);
  };

  const confirmDelete = () => {
    if (!postToDelete) return;
    deletePostMutation.mutate({ id: postToDelete });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="mt-1 text-muted-foreground">
            Pregled i upravljanje blog člancima.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novi članak
        </Button>
      </div>

      <BlogPostsTable
        data={posts}
        onEditPost={handleEdit}
        onDeletePost={setPostToDelete}
      />

      <BlogPostForm
        open={formOpen}
        onClose={handleFormClose}
        post={postToEdit}
      />

      <ConfirmDialog
        open={!!postToDelete}
        onOpenChange={(open) => !open && setPostToDelete(null)}
        onConfirm={confirmDelete}
        title="Potvrda brisanja"
        description="Da li ste sigurni da želite da obrišete ovaj članak? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        variant="destructive"
      />
    </div>
  );
}
