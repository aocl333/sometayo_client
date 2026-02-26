/**
 * Capacitor 플러그인 타입 (npm install 전에도 빌드 가능하도록)
 * 설치 후: @capacitor/core, @capacitor/app, @capacitor/browser 의 실제 타입 사용
 */
declare module '@capacitor/core' {
  export const Capacitor: {
    isNativePlatform(): boolean;
  };
}

declare module '@capacitor/app' {
  export const App: {
    addListener(
      event: 'appUrlOpen',
      callback: (event: { url: string }) => void | Promise<void>
    ): Promise<{ remove: () => Promise<void> }>;
  };
}

declare module '@capacitor/browser' {
  export const Browser: {
    open(options: { url: string }): Promise<void>;
  };
}
