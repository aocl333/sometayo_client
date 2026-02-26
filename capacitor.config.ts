import type { CapacitorConfig } from '@capacitor/cli';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });

// 개발: CAPACITOR_DEV_SERVER (예: http://본인PC_IP:3000). 배포: CAPACITOR_SERVER_URL (예: https://도메인)
const serverUrl = process.env.CAPACITOR_DEV_SERVER || process.env.CAPACITOR_SERVER_URL;

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
