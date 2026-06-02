'use client';

import Link from 'next/link';
import ToolRunner from '@/components/ui/ToolRunner';
import { WriteIcon } from '@/components/ui/icons';
import { toolConfigs } from '@/lib/toolConfigs';

/**
 * Client wrapper for built-in tools: resolves the slug to its config (which
 * holds a React icon component that can't cross the server boundary) and hands
 * it to the shared ToolRunner. Adds a "Customize" shortcut that opens the
 * builder pre-filled from this tool.
 */
export default function BuiltinToolRunner({ slug }: { slug: string }) {
  const config = toolConfigs.find((t) => t.slug === slug);
  if (!config) return null;

  return (
    <ToolRunner
      tool={config}
      actions={
        <Link href={`/tools/new?from=${config.slug}`} className="btn-secondary">
          <WriteIcon className="h-4 w-4" />
          Customize this tool
        </Link>
      }
    />
  );
}
