import type { ComponentType, SVGProps } from 'react';
import { toolConfigs } from '@/lib/toolConfigs';

export interface Tool {
  name: string;
  short: string;
  description: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Tailwind gradient classes for the icon tile */
  gradient: string;
}

/** Homepage tool grid, derived from the single source of truth in toolConfigs. */
export const tools: Tool[] = toolConfigs.map((t) => ({
  name: t.name,
  short: t.short,
  description: t.description,
  href: `/tools/${t.slug}`,
  Icon: t.Icon,
  gradient: t.gradient,
}));
