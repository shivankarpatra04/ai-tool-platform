'use client';

import Link from 'next/link';
import { useCustomTools } from '@/lib/customTools';
import { getToolIcon } from '@/lib/iconRegistry';
import { ArrowRightIcon, PlusIcon } from '@/components/ui/icons';

/**
 * Homepage section listing the user's locally-saved custom tools. Renders
 * nothing until mounted (localStorage is client-only) and stays hidden when
 * the user has no custom tools yet — the "Create" banner covers that case.
 */
export default function MyToolsSection() {
  const { tools, mounted } = useCustomTools();

  if (!mounted || tools.length === 0) return null;

  return (
    <section className="pb-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight">Your tools</h2>
        <Link href="/tools/new" className="btn-secondary">
          <PlusIcon className="h-4 w-4" />
          New tool
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = getToolIcon(tool.iconKey);
          return (
            <Link
              key={tool.id}
              href={`/tools/custom/${tool.id}`}
              className="card card-hover group flex flex-col gap-4 p-6"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-200 group-hover:scale-105 ${tool.gradient}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{tool.description}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-strong dark:text-brand">
                Open tool
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
