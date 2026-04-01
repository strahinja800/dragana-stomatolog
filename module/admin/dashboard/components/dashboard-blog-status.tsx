'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ExternalLink } from '@/constants/icons';
import { useTRPC } from '@/trpc/client';

export function DashboardBlogStatus() {
  const t = useTranslations('admin.dashboard');
  const trpc = useTRPC();
  const published = useSuspenseQuery(
    trpc.blog.getPublishedCount.queryOptions()
  );
  const drafts = useSuspenseQuery(trpc.blog.getDraftCount.queryOptions());

  return (
    <Card className="border-border/50 py-0 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="size-5 text-violet-500" />
            {t('blogStatus')}
          </span>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <Link href="/admin/blog" className="inline-flex items-center">
              <ExternalLink className="size-3.5" />
              <span>{t('manageBlog')}</span>
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-500/10 py-6">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {published.data.published}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              {t('published')}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-amber-500/10 py-6">
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {drafts.data.drafts}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              {t('drafts')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
