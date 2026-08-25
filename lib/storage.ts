import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const BUCKET_NAME = process.env.R2_BUCKET || 'dental-clinic';

let _s3Client: S3Client | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

function getS3Client(): S3Client {
  if (_s3Client) {
    return _s3Client;
  }

  const accountId = requireEnv('R2_ACCOUNT_ID');

  // R2 nema regione, ali S3 API zahteva da polje bude popunjeno.
  _s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
  });

  return _s3Client;
}

/**
 * Generiše presigned URL za upload direktno iz browsera.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expirySeconds = 3600
): Promise<string> {
  return getSignedUrl(
    getS3Client(),
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: expirySeconds }
  );
}

/**
 * Generiše presigned URL za download privatnog fajla.
 */
export async function getPresignedDownloadUrl(
  key: string,
  expirySeconds = 3600
): Promise<string> {
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }),
    { expiresIn: expirySeconds }
  );
}

/**
 * Uploaduje fajl sa servera.
 */
export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

/**
 * Briše fajl iz storage-a.
 */
export async function deleteFile(key: string): Promise<void> {
  await getS3Client().send(
    new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key })
  );
}

/**
 * Vraća javni URL za fajl.
 *
 * Javni pristup se na R2 podešava kroz custom domen ili r2.dev adresu,
 * pa u URL-u nema segmenta sa imenom bucket-a.
 */
export function getPublicFileUrl(key: string): string {
  return `${requireEnv('R2_PUBLIC_URL').replace(/\/$/, '')}/${key}`;
}

/**
 * Generiše unikatni key za fajl.
 */
export function generateFileKey(
  folder: string,
  fileName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const prefixPart = prefix ? `${prefix}-` : '';
  return `${folder}/${prefixPart}${timestamp}-${sanitizedFileName}`;
}
