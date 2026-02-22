import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 강제 리다이렉트 없음 — 모든 경로 그대로 통과. 로그인은 /login에서만 사용
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)",
  ],
};