'use client';

import { useState } from 'react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import ToolShell from '@/components/ui/ToolShell';
import NvidiaResponse from '@/components/ui/NvidiaResponse';
import CopyButton from '@/components/ui/CopyButton';
import { SparklesIcon } from '@/components/ui/icons';
import { runTool } from '@/lib/nvidia';
import type { ToolField } from '@/lib/toolConfigs';

/** A fully-resolved tool ready to run (icon is a component, not a key/slug). */
export interface RunnerTool {
  name: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  gradient: string;
  systemPrompt: string;
  fields: ToolField[];
  submitLabel?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Shared runner used by both built-in and user-created tools: builds the form
 * from `tool.fields`, sends the system prompt + collected input to the NVIDIA
 * proxy, and renders the markdown result. `actions` is an optional toolbar
 * (e.g. Customize for built-ins, Edit/Delete for custom tools).
 */
export default function ToolRunner({ tool, actions }: { tool: RunnerTool; actions?: ReactNode }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    !loading && tool.fields.every((f) => f.optional || (values[f.name] ?? '').trim().length > 0);

  const setField = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const filled = tool.fields.filter((f) => (values[f.name] ?? '').trim().length > 0);
      const userMessage =
        filled.length === 1
          ? (values[filled[0].name] ?? '').trim()
          : filled.map((f) => `${f.label}: ${(values[f.name] ?? '').trim()}`).join('\n\n');

      const output = await runTool(tool.systemPrompt, userMessage, {
        temperature: tool.temperature,
        maxTokens: tool.maxTokens,
      });

      if (!output.trim()) {
        setError('The model returned an empty response. Please try again.');
      } else {
        setResult(output);
      }
    } catch {
      setError('Something went wrong reaching the AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title={tool.name}
      subtitle={tool.description}
      Icon={tool.Icon}
      gradient={tool.gradient}
    >
      {actions && <div className="mb-6 flex flex-wrap items-center gap-2">{actions}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="card flex h-fit flex-col gap-5 p-6">
          {tool.fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="label">
                {field.label}
                {field.optional && <span className="font-normal text-muted"> (optional)</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  className="field min-h-[150px]"
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setField(field.name, e.target.value)}
                />
              ) : (
                <input
                  id={field.name}
                  type="text"
                  className="field"
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setField(field.name, e.target.value)}
                />
              )}
            </div>
          ))}

          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={!canSubmit}>
            <SparklesIcon className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Generating…' : tool.submitLabel ?? 'Generate'}
          </button>
        </form>

        <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
          <NvidiaResponse content={result} isLoading={loading} />
          {result && !loading && (
            <div className="flex justify-end">
              <CopyButton value={result} label="Copy result" />
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
