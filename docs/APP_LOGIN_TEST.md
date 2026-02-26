# 앱(네이티브) 로그인 테스트

## 왜 "앱에서 로그인해 주세요"가 뜨나요?

앱이 **sumtayo.co.kr** 에서 HTML/JS를 받아올 때, 그 빌드에 **Capacitor 네이티브 플러그인**이 포함돼 있어야 합니다.

- **CAPACITOR=1 없이 빌드** → `@capacitor/core` 가 스텁으로 들어감 → 플러그인 호출 실패 → "앱에서 로그인해 주세요"
- **CAPACITOR=1 로 빌드** → 실제 Capacitor·플러그인 포함 → 앱 WebView에서 네이티브 로그인 동작

이제 `npm run build` 가 기본적으로 **CAPACITOR=1** 로 실행되므로, Vercel 배포도 같은 빌드를 쓰게 됩니다.

## Android Studio에서 테스트하는 방법

1. **실기기** USB 연결 (또는 에뮬레이터 실행)
2. Android Studio에서 **Run(▶)** → 앱이 기기에서 실행됨
3. 앱에서 **카카오로 시작하기** 탭 → 네이티브 카카오 로그인 진행

에뮬레이터는 카카오 앱이 없을 수 있어 동작이 제한될 수 있고, **실기기**에서 테스트하는 것이 가장 확실합니다.

## Vercel 재배포

`package.json` 의 `build` 를 수정했으므로, **한 번 다시 배포**해야 합니다.

- GitHub 푸시 후 Vercel 자동 배포, 또는
- Vercel 대시보드에서 **Redeploy**

재배포 후 앱에서 다시 로그인 테스트해 보세요.
