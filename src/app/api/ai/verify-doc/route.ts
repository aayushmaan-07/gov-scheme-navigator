import { NextRequest, NextResponse } from 'next/server';
import { verifyDocumentWithAI } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    let documentBase64: string | undefined;
    let sampleType: string | undefined;

    try {
      const body = await req.json();
      documentBase64 = body?.documentBase64;
      sampleType = body?.sampleType;
    } catch {
      sampleType = 'income_cert';
    }

    const result = await verifyDocumentWithAI(documentBase64, sampleType);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('API /api/ai/verify-doc error:', err);
    return NextResponse.json(
      { error: 'Failed to verify document' },
      { status: 500 }
    );
  }
}
