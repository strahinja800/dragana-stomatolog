'use client';

import { ImageIcon } from 'lucide-react';

import Tiptap from '@/components/TipTap';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  // TODO: Dodaj logiku - useForm, mutations, etc.

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Izmeni članak' : 'Novi članak'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-6 max-w-4xl">
          {/* Naslov */}
          <div className="space-y-2 max-w-3xl">
            <Label htmlFor="title">Naslov *</Label>
            <Tiptap
              placeholder="Unesite naslov članka..."
              className="h-28 py-2"
              toolbarPreset="minimal"
            />
          </div>

          {/* Sadržaj - TipTap Editor placeholder */}
          <div className="space-y-2 max-w-3xl">
            <Label>Sadržaj *</Label>
            <div className="border rounded-md">
              <Tiptap
                placeholder="Zapocnite pisanje..."
                className="min-h-[300px]"
                toolbarPreset="full"
              />
            </div>
          </div>

          {/* Naslovna slika */}
          <div className="space-y-2 max-w-3xl">
            <Label>Naslovna slika</Label>

            {/* TODO: Uslovno renderovanje - ovo je kada NEMA slike */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-32 border-dashed"
            >
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Klikni za upload slike
                </span>
              </div>
            </Button>

            {/* TODO: Ovo je kada IMA sliku - uslovno renderovanje
            <div className="space-y-2">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src={uploadedImageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Promeni sliku
                </Button>
                <Button type="button" variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Ukloni sliku
                </Button>
              </div>
            </div>
            */}
          </div>

          {/* Alt tekst slike */}
          <div className="space-y-2 max-w-3xl">
            <Label htmlFor="imageAlt">
              Alt tekst slike{' '}
              <span className="text-xs text-muted-foreground">(opciono)</span>
            </Label>
            <Input
              id="imageAlt"
              placeholder="Žena pere zube ispravnom tehnikom"
            />
          </div>

          {/* Status */}
          <div className="space-y-2 max-w-3xl">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="DRAFT">
              <SelectTrigger>
                <SelectValue placeholder="Izaberi status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Objavljen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t max-w-3xl">
            <Button type="button" variant="outline" onClick={onClose}>
              Otkaži
            </Button>
            <Button type="submit">{post ? 'Ažuriraj' : 'Sačuvaj'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
