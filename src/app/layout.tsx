import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/components/providers';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: '썸타요 - 제주 여행의 새로운 경험',
  description: '보물상자와 로또로 즐기는 특별한 제주 여행',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? '';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        {/* 카카오맵: 동기 script만 document.write 허용. next/script 사용 시 비동기로 들어가서 에러 남 */}
        {KAKAO_KEY ? (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}`} />
        ) : null}
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
