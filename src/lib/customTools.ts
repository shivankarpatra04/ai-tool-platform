'use client';

import { useEffect, useState } from 'react';

// User-created tools persisted in the browser (no backend/auth). Each tool is
// a serializable mirror of a built-in ToolConfig: icons are stored as a string
// key (resolved via iconRegistry) instead of a React component.

export type CustomFieldType = 'text' | 'textarea';

export interface CustomField {
  id: string;
  label: string;
  type: CustomFieldType;
  placeholder?: string;
  optional?: boolean;
}

export interface CustomTool {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  gradient: string;
  systemPrompt: string;
  fields: CustomField[];
  temperature: number;
  maxTokens: number;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'ai-tools:custom-tools:v1';
const CHANGE_EVENT = 'customtools-changed';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function loadCustomTools(): CustomTool[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CustomTool[];
  } catch {
    return [];
  }
}

function persist(tools: CustomTool[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  // Notify same-tab listeners (the native `storage` event only fires cross-tab).
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getCustomTool(id: string): CustomTool | undefined {
  return loadCustomTools().find((t) => t.id === id);
}

export function upsertCustomTool(tool: CustomTool) {
  const tools = loadCustomTools();
  const idx = tools.findIndex((t) => t.id === tool.id);
  if (idx >= 0) tools[idx] = tool;
  else tools.unshift(tool);
  persist(tools);
}

export function deleteCustomTool(id: string) {
  persist(loadCustomTools().filter((t) => t.id !== id));
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'tool'
  );
}

/** Build a URL-friendly id from a name, guaranteed unique among saved tools. */
export function createToolId(name: string): string {
  const base = slugify(name);
  const existing = new Set(loadCustomTools().map((t) => t.id));
  let id = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  while (existing.has(id)) {
    id = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return id;
}

export function newFieldId(): string {
  return `f${Math.random().toString(36).slice(2, 8)}`;
}

/** Reactive list of the user's custom tools. `mounted` guards SSR/hydration. */
export function useCustomTools(): { tools: CustomTool[]; mounted: boolean } {
  const [tools, setTools] = useState<CustomTool[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setTools(loadCustomTools());
    sync();
    setMounted(true);
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { tools, mounted };
}

/** Reactive single tool lookup. */
export function useCustomTool(id: string): { tool: CustomTool | undefined; mounted: boolean } {
  const { tools, mounted } = useCustomTools();
  return { tool: tools.find((t) => t.id === id), mounted };
}
