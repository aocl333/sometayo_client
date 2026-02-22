import { NextRequest, NextResponse } from 'next/server';

// 실시간 위치 수신용 (세션/메모리 저장, 추후 DB/Redis로 교체 가능)
let lastLocation: { lat: number; lng: number; at: string } | null = null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng } = body as { lat?: number; lng?: number };
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        { success: false, message: 'lat, lng는 숫자여야 합니다.' },
        { status: 400 }
      );
    }
    lastLocation = {
      lat,
      lng,
      at: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, data: lastLocation });
  } catch {
    return NextResponse.json(
      { success: false, message: '잘못된 요청입니다.' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: lastLocation,
  });
}
