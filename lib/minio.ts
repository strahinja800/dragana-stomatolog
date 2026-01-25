import { Client } from 'minio';

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'dental-clinic';

let _minioClient: Client | null = null;

function getMinioClient(): Client {
  if (_minioClient) {
    return _minioClient;
  }

  if (!process.env.MINIO_ENDPOINT) {
    throw new Error('MINIO_ENDPOINT is not defined');
  }

  if (!process.env.MINIO_ACCESS_KEY) {
    throw new Error('MINIO_ACCESS_KEY is not defined');
  }

  if (!process.env.MINIO_SECRET_KEY) {
    throw new Error('MINIO_SECRET_KEY is not defined');
  }

  _minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });

  return _minioClient;
}

// Keep for backwards compatibility but lazy-initialize
export const minioClient = {
  get client() {
    return getMinioClient();
  },
};

/**
 * Inicijalizuje bucket ako ne postoji
 */
export async function ensureBucketExists() {
  const client = getMinioClient();
  const exists = await client.bucketExists(BUCKET_NAME);
  if (!exists) {
    await client.makeBucket(BUCKET_NAME);
  }
}

/**
 * Generiše presigned URL za upload
 */
export async function getPresignedUploadUrl(
  key: string,
  expirySeconds = 3600
): Promise<string> {
  const client = getMinioClient();
  return client.presignedPutObject(BUCKET_NAME, key, expirySeconds);
}

/**
 * Generiše presigned URL za download
 */
export async function getPresignedDownloadUrl(
  key: string,
  expirySeconds = 3600
): Promise<string> {
  const client = getMinioClient();
  return client.presignedGetObject(BUCKET_NAME, key, expirySeconds);
}

/**
 * Briše fajl iz storage-a
 */
export async function deleteFile(key: string): Promise<void> {
  const client = getMinioClient();
  await client.removeObject(BUCKET_NAME, key);
}

/**
 * Generiše unikatni key za fajl
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
