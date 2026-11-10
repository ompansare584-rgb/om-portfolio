import { buildPageMd } from '@/lib/llms';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: 'hiring' }, { slug: 'editing' }, { slug: 'ragas' }];
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const md = buildPageMd(slug);
  if (!md) return new Response('Not found', { status: 404 });
  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  });
}
