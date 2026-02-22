import type { CapacitorConfig } from '@capacitor/cli';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });

const devServer = process.env.CAPACITOR_DEV_SERVER;
const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.sumtayo.app',
  appName: '썸타요',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // 배포 URL 또는 로컬 개발 서버 사용 시에만 url 설정
    ...(devServer || serverUrl ? { url: devServer || serverUrl } : {}),
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FF6B35',
      showSpinner: false,
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#FF6B35',
    },
  },
};

export default config;
