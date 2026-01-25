import { LoadingFallback } from '@/components/shared/loading-fallback';

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingFallback />
    </div>
  );
}
