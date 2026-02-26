/**
 * 웹(Next dev/build)에서 Capacitor 패키지 미설치 시 사용하는 스텁.
 * 앱 빌드 시에는 CAPACITOR=1 로 빌드해서 실제 패키지 사용.
 */
export const Capacitor = {
  isNativePlatform: (): boolean => false,
};

export const App = {
  addListener: async () => ({ remove: async () => {} }),
};

export const Browser = {
  open: async (_opts: { url: string }) => {},
};
