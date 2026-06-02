'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ThemeToggle from '@/components/theme/ThemeToggle';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  SparklesIcon,
} from '@/components/ui/icons';
import { TOOL_ICONS, TOOL_GRADIENTS, getToolIcon } from '@/lib/iconRegistry';
import {
  createToolId,
  getCustomTool,
  newFieldId,
  upsertCustomTool,
  type CustomField,
  type CustomTool,
} from '@/lib/customTools';
import { toolConfigs } from '@/lib/toolConfigs';

const LENGTH_OPTIONS = [
  { label: 'Short', value: 512 },
  { label: 'Medium', value: 1024 },
  { label: 'Long', value: 2048 },
];

function blankField(): CustomField {
  return { id: newFieldId(), label: '', type: 'textarea', placeholder: '', optional: false };
}

export default function ToolBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconKey, setIconKey] = useState('sparkles');
  const [gradient, setGradient] = useState(TOOL_GRADIENTS[0]);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [fields, setFields] = useState<CustomField[]>([blankField()]);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Prefill from an existing custom tool (?id=) or a built-in template (?from=).
  useEffect(() => {
    const id = searchParams.get('id');
    const from = searchParams.get('from');

    if (id) {
      const t = getCustomTool(id);
      if (t) {
        setEditingId(t.id);
        setCreatedAt(t.createdAt);
        setName(t.name);
        setDescription(t.description);
        setIconKey(t.iconKey);
        setGradient(t.gradient);
        setSystemPrompt(t.systemPrompt);
        setFields(t.fields.length ? t.fields : [blankField()]);
        setTemperature(t.temperature);
        setMaxTokens(t.maxTokens);
      }
    } else if (from) {
      const c = toolConfigs.find((x) => x.slug === from);
      if (c) {
        setName(`${c.name} (copy)`);
        setDescription(c.description);
        setGradient(c.gradient);
        setSystemPrompt(c.systemPrompt);
        setFields(
          c.fields.map((f) => ({
            id: newFieldId(),
            label: f.label,
            type: f.type,
            placeholder: f.placeholder ?? '',
            optional: !!f.optional,
          }))
        );
        setTemperature(c.temperature ?? 0.7);
        setMaxTokens(c.maxTokens ?? 1024);
      }
    }
    setReady(true);
  }, [searchParams]);

  const updateField = (id: string, patch: Partial<CustomField>) =>
    setFields((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const addField = () => setFields((fs) => [...fs, blankField()]);
  const removeField = (id: string) =>
    setFields((fs) => (fs.length > 1 ? fs.filter((f) => f.id !== id) : fs));

  const nameValid = name.trim().length > 0;
  const promptValid = systemPrompt.trim().length > 0;
  const fieldsValid = fields.some((f) => f.label.trim().length > 0);
  const canSave = nameValid && promptValid && fieldsValid;

  const handleSave = () => {
    if (!canSave) return;
    const tool: CustomTool = {
      id: editingId ?? createToolId(name),
      name: name.trim(),
      description: description.trim() || 'A custom AI tool',
      iconKey,
      gradient,
      systemPrompt: systemPrompt.trim(),
      fields: fields
        .filter((f) => f.label.trim().length > 0)
        .map((f) => ({
          id: f.id,
          label: f.label.trim(),
          type: f.type,
          placeholder: f.placeholder?.trim() || undefined,
          optional: f.optional,
        })),
      temperature,
      maxTokens,
      createdAt: createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };
    upsertCustomTool(tool);
    router.push(`/tools/custom/${tool.id}`);
  };

  const PreviewIcon = getToolIcon(iconKey);
  const previewFields = fields.filter((f) => f.label.trim().length > 0);

  if (!ready) {
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

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Back to all tools"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background-elevated text-muted shadow-sm transition-colors hover:border-brand/40 hover:text-foreground"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold leading-tight sm:text-xl">
                {editingId ? 'Edit tool' : 'Create your own tool'}
              </h1>
              <p className="truncate text-xs text-muted sm:text-sm">
                Describe what the AI should do — no code required.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* ───────────────────────── Form ───────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Basics */}
            <section className="card flex flex-col gap-4 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">1. Basics</h2>
              <div>
                <label htmlFor="tool-name" className="label">
                  Tool name
                </label>
                <input
                  id="tool-name"
                  className="field"
                  placeholder="e.g. Recipe Suggester"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                />
              </div>
              <div>
                <label htmlFor="tool-desc" className="label">
                  Short description
                </label>
                <input
                  id="tool-desc"
                  className="field"
                  placeholder="e.g. Suggests recipes from the ingredients you have"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={120}
                />
              </div>
            </section>

            {/* Appearance */}
            <section className="card flex flex-col gap-4 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                2. Appearance
              </h2>
              <div>
                <span className="label">Icon</span>
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
                  {TOOL_ICONS.map(({ key, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      aria-label={`Icon ${key}`}
                      aria-pressed={iconKey === key}
                      onClick={() => setIconKey(key)}
                      className={`flex aspect-square items-center justify-center rounded-xl border transition-colors ${
                        iconKey === key
                          ? 'border-brand text-brand-strong ring-2 ring-brand/30 dark:text-brand'
                          : 'border-border text-muted hover:border-brand/40 hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="label">Color</span>
                <div className="flex flex-wrap gap-2">
                  {TOOL_GRADIENTS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      aria-label={`Color ${g}`}
                      aria-pressed={gradient === g}
                      onClick={() => setGradient(g)}
                      className={`h-9 w-9 rounded-xl bg-gradient-to-br ${g} transition-transform hover:scale-105 ${
                        gradient === g
                          ? 'ring-2 ring-brand ring-offset-2 ring-offset-[var(--background)]'
                          : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* AI instructions */}
            <section className="card flex flex-col gap-4 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                3. Instructions for the AI
              </h2>
              <div>
                <label htmlFor="tool-prompt" className="label">
                  What should the AI do with the input?
                </label>
                <textarea
                  id="tool-prompt"
                  className="field min-h-[140px]"
                  placeholder={
                    'e.g. You are an expert chef. Given a list of ingredients, suggest 3 simple recipes. For each, give a title, ingredients used, and numbered steps. Keep it under 150 words per recipe.'
                  }
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                />
                <p className="mt-1.5 text-xs text-muted">
                  Be specific about the format you want (headings, lists, length). The user&apos;s
                  input is sent along with these instructions.
                </p>
              </div>
            </section>

            {/* Inputs */}
            <section className="card flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  4. Inputs the user fills in
                </h2>
                <button type="button" onClick={addField} className="btn-ghost px-2.5 py-1.5 text-sm">
                  <PlusIcon className="h-4 w-4" />
                  Add input
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {fields.map((f, idx) => (
                  <div key={f.id} className="flex flex-col gap-2 rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2">
                      <input
                        className="field"
                        placeholder={`Input ${idx + 1} label, e.g. Your ingredients`}
                        value={f.label}
                        onChange={(e) => updateField(f.id, { label: e.target.value })}
                        maxLength={60}
                      />
                      <button
                        type="button"
                        onClick={() => removeField(f.id)}
                        disabled={fields.length === 1}
                        aria-label="Remove input"
                        className="btn-ghost shrink-0 px-2.5 disabled:opacity-30"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        className="field max-w-[150px]"
                        value={f.type}
                        onChange={(e) =>
                          updateField(f.id, { type: e.target.value as CustomField['type'] })
                        }
                      >
                        <option value="textarea">Long text</option>
                        <option value="text">Short text</option>
                      </select>
                      <input
                        className="field min-w-[160px] flex-1"
                        placeholder="Placeholder hint (optional)"
                        value={f.placeholder ?? ''}
                        onChange={(e) => updateField(f.id, { placeholder: e.target.value })}
                        maxLength={120}
                      />
                      <label className="flex shrink-0 items-center gap-1.5 text-sm text-muted">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[var(--brand)]"
                          checked={!!f.optional}
                          onChange={(e) => updateField(f.id, { optional: e.target.checked })}
                        />
                        Optional
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Advanced */}
            <section className="card flex flex-col gap-4 p-6">
              <button
                type="button"
                onClick={() => setShowAdvanced((s) => !s)}
                className="flex items-center justify-between text-left"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Advanced settings
                </h2>
                <span className="text-sm text-muted">{showAdvanced ? 'Hide' : 'Show'}</span>
              </button>
              {showAdvanced && (
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="label mb-0">Creativity</span>
                      <span className="pill-muted">{temperature.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-[var(--brand)]"
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  <div>
                    <span className="label">Response length</span>
                    <div className="flex gap-2">
                      {LENGTH_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setMaxTokens(opt.value)}
                          className={maxTokens === opt.value ? 'btn-primary' : 'btn-secondary'}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Save bar */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              {!canSave && (
                <p className="mr-auto text-sm text-muted">
                  Add a name, AI instructions, and at least one input to save.
                </p>
              )}
              <Link href="/" className="btn-secondary">
                Cancel
              </Link>
              <button type="button" onClick={handleSave} disabled={!canSave} className="btn-primary px-6">
                <SparklesIcon className="h-4 w-4" />
                {editingId ? 'Save changes' : 'Create tool'}
              </button>
            </div>
          </div>

          {/* ───────────────────────── Live preview ───────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Preview</p>

            <div className="card flex flex-col gap-4 p-6">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${gradient}`}
              >
                <PreviewIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {name.trim() || 'Your tool name'}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {description.trim() || 'A short description of what your tool does.'}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                {previewFields.length === 0 ? (
                  <p className="text-sm text-muted">Your inputs will appear here.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {previewFields.map((f) => (
                      <div key={f.id}>
                        <span className="label">
                          {f.label}
                          {f.optional && (
                            <span className="font-normal text-muted"> (optional)</span>
                          )}
                        </span>
                        {f.type === 'textarea' ? (
                          <div className="field min-h-[60px] cursor-default select-none text-muted/60">
                            {f.placeholder || 'Long text…'}
                          </div>
                        ) : (
                          <div className="field cursor-default select-none text-muted/60">
                            {f.placeholder || 'Short text…'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="mt-3 text-xs text-muted">
              Your tools are saved in this browser only. They won&apos;t appear on other devices.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
