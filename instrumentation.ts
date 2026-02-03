export async function onRequestError() {
  // Required by Next.js instrumentation API
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ensureBucketExists } = await import('@/lib/minio');
    await ensureBucketExists();
  }
}
