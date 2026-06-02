import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuiltinToolRunner from '@/components/ui/BuiltinToolRunner';
import { toolConfigs } from '@/lib/toolConfigs';

export function generateStaticParams() {
  return toolConfigs.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = toolConfigs.find((t) => t.slug === slug);
  if (!config) return { title: 'Tool not found — AI Tools' };
  return { title: `${config.name} — AI Tools`, description: config.description };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = toolConfigs.find((t) => t.slug === slug);
  if (!config) notFound();

  return <BuiltinToolRunner slug={slug} />;
}
