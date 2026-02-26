const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // 웹 빌드/개발 시 Capacitor 패키지 없어도 되도록 스텁 사용 (앱 빌드 시 CAPACITOR=1 로 실제 패키지 사용)
    if (process.env.CAPACITOR !== '1') {
      const stub = path.join(__dirname, 'src/lib/capacitor-stub.ts')
      config.resolve.alias = {
        ...config.resolve.alias,
        '@capacitor/core': stub,
        '@capacitor/app': stub,
        '@capacitor/browser': stub,
      }
    }
    return config
  },
}

module.exports = nextConfig
