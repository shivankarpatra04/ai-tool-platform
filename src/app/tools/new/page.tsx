import type { Metadata } from 'next';
import { Suspense } from 'react';
import ToolBuilder from '@/components/tools/ToolBuilder';
import { SparklesIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Create your own tool — AI Tools',
  description: 'Build a custom AI tool in seconds — no code required.',
};

function BuilderFallback() {
  return (
    <div className="app-shell">
      <main className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <SparklesIcon className="h-4 w-4 animate-pulse" />
          Loading…
        </div>
      </main>
    </div>
  );
}

export default function NewToolPage() {
  return (
    <Suspense fallback={<BuilderFallback />}>
      <ToolBuilder />
    </Suspense>
  );
}
