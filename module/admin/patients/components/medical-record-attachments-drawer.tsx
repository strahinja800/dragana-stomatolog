'use client';

import { useRef, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Paperclip, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useTRPC } from '@/trpc/client';

import { AttachmentRow } from './attachment-row';

interface Props {
  medicalRecordId: string;
  triggerLabel?: string;
}

export function MedicalRecordAttachmentsDrawer({
  medicalRecordId,
  triggerLabel = 'Fajlovi',
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: attachments, isLoading } = useQuery(
    trpc.attachment.listByMedicalRecord.queryOptions({ medicalRecordId })
  );

  const { mutateAsync: getUploadUrl } = useMutation(
    trpc.upload.getUploadUrl.mutationOptions()
  );

  const { mutateAsync: createAttachment } = useMutation(
    trpc.attachment.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [['attachment', 'listByMedicalRecord']],
        });
      },
    })
  );

  const { mutate: deleteAttachment } = useMutation(
    trpc.attachment.delete.mutationOptions({
      onSuccess: () => {
        toast.success('Fajl je obrisan');
        queryClient.invalidateQueries({
          queryKey: [['attachment', 'listByMedicalRecord']],
        });
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Greška prilikom brisanja fajla';
        toast.error(message);
      },
    })
  );

  const onPickFile = () => inputRef.current?.click();

  const onUpload = async (file: File) => {
    try {
      setIsUploading(true);

      const { uploadUrl, fileUrl } = await getUploadUrl({
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        folder: 'attachments',
      });

      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });

      if (!res.ok) throw new Error('Upload nije uspeo');

      await createAttachment({
        medicalRecordId,
        fileUrl,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
      });

      toast.success('Fajl je uspešno dodat');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Greška prilikom uploada fajla';
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(file);
  };

  const onRemove = (attachmentId: string) => {
    deleteAttachment({ id: attachmentId });
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Paperclip className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Fajlovi za medical record</DrawerTitle>
            <DrawerDescription>
              Dodaj i pregledaj dokumenta (RTG, slike, PDF…).
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={onInputChange}
            />

            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                onClick={onPickFile}
                disabled={isUploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Upload...' : 'Dodaj fajl'}
              </Button>

              <DrawerClose asChild>
                <Button variant="ghost">Zatvori</Button>
              </DrawerClose>
            </div>

            <div className="mt-4 space-y-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Učitavanje...</p>
              ) : !attachments || attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Još uvek nema fajlova za ovaj record.
                </p>
              ) : (
                attachments.map((att) => (
                  <AttachmentRow
                    key={att.id}
                    attachment={att}
                    onDelete={() => onRemove(att.id)}
                  />
                ))
              )}
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Gotovo</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
