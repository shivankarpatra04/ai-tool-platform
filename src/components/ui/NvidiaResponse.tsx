'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { SparklesIcon, CopyIcon, CheckIcon } from '@/components/ui/icons';

// Define proper types for syntax highlighter
interface SyntaxHighlighterComponent {
  (props: {
    language: string;
    style: Record<string, React.CSSProperties>;
    customStyle: React.CSSProperties;
    children: string;
  }): React.ReactElement;
}
// Dynamically import SyntaxHighlighter with proper typing
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then(mod => mod.Prism),
  {
    ssr: false,
    loading: () => <div className="bg-black/5 dark:bg-white/5 p-4 rounded text-sm text-muted">Loading…</div>
  }
) as SyntaxHighlighterComponent;

interface NvidiaResponseProps {
  content: string;
  isLoading?: boolean;
  className?: string;
}

interface SyntaxHighlighterStyles {
  vscDarkPlus: Record<string, React.CSSProperties>;
  vs: Record<string, React.CSSProperties>;
}

/** Small copy button with success state, used inside code blocks. */
function CodeCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
    >
      {copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function NvidiaResponse({
  content,
  isLoading = false,
  className = ''
}: NvidiaResponseProps) {
  const { resolvedTheme } = useTheme() || { resolvedTheme: 'light' };
  const isDark = resolvedTheme === 'dark';
  const responseRef = useRef<HTMLDivElement>(null);
  const [syntaxHighlighterStyles, setSyntaxHighlighterStyles] = useState<SyntaxHighlighterStyles>({
    vscDarkPlus: {},
    vs: {}
  });

  // Load syntax highlighter styles
  useEffect(() => {
    import('react-syntax-highlighter/dist/cjs/styles/prism')
      .then(styles => {
        setSyntaxHighlighterStyles({
          vscDarkPlus: styles.vscDarkPlus,
          vs: styles.vs
        });
      })
      .catch(error => console.error('Failed to load syntax highlighter styles:', error));
  }, []);

  if (isLoading) {
    return (
      <div className={`card flex flex-col gap-4 p-6 ${className}`}>
        <div className="flex items-center gap-2 text-sm font-medium text-brand-strong dark:text-brand">
          <SparklesIcon className="h-4 w-4 animate-pulse" />
          Generating…
        </div>
        <div className="flex w-full animate-pulse flex-col space-y-3">
          <div className="h-3.5 w-3/4 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-3.5 w-full rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-3.5 w-5/6 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-3.5 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-3.5 w-4/5 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={`card flex flex-col items-center justify-center gap-3 p-8 text-center ${className}`}>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand-strong dark:text-brand">
          <SparklesIcon className="h-6 w-6" />
        </span>
        <p className="text-base font-medium text-foreground">Your result will appear here</p>
        <p className="max-w-xs text-sm text-muted">
          Fill in the form and submit — the AI-generated output shows up in this panel.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={responseRef}
      className={`card animate-fade-in overflow-auto p-6 ${className}`}
    >
      <div className="prose dark:prose-invert prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:text-foreground/90 prose-a:text-brand-strong dark:prose-a:text-brand prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal max-w-none">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const isInline = !match && children?.toString().includes('\n') === false;

              return !isInline && language ? (
                <div className="my-4 overflow-hidden rounded-xl border border-border">
                  <div className="flex items-center justify-between bg-black/[0.03] px-4 py-2 text-xs font-sans dark:bg-white/[0.04]">
                    <span className="font-medium text-muted">{language}</span>
                    <CodeCopyButton value={String(children || '').replace(/\n$/, '')} />
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={isDark ? syntaxHighlighterStyles.vscDarkPlus : syntaxHighlighterStyles.vs}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      background: 'transparent',
                    }}
                  >
                    {String(children || '').replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-sm text-brand-strong dark:bg-white/[0.08] dark:text-brand" {...props}>
                  {children}
                </code>
              );
            },
            p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="mb-4 pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="mb-4 pl-6">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="my-4 border-l-4 border-brand pl-4 italic text-muted">
                {children}
              </blockquote>
            ),
            h1: ({ children }) => <h1 className="mb-4 mt-6 text-2xl font-bold text-foreground">{children}</h1>,
            h2: ({ children }) => <h2 className="mb-3 mt-5 text-xl font-bold text-foreground">{children}</h2>,
            h3: ({ children }) => <h3 className="mb-3 mt-4 text-lg font-bold text-foreground">{children}</h3>,
            h4: ({ children }) => <h4 className="mb-2 mt-4 text-base font-bold text-foreground">{children}</h4>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-strong underline-offset-2 hover:underline dark:text-brand">
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="my-4 overflow-x-auto rounded-xl border border-border">
                <table className="min-w-full divide-y divide-border">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-black/[0.03] dark:bg-white/[0.04]">{children}</thead>,
            tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => <th className="px-3 py-3 text-left text-sm font-semibold text-foreground">{children}</th>,
            td: ({ children }) => <td className="px-3 py-3 text-sm text-muted">{children}</td>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
