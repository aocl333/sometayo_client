import type { CapacitorConfig } from '@capacitor/cli';
import path from 'path';
import { config as loadEnv } from 'dotenv';

// config 파일(프로젝트 루트) 기준 .env.local
loadEnv({ path: path.resolve(__dirname, '.env.local') });

// 개발: CAPACITOR_DEV_SERVER (예: http://본인PC_IP:3000)
const serverUrl = process.env.CAPACITOR_DEV_SERVER;

const config: CapacitorConfig = {
  appId: 'com.sumtayo.app',
  appName: '썸타요',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    ...(serverUrl && { url: serverUrl }),
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
