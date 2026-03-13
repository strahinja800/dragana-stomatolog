'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, ExternalLink } from '@/constants/icons';

interface BlogStats {
  published: number;
  drafts: number;
}

const PLACEHOLDER_STATS: BlogStats = {
  published: 12,
  drafts: 3,
};

export function DashboardBlogStatus() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="size-5 text-violet-500" />
            Blog status
          </span>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="size-3.5" />
            Blog admin
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-500/10 py-6">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {PLACEHOLDER_STATS.published}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">Objavljeno</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-amber-500/10 py-6">
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {PLACEHOLDER_STATS.drafts}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">Nacrti</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
