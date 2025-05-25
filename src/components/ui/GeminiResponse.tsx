'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

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
    loading: () => <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">Loading...</div>
  }
) as SyntaxHighlighterComponent;

interface GeminiResponseProps {
  content: string;
  isLoading?: boolean;
  className?: string;
}

interface SyntaxHighlighterStyles {
  vscDarkPlus: Record<string, React.CSSProperties>;
  vs: Record<string, React.CSSProperties>;
}

export default function GeminiResponse({ 
  content, 
  isLoading = false,
  className = ''
}: GeminiResponseProps) {
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

  // Add a subtle animation when new content is loaded
  useEffect(() => {
    if (content && responseRef.current) {
      responseRef.current.style.opacity = '0';
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.style.opacity = '1';
        }
      }, 100);
    }
  }, [content]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-8 h-64 flex flex-col items-center justify-center">
        <p className="text-xl">Your response will appear here</p>
        <p className="mt-2">Fill in the form and submit to generate content</p>
      </div>
    );
  }

  return (
    <div 
      ref={responseRef} 
      className={`p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-auto transition-opacity duration-300 ${className}`}
    >
      <div className="prose dark:prose-invert prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal max-w-none">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const isInline = !match && children?.toString().includes('\n') === false;
              
              return !isInline && language ? (
                <div className="my-4 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs font-sans">
                    <span className="text-gray-600 dark:text-gray-300">{language}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(String(children || '').replace(/\n$/, ''))} 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={isDark ? syntaxHighlighterStyles.vscDarkPlus : syntaxHighlighterStyles.vs}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {String(children || '').replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            },
            // Enhance other markdown elements
            p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="mb-4 pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="mb-4 pl-6">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            ),
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-white">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 text-gray-900 dark:text-white">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold mb-3 mt-4 text-gray-900 dark:text-white">{children}</h3>,
            h4: ({ children }) => <h4 className="text-base font-bold mb-2 mt-4 text-gray-900 dark:text-white">{children}</h4>,
            a: ({ href, children }) => (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,
            tbody: ({ children }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>,
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{children}</th>,
            td: ({ children }) => <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{children}</td>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
