import { NextRequest, NextResponse } from 'next/server';
import { parseQueryWithGemini } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    let query = '';
    try {
      const raw = await req.text();
      try {
        const body = JSON.parse(raw);
        query = typeof body === 'object' && body !== null ? body.query || '' : raw;
      } catch {
        query = raw;
      }
    } catch {
      query = '';
    }

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await parseQueryWithGemini(query.trim());
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('API /api/ai/query error:', err);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}
