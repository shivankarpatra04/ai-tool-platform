import Link from 'next/link';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { ArrowLeftIcon } from '@/components/ui/icons';

interface ToolShellProps {
  title: string;
  subtitle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  gradient: string;
  children: ReactNode;
}

/**
 * Shared page chrome for every tool: sticky header with brand-back link,
 * gradient icon tile, title/subtitle, and a theme toggle. Wraps content in a
 * consistent, responsive container.
 */
export default function ToolShell({ title, subtitle, Icon, gradient, children }: ToolShellProps) {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${gradient}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold leading-tight text-foreground sm:text-xl">
                {title}
              </h1>
              <p className="truncate text-xs text-muted sm:text-sm">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-xl border border-border bg-background-elevated px-3.5 py-2 text-sm font-medium text-muted shadow-sm transition-colors hover:text-foreground hover:border-brand/40 sm:inline-flex"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              All tools
            </Link>
            <Link
              href="/"
              aria-label="Back to all tools"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background-elevated text-muted shadow-sm transition-colors hover:text-foreground hover:border-brand/40 sm:hidden"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
