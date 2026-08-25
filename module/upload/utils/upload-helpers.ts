import { allowedUploadTypes } from '@/module/upload/types/upload-schemas';

/**
 * Vraća tip fajla samo ako je na listi dozvoljenih, inače undefined.
 * Sužavanje tipa je potrebno jer getUploadUrl prima enum, a ne bilo koji string.
 */
export function getAllowedUploadType(fileType: string) {
  return allowedUploadTypes.find((type) => type === fileType);
}

export function assertSuccessfulUpload(response: Response) {
  if (response.ok) {
    return;
  }

  // Status je ovde jedini trag, jer presigned upload ide direktno na storage
  // pa greška nikad ne prođe kroz nas. 403 obično znači neslaganje Content-Type.
  throw new Error(
    `Upload nije uspeo: HTTP ${response.status} ${response.statusText}`.trim()
  );
}

export function resetFileInput(input: HTMLInputElement | null) {
  if (!input) {
    return;
  }

  input.value = '';
}
