'use client';

import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
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
import { ImageIcon, Loader2, Trash2, Upload } from '@/constants/icons';
import {
  type BlogPostFormInput,
  blogPostFormSchema,
} from '@/module/blog/types/blog-schemas';
import { useTRPC } from '@/trpc/client';

interface BlogPostFormProps {
  blogPostId: string | null;
  onClose: () => void;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const emptyDefaults: BlogPostFormInput = {
  title: '',
  content: '',
  status: 'DRAFT',
  imageAlt: '',
  featuredImageFile: undefined,
};

export function BlogPostForm({ blogPostId, onClose }: BlogPostFormProps) {
  const isOpen = blogPostId !== null;
  const isEditMode = blogPostId !== null && blogPostId !== 'new';

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removingImage, setRemovingImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: post, isLoading: isLoadingPost } = useQuery({
    ...trpc.blog.getPostById.queryOptions({ id: blogPostId! }),
    enabled: isEditMode,
  });

  const { handleSubmit, control, reset, setValue } = useForm<BlogPostFormInput>(
    {
      resolver: zodResolver(blogPostFormSchema),
      defaultValues: emptyDefaults,
    }
  );

  useEffect(() => {
    if (isEditMode && post) {
      reset({
        title: post.title,
        content: post.content,
        status: post.status,
        imageAlt: post.imageAlt ?? '',
        featuredImageFile: undefined,
      });
      setPreviewUrl(post.featuredImage || null);
    } else if (blogPostId === 'new') {
      reset(emptyDefaults);
      setPreviewUrl(null);
    }
  }, [blogPostId, post, isEditMode, reset]);

  const handleClose = () => {
    reset(emptyDefaults);
    setPreviewUrl(null);
    setRemovingImage(false);
    onClose();
  };

  const queryKeyForAllPosts = trpc.blog.getAllPosts.queryKey();
  const queryKeyForPost = trpc.blog.getPostById.queryKey();

  const { mutate: createPost, isPending: isCreating } = useMutation(
    trpc.blog.createPost.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeyForAllPosts });
        queryClient.invalidateQueries({ queryKey: queryKeyForPost });
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
        queryClient.invalidateQueries({ queryKey: queryKeyForPost });
        queryClient.invalidateQueries({ queryKey: queryKeyForAllPosts });
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

  const { mutate: deletePost, isPending: isDeleting } = useMutation(
    trpc.blog.deletePost.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeyForAllPosts });
        queryClient.invalidateQueries({ queryKey: queryKeyForPost });
        toast.success('Blog post je uspešno obrisan.');
        setShowDeleteConfirm(false);
        handleClose();
      },
      onError: () => {
        toast.error('Došlo je do greške prilikom brisanja blog posta.');
      },
    })
  );

  const handleDelete = () => {
    if (!blogPostId || blogPostId === 'new') return;
    deletePost({ id: blogPostId });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Molimo izaberite sliku.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setValue('featuredImageFile', {
        fileBase64: base64,
        fileName: file.name,
        fileType: file.type,
      });
      setPreviewUrl(URL.createObjectURL(file));
      setRemovingImage(false);
    } catch {
      toast.error('Greška pri čitanju fajla.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setValue('featuredImageFile', undefined);
    setPreviewUrl(null);
    setRemovingImage(true);
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

    const { featuredImageFile, ...rest } = data;

    if (!post) {
      createPost({
        ...rest,
        slug,
        imageAlt: rest.imageAlt || undefined,
        featuredImageFile: featuredImageFile || undefined,
      });
    } else {
      updatePost({
        id: post.id,
        ...rest,
        slug,
        imageAlt: rest.imageAlt || undefined,
        featuredImageFile: featuredImageFile || undefined,
        removeFeaturedImage: removingImage,
      });
    }
  };

  const isPending = isCreating || isUpdating || isGeneratingSlug || isDeleting;

  return (
    <>
      <Drawer open={isOpen} onOpenChange={handleClose} direction="right">
        <DrawerContent className="h-screen data-[vaul-drawer-direction=right]:sm:max-w-3xl">
          <div className="flex h-full w-full flex-col">
            <div className="flex-1 overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>
                  {isEditMode ? 'Izmeni članak' : 'Novi članak'}
                </DrawerTitle>
                <DrawerDescription>
                  {isEditMode
                    ? 'Izmenite podatke postojećeg članka.'
                    : 'Popunite formu za kreiranje novog članka.'}
                </DrawerDescription>
              </DrawerHeader>

              {isEditMode && isLoadingPost ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
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
                        onChange={handleImageSelect}
                        className="hidden"
                      />

                      {previewUrl ? (
                        <div className="group relative w-full h-48 rounded-lg overflow-hidden border border-border">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Zameni
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleRemoveImage}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Ukloni
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full flex-col items-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center transition-colors hover:border-muted-foreground/50 hover:bg-muted/50"
                        >
                          <div className="rounded-full bg-muted p-3">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Dodaj istaknutu sliku
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              PNG, JPG ili WebP
                            </p>
                          </div>
                        </button>
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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Izaberi status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="PUBLISHED">
                                Objavljen
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </form>
              )}
            </div>

            <DrawerFooter className="border-t pt-4">
              <div className="flex items-center justify-between gap-2">
                {isEditMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isPending}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Obriši
                  </Button>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Otkaži</Button>
                  </DrawerClose>
                  <Button
                    type="submit"
                    form="blog-post-form"
                    disabled={isPending || (isEditMode && isLoadingPost)}
                  >
                    {isEditMode ? 'Ažuriraj' : 'Sačuvaj'}
                  </Button>
                </div>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Potvrda brisanja"
        description="Da li ste sigurni da želite da obrišete ovaj blog post? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        variant="destructive"
      />
    </>
  );
}
