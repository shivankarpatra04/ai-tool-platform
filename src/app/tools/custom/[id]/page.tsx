'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ToolRunner, { type RunnerTool } from '@/components/ui/ToolRunner';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useCustomTool, deleteCustomTool, type CustomTool } from '@/lib/customTools';
import { getToolIcon } from '@/lib/iconRegistry';
import { ArrowLeftIcon, WriteIcon, TrashIcon, SparklesIcon } from '@/components/ui/icons';

/** Map a stored CustomTool into the shape ToolRunner expects. */
function toRunnerTool(tool: CustomTool): RunnerTool {
  return {
    name: tool.name,
    description: tool.description,
    Icon: getToolIcon(tool.iconKey),
    gradient: tool.gradient,
    systemPrompt: tool.systemPrompt,
    fields: tool.fields.map((f) => ({
      name: f.id,
      label: f.label,
      type: f.type,
      placeholder: f.placeholder,
      optional: f.optional,
    })),
    temperature: tool.temperature,
    maxTokens: tool.maxTokens,
  };
}

export default function CustomToolPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? '');
  const { tool, mounted } = useCustomTool(id);

  // Before hydration we don't know what's in localStorage — show a light shell.
  if (!mounted) {
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

  if (!tool) {
    return (
      <div className="app-shell">
        <main className="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-4 px-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand-strong dark:text-brand">
            <SparklesIcon className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-bold">Tool not found</h1>
          <p className="max-w-sm text-sm text-muted">
            This custom tool doesn&apos;t exist in this browser. Custom tools are saved locally, so
            they won&apos;t appear on a different device or after clearing site data.
          </p>
          <div className="flex gap-2">
            <Link href="/" className="btn-secondary">
              <ArrowLeftIcon className="h-4 w-4" />
              All tools
            </Link>
            <Link href="/tools/new" className="btn-primary">
              Create a tool
            </Link>
          </div>
          <ThemeToggle />
        </main>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${tool.name}"? This can't be undone.`)) {
      deleteCustomTool(tool.id);
      router.push('/');
    }
  };

  return (
    <ToolRunner
      tool={toRunnerTool(tool)}
      actions={
        <>
          <span className="pill-brand">Your tool</span>
          <Link href={`/tools/new?id=${tool.id}`} className="btn-secondary">
            <WriteIcon className="h-4 w-4" />
            Edit
          </Link>
          <button type="button" onClick={handleDelete} className="btn-ghost text-red-600 dark:text-red-400">
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </>
      }
    />
  );
}
