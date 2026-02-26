# 앱에서 카카오 로그인이 되게 하는 방법

## 체크리스트 (순서대로 확인)

### 1. Vercel 배포가 Capacitor 빌드인지

- **package.json** 의 `"build": "cross-env CAPACITOR=1 next build"` 로 되어 있으면, Vercel이 배포할 때 **Capacitor + 카카오 플러그인**이 포함된 번들을 만듭니다.
- **한 번이라도 수정했다면** 반드시 **다시 배포**(푸시 또는 Vercel에서 Redeploy)한 뒤 테스트하세요.

### 2. 앱이 뭘 로드하는지

- **.env.local** 에 `CAPACITOR_SERVER_URL=https://sumtayo.co.kr` 이 있으면, 앱을 열 때 WebView가 **sumtayo.co.kr** 을 엽니다.
- 그 주소에서 제공되는 게 위에서 말한 **CAPACITOR=1 빌드**여야 네이티브 로그인이 동작합니다.
- 로컬 번들만 쓰고 싶다면 `CAPACITOR_SERVER_URL` 을 비우고, `npm run build:app` 후 `npx cap sync` 해서 **out** 을 채운 뒤 앱을 실행하세요. (현재는 out 정적 export가 없어서 보통은 서버 URL을 쓰는 구성입니다.)

### 3. 카카오 개발자 콘솔 (Android)

- [내 애플리케이션](https://developers.kakao.com/console/app) → 해당 앱 → **플랫폼** → **Android** 추가/선택
- **패키지명**: `com.sumtayo.app` (또는 실제 applicationId와 동일하게)
- **키 해시**: 디버그/릴리즈용 키 해시 등록  
  - 디버그: `android/app` 에서 `keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android` 후 SHA1을 Base64 인코딩, 또는 `scripts/get-android-keyhash.ps1` 활용
- **카카오 로그인** 제품 사용 설정 ON

### 4. Android 네이티브 설정 (이미 되어 있으면 스킵)

- **android/app/src/main/res/values/strings.xml**  
  - `kakao_app_key`: 카카오 **네이티브 앱 키**  
  - `kakao_scheme`: `kakao{네이티브앱키}` (예: `kakao9f7d28aa1c802cc70d5b7e053b067d4c`)
- **MainActivity** 에서 `KakaoSdk.INSTANCE.init(this, getString(R.string.kakao_app_key));`
- **AndroidManifest** 에 `AuthCodeHandlerActivity` (kakaolink + oauth), `meta-data` AppKey, `queries` com.kakao.talk
- **app/build.gradle** 에 `com.kakao.sdk:v2-user`, `v2-auth` 의존성
- **루트 build.gradle** 에 카카오 maven 저장소

### 5. 앱에서 테스트하는 순서

1. **실기기** USB 연결 (에뮬은 카카오 앱 없을 수 있어 제한적)
2. 터미널: `npx cap sync` (필요 시 `npm run build:app` 먼저)
3. Android Studio에서 **Run(▶)** 으로 앱 실행
4. 앱이 **sumtayo.co.kr** 로 뜨면 → 로그인 화면에서 **카카오로 시작하기** 탭
5. **네이티브** 로그인이면: 카카오톡/계정 선택 후 **앱으로 복귀** → 로그인 완료 (URL에 `?code=` 안 붙음)
6. **웹** 플로우가 타면: 브라우저/WebView에 `/login?code=...` 가 보이고, 이때만 "토큰 교환 실패" 등이 뜰 수 있음 → 웹용이 아니라 **앱용 빌드/설정**을 위 1~4번처럼 맞춰야 함

### 6. 여전히 "앱에서 로그인해 주세요" / 토큰 실패가 나올 때

- **앱에서 로그인해 주세요**  
  - 앱이 받는 JS에 **Capacitor 스텁**이 들어가 있는 상태 → Vercel 빌드가 `CAPACITOR=1` 인지, **재배포** 했는지 확인.
- **토큰 교환 실패**  
  - 앱에서 **웹 로그인**이 돌아간 경우에만 발생.  
  - 네이티브만 쓰려면 1~2번으로 **Capacitor 빌드 + 서버 URL** 이 제대로 적용된 뒤, 실기기에서 **카카오로 시작하기**만 누르고 URL 없이 앱 안에서 끝나는지 확인.

---

## 요약

| 할 일 | 확인 |
|------|------|
| Vercel 빌드에 CAPACITOR=1 포함 | package.json `build` 스크립트 확인 후 재배포 |
| 앱이 로드하는 URL | CAPACITOR_SERVER_URL 또는 번들(out) |
| 카카오 콘솔 Android | 패키지명, 키 해시, 카카오 로그인 ON |
| Android 네이티브 | strings.xml, MainActivity, Manifest, build.gradle |
| 테스트 | 실기기 + Run → 카카오로 시작하기 → 앱 안에서 로그인 완료 |

이렇게 맞춰두면 **앱에서** 카카오 로그인이 네이티브로 동작합니다.
