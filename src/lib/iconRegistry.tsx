import type { ComponentType, SVGProps } from 'react';
import {
  SparklesIcon,
  LightbulbIcon,
  ChatIcon,
  WriteIcon,
  DocumentIcon,
  CodeIcon,
  BracesIcon,
  DatabaseIcon,
  MailIcon,
  SendIcon,
  MegaphoneIcon,
  ClipboardIcon,
  ListIcon,
  SummarizeIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  FlagIcon,
  ShieldCheckIcon,
  GitBranchIcon,
} from '@/components/ui/icons';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Icons a user can pick for a custom tool. Stored by string key (icons are
 * React components and can't live in localStorage). `getToolIcon` resolves a
 * key back to a component, falling back to Sparkles for unknown/legacy keys.
 */
export const TOOL_ICONS: { key: string; Icon: Icon }[] = [
  { key: 'sparkles', Icon: SparklesIcon },
  { key: 'lightbulb', Icon: LightbulbIcon },
  { key: 'chat', Icon: ChatIcon },
  { key: 'write', Icon: WriteIcon },
  { key: 'document', Icon: DocumentIcon },
  { key: 'code', Icon: CodeIcon },
  { key: 'braces', Icon: BracesIcon },
  { key: 'database', Icon: DatabaseIcon },
  { key: 'mail', Icon: MailIcon },
  { key: 'send', Icon: SendIcon },
  { key: 'megaphone', Icon: MegaphoneIcon },
  { key: 'clipboard', Icon: ClipboardIcon },
  { key: 'list', Icon: ListIcon },
  { key: 'summarize', Icon: SummarizeIcon },
  { key: 'user', Icon: UserIcon },
  { key: 'calendar', Icon: CalendarIcon },
  { key: 'clock', Icon: ClockIcon },
  { key: 'flag', Icon: FlagIcon },
  { key: 'shield', Icon: ShieldCheckIcon },
  { key: 'git', Icon: GitBranchIcon },
];

const ICON_MAP: Record<string, Icon> = Object.fromEntries(
  TOOL_ICONS.map(({ key, Icon }) => [key, Icon])
);

export function getToolIcon(key: string): Icon {
  return ICON_MAP[key] ?? SparklesIcon;
}

/**
 * Preset gradients for the icon tile. These must be full literal class strings
 * so Tailwind's scanner includes them in the build (it can't see runtime
 * concatenations).
 */
export const TOOL_GRADIENTS: string[] = [
  'from-sky-500 to-indigo-500',
  'from-violet-500 to-fuchsia-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-indigo-500 to-violet-500',
  'from-fuchsia-500 to-purple-500',
  'from-teal-500 to-emerald-600',
  'from-blue-500 to-indigo-600',
  'from-red-500 to-rose-600',
  'from-orange-500 to-amber-600',
];
