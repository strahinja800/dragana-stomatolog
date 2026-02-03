'use client';

import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import Tiptap from '@/components/TipTap';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type BlogPostFormInput,
  blogPostFormSchema,
} from '@/module/blog/types/blog-schemas';
import { useTRPC } from '@/trpc/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  featuredImage?: string | null;
  imageAlt?: string | null;
  publishedAt?: Date | null;
}

interface BlogPostFormProps {
  open: boolean;
  onClose: () => void;
  post?: BlogPost;
}

export function BlogPostForm({ open, onClose, post }: BlogPostFormProps) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    post?.featuredImage || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues = {
    title: post?.title ?? '',
    content: post?.content ?? '',
    status: post?.status ?? 'DRAFT',
    imageAlt: post?.imageAlt ?? '',
  };

  const { handleSubmit, control, reset } = useForm<BlogPostFormInput>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues,
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleClose = () => {
    reset(defaultValues);
    setUploadedImageUrl(post?.featuredImage || null);
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

  const { mutateAsync: getUploadUrl } = useMutation(
    trpc.blog.getFeaturedImageUploadUrl.mutationOptions()
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Molimo izaberite sliku.');
      return;
    }

    try {
      setIsUploading(true);

      const { uploadUrl, publicUrl } = await getUploadUrl({
        fileName: file.name,
        fileType: file.type,
      });

      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!res.ok) throw new Error('Upload nije uspeo');

      setUploadedImageUrl(publicUrl);
      toast.success('Slika uspešno uploadovana.');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Greška pri uploadu slike.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: BlogPostFormInput) => {
    let slug = post?.slug ?? '';

    if (!post) {
      try {
        const result = await generateSlug({ title: data.title });
        slug = result.slug;
      } catch {
        toast.error('Došlo je do greške prilikom generisanja slug-a.');
        return;
      }
    }

    const submitData = {
      ...data,
      slug,
      featuredImage: uploadedImageUrl,
      imageAlt: data.imageAlt || undefined,
    };

    if (!post) {
      createPost(submitData);
    } else {
      updatePost({ id: post.id, ...submitData });
    }
  };

  const isPending = isCreating || isUpdating || isGeneratingSlug || isUploading;

  return (
    <Drawer open={open} onOpenChange={handleClose} direction="right">
      <DrawerContent className="h-screen data-[vaul-drawer-direction=right]:sm:max-w-3xl">
        <div className="mx-auto h-full w-full overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{post ? 'Izmeni članak' : 'Novi članak'}</DrawerTitle>
            <DrawerDescription>
              {post
                ? 'Izmenite podatke postojećeg članka.'
                : 'Popunite formu za kreiranje novog članka.'}
            </DrawerDescription>
          </DrawerHeader>

          <form
            id="blog-post-form"
            className="px-4 pb-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FieldGroup>
              {/* Naslov */}
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Naslov *</FieldLabel>
                    <Tiptap
                      placeholder="Unesite naslov članka..."
                      className="h-28 py-2"
                      toolbarPreset="minimal"
                      content={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Sadržaj */}
              <Controller
                name="content"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Sadržaj *</FieldLabel>
                    <Tiptap
                      placeholder="Zapocnite pisanje..."
                      className="min-h-[300px]"
                      toolbarPreset="full"
                      content={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Istaknuta slika */}
              <Field>
                <FieldLabel>Istaknuta slika</FieldLabel>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {uploadedImageUrl ? (
                  <div className="space-y-2">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={uploadedImageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Promeni sliku
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Ukloni sliku
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-32 border-dashed"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {isUploading
                          ? 'Uploadovanje...'
                          : 'Klikni za upload slike'}
                      </span>
                    </div>
                  </Button>
                )}
              </Field>

              {/* Alt tekst slike */}
              <Controller
                name="imageAlt"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Alt tekst slike{' '}
                      <span className="text-xs text-muted-foreground">
                        (opciono)
                      </span>
                    </FieldLabel>
                    <Input
                      placeholder="Opis slike za pristupačnost..."
                      {...field}
                      value={field.value ?? ''}
                    />
                  </Field>
                )}
              />

              {/* Status */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberi status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Objavljen</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DrawerFooter>
            <Button type="submit" form="blog-post-form" disabled={isPending}>
              {post ? 'Ažuriraj' : 'Sačuvaj'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Otkaži</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
