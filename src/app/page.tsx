import Link from 'next/link';
import { tools } from '@/lib/tools';
import ThemeToggle from '@/components/theme/ThemeToggle';
import MyToolsSection from '@/components/home/MyToolsSection';
import { SparklesIcon, ArrowRightIcon, PlusIcon } from '@/components/ui/icons';

export default function Home() {
  return (
    <div className="app-shell">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-strong to-brand-accent text-white shadow-sm">
              <SparklesIcon className="h-5 w-5" />
            </span>
            <span className="text-base font-bold tracking-tight">AI Tools</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/tools/new" className="btn-primary px-3.5 sm:px-4">
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Create tool</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="py-16 text-center sm:py-24">
          <div className="animate-fade-in-up">
            <span className="eyebrow mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {tools.length > 0 ? `${tools.length} powerful tools, one workspace` : 'One workspace for AI tools'}
            </span>
          </div>
          <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight sm:text-6xl">
            Everything AI,{' '}
            <span className="bg-gradient-to-r from-brand-strong to-brand-accent bg-clip-text text-transparent">
              in one place
            </span>
          </h1>
          <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-muted">
            A unified collection of AI-powered tools designed to help you work faster.
          </p>
        </section>

        {/* User-created tools (client; shows only when the user has some) */}
        <MyToolsSection />

        {/* Tools grid */}
        <section id="tools" className="scroll-mt-24 pb-12">
          {tools.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="card card-hover group flex flex-col gap-4 p-6"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-200 group-hover:scale-105 ${tool.gradient}`}
                  >
                    <tool.Icon className="h-6 w-6" />
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
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-strong to-brand-accent text-white shadow-sm">
                <SparklesIcon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold text-foreground">No tools yet</h3>
              <p className="max-w-md text-sm leading-relaxed text-muted">
                Tools have been removed from this workspace. Add new ones to the registry in{' '}
                <code className="rounded bg-surface px-1.5 py-0.5 text-xs">src/lib/tools.tsx</code>{' '}
                to see them appear here.
              </p>
            </div>
          )}
        </section>

        {/* Build-your-own CTA */}
        <section className="pb-24">
          <div className="card relative overflow-hidden p-8 sm:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-brand-strong to-brand-accent opacity-20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="eyebrow mb-3">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  No code required
                </span>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Build your own AI tool
                </h2>
                <p className="mt-2 max-w-xl text-muted">
                  Describe what the AI should do, choose an icon, and add the inputs you want — your
                  tool is ready in seconds and saved right here in your browser.
                </p>
              </div>
              <Link href="/tools/new" className="btn-primary shrink-0 px-6">
                <PlusIcon className="h-4 w-4" />
                Create your own tool
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted sm:px-6 lg:px-8">
          © {new Date().getFullYear()} AI Tools Platform. Built for makers.
        </div>
      </footer>
    </div>
  );
}
