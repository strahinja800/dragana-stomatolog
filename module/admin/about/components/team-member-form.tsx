'use client';

import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/trpc/client';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface TeamMemberFormProps {
  open: boolean;
  onClose: () => void;
  member?: TeamMember;
}

interface FormData {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  imageAlt: string;
  sortOrder: number;
  isActive: boolean;
}

export function TeamMemberForm({ open, onClose, member }: TeamMemberFormProps) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    member?.imageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    defaultValues: {
      name: member?.name || '',
      role: member?.role || '',
      specialty: member?.specialty || '',
      bio: member?.bio || '',
      imageAlt: member?.imageAlt || '',
      sortOrder: member?.sortOrder || 1,
      isActive: member?.isActive ?? true,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  const handleReset = () => {
    reset();
    setUploadedImageUrl(null);
    onClose();
  };

  const { mutate: createMember, isPending: isCreating } = useMutation(
    trpc.about.createTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['about'] });
        toast.success('Član tima uspešno kreiran');
        handleReset();
      },
      onError: (error) => {
        toast.error('Greška pri kreiranju člana tima');
        console.error(error);
      },
    })
  );

  const { mutate: updateMember, isPending: isUpdating } = useMutation(
    trpc.about.updateTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['about'] });
        toast.success('Član tima uspešno ažuriran');
        handleReset();
      },
      onError: (error) => {
        toast.error('Greška pri ažuriranju člana tima');
        console.error(error);
      },
    })
  );

  const { mutateAsync: getUploadUrl } = useMutation(
    trpc.about.getTeamMemberImageUploadUrl.mutationOptions()
  );

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = (data: FormData) => {
    if (member) {
      updateMember({
        id: member.id,
        name: data.name,
        role: data.role,
        specialty: data.specialty || undefined,
        bio: data.bio || undefined,
        imageUrl: uploadedImageUrl || undefined,
        imageAlt: data.imageAlt || undefined,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    } else {
      createMember({
        name: data.name,
        role: data.role,
        specialty: data.specialty || undefined,
        bio: data.bio || undefined,
        imageUrl: uploadedImageUrl || undefined,
        imageAlt: data.imageAlt || undefined,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Molimo izaberite sliku');
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
      toast.success('Slika uspešno uploadovana');
    } catch (error) {
      toast.error('Greška pri uploadu slike');
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {member ? 'Izmeni člana tima' : 'Dodaj novog člana tima'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ime i prezime</Label>
              <Input
                id="name"
                {...register('name', { required: 'Ime je obavezno' })}
                placeholder="Dr. Ana Jovanović"
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Pozicija</Label>
              <Input
                id="role"
                {...register('role', { required: 'Pozicija je obavezna' })}
                placeholder="Glavni stomatolog"
              />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">
                Specijalizacija{' '}
                <span className="text-xs text-muted-foreground">(opciono)</span>
              </Label>
              <Input
                id="specialty"
                {...register('specialty')}
                placeholder="Estetska stomatologija"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                Biografija{' '}
                <span className="text-xs text-muted-foreground">(opciono)</span>
              </Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Sa preko 12 godina iskustva..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Slika</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageAlt">
                Alt tekst slike{' '}
                <span className="text-xs text-muted-foreground">(opciono)</span>
              </Label>
              <Input
                id="imageAlt"
                {...register('imageAlt')}
                placeholder="Fotografija dr Ane Jovanović"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Redosled</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register('sortOrder', {
                  required: 'Redosled je obavezan',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Minimum je 1' },
                })}
                placeholder="1"
              />
              {errors.sortOrder && (
                <p className="text-sm text-destructive">
                  {errors.sortOrder.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <>
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      Aktivan član tima
                    </Label>
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Otkaži
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Čuvanje...' : member ? 'Ažuriraj' : 'Kreiraj'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
