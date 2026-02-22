# 실시간 지도 – Android / iOS 출시 시 체크리스트

이 프로젝트의 지도(카카오맵 + 실시간 위치)는 **Android / iOS 앱**으로 빌드해도 동일하게 동작하도록 구성되어 있습니다. 아래만 확인하면 양쪽 모두 문제없이 출시할 수 있습니다.

---

## Android (이미 반영됨)

- **위치 권한**이 `android/app/src/main/AndroidManifest.xml`에 추가되어 있습니다.
  - `ACCESS_FINE_LOCATION` – GPS 기반 정확한 위치
  - `ACCESS_COARSE_LOCATION` – 네트워크 기반 대략적 위치
- 앱 첫 실행 후 지도 화면에서 위치를 쓰면 **시스템 권한 요청 창**이 뜹니다. 사용자가 허용하면 실시간 위치가 정상 동작합니다.

---

## iOS (앱 추가 후 한 번만 설정)

iOS 프로젝트는 `npx cap add ios`로 처음 생성한 뒤, **한 번만** 아래 설정을 해주면 됩니다.

### 1. 위치 권한 문구 추가 (필수)

지도에서 “내 위치”를 쓰려면 **위치 사용 목적**을 설명하는 문구가 반드시 필요합니다.

1. Xcode에서 `ios/App/App/Info.plist` 열기  
2. **Information Property List**에 다음 키 추가 (또는 기존 키 수정):

| Key | Type | Value (예시) |
|-----|------|--------------|
| `NSLocationWhenInUseUsageDescription` | String | 실시간 지도에서 내 위치를 표시하기 위해 위치 권한이 필요합니다. |

또는 **Source Code**로 열어서 다음 블록을 `<dict>...</dict>` 안에 넣어도 됩니다.

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>실시간 지도에서 내 위치를 표시하기 위해 위치 권한이 필요합니다.</string>
```

이 문구가 없으면 iOS에서 위치 접근이 거부되어 **지도에 내 위치가 나오지 않습니다.**

### 2. (선택) 백그라운드 위치

앱을 **백그라운드**에서도 계속 위치를 보내야 한다면 추가합니다.  
현재 실시간 지도는 **앱이 화면에 보일 때만** 위치를 쓰므로, 일반 출시에는 아래 설정은 필요 없습니다.

- `NSLocationAlwaysAndWhenInUseUsageDescription`
- Capabilities에서 **Background Modes → Location updates** 활성화

---

## 공통 (웹/앱 동일)

- **카카오맵**: `.env.local`에 `NEXT_PUBLIC_KAKAO_MAP_KEY`(카카오 JavaScript 키)가 설정되어 있으면, 브라우저/Android/iOS 모두 같은 키로 지도가 로드됩니다.
- **HTTPS**: 카카오맵 스크립트는 `https://dapi.kakao.com`으로 로드되므로 iOS/Android 정책에 맞습니다.
- **Capacitor**: `webDir: 'out'` 사용 시 `next build` 후 `npx cap sync`로 앱에 반영하는 흐름만 지키면 됩니다.

---

## 요약

| 항목 | Android | iOS |
|------|--------|-----|
| 위치 권한 선언 | ✅ Manifest에 추가됨 | ⚠️ `Info.plist`에 `NSLocationWhenInUseUsageDescription` 추가 필요 |
| 카카오맵 키 | ✅ 동일 | ✅ 동일 |
| 지도/위치 로직 | ✅ 코드 공유 | ✅ 코드 공유 |

**정리**: Android는 이미 설정되어 있고, iOS는 `npx cap add ios` 한 뒤 **Info.plist에 위치 사용 목적 문구만 추가**하면, 지도 부분은 Android·iOS 모두 동일하게 출시해도 됩니다.
