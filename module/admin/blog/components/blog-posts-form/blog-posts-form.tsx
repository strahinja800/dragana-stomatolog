'use client';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import Tiptap from '@/components/TipTap';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type CreateBlogPostInput,
  createBlogPostSchema,
} from '@/module/blog/types/blog-schemas';
import { useTRPC } from '@/trpc/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  imageAlt?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: Date | null;
}

interface BlogPostFormProps {
  open: boolean;
  onClose: () => void;
  post?: BlogPost;
}

export function BlogPostForm({ open, onClose, post }: BlogPostFormProps) {
  const defaultValues = {
    title: post?.title ?? '',
    content: post?.content ?? '',
    status: post?.status ?? 'DRAFT',
    slug: post?.slug ?? '',
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateBlogPostInput>({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues,
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const { mutate: createPost, isPending: isCreating } = useMutation(
    trpc.blog.createPost.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['blog'] });
        toast.success('Članak je uspešno kreiran.');
        handleClose();
      },
      onError: () => {
        toast.error('Došlo je do greške prilikom kreiranja članka.');
      },
    })
  );

  const { mutate: updatePost, isPending: isUpdating } = useMutation(
    trpc.blog.updatePost.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['blog'] });
        toast.success('Članak je uspešno ažuriran.');
        handleClose();
      },
      onError: () => {
        toast.error('Došlo je do greške prilikom ažuriranja članka.');
      },
    })
  );

  const { mutateAsync: generateSlug, isPending: isGeneratingSlug } =
    useMutation(trpc.blog.generateSlug.mutationOptions());

  const onSubmit = async (data: CreateBlogPostInput) => {
    let slug = data.slug;

    if (!post) {
      try {
        const result = await generateSlug({ title: data.title });
        slug = result.slug;
      } catch (error) {
        toast.error('Došlo je do greške prilikom generisanja slug-a.');
        return;
      }
    }

    const submitData = { ...data, slug };

    if (!post) {
      createPost(submitData);
    } else {
      updatePost({ id: post.id, ...submitData });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Izmeni članak' : 'Novi članak'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-6 max-w-4xl" onSubmit={handleSubmit(onSubmit)}>
          {/* Naslov */}
          <div className="space-y-2 max-w-3xl">
            <Label htmlFor="title">Naslov *</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Tiptap
                  placeholder="Unesite naslov članka..."
                  className="h-28 py-2"
                  toolbarPreset="minimal"
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Sadržaj */}
          <div className="space-y-2 max-w-3xl">
            <Label>Sadržaj *</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Tiptap
                  placeholder="Zapocnite pisanje..."
                  className="min-h-[300px]"
                  toolbarPreset="full"
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <span className="text-red-500 text-sm">
                {errors.content.message}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2 max-w-3xl">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberi status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Objavljen</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t max-w-3xl">
            <Button type="button" variant="outline" onClick={onClose}>
              Otkaži
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating || isGeneratingSlug}
            >
              {post ? 'Ažuriraj' : 'Sačuvaj'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
