'use client';

import { useQuery } from 'convex/react';
import { File, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { type Doc } from '@/convex/_generated/dataModel';

interface AttachmentRowProps {
  attachment: Doc<'attachments'>;
  onDelete: () => void;
}

export function AttachmentRow({ attachment, onDelete }: AttachmentRowProps) {
  const url = useQuery(api.files.getFileUrl, {
    storageId: attachment.storageId,
  });

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-md border p-2">
          <File className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-medium">
            {attachment.fileName}
          </div>
          <div className="text-xs text-muted-foreground">
            {attachment.fileType}
            {attachment.fileSize
              ? ` • ${(attachment.fileSize / 1024).toFixed(0)} KB`
              : ''}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={!url}>
          <a href={url ?? '#'} target="_blank" rel="noreferrer">
            Otvori
          </a>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
