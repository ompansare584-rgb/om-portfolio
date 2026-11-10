import { buildFacts } from '@/lib/llms';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildFacts(), { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
