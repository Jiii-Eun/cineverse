# Setup Commands Log

프로젝트 초기 세팅 및 작업 시 사용한 명령어 기록입니다.

---

## 2026-06-10 — Cursor 룰 파일 생성

### 디렉토리 생성

```bash
mkdir -p .cursor/rules docs
```

### 생성된 파일

| 파일                                 | 설명                               |
| ------------------------------------ | ---------------------------------- |
| `.cursor/rules/cineverse.mdc` | 프로젝트 통합 Cursor 룰 (6개 섹션) |
| `docs/setup-commands.md`             | 명령어 사용 기록 (이 파일)         |

---

## 2026-06-10 — Expo 프로젝트 초기화

### 1. Expo 프로젝트 생성 (비어 있지 않은 디렉터리 → temp 폴더 사용)

```bash
# 루트에 기존 파일(.cursor, docs 등)이 있어 직접 생성 불가
npx create-expo-app@latest . --template blank-typescript --yes
# → 실패: 디렉터리가 비어 있지 않음

# temp 폴더에 생성 후 루트로 병합
npx create-expo-app@latest temp-expo --template blank-typescript --yes
```

### 2. temp-expo → 루트 병합

```bash
cp temp-expo/package.json temp-expo/package-lock.json temp-expo/tsconfig.json temp-expo/.gitignore ./
cp -r temp-expo/assets ./
cp -r temp-expo/node_modules ./
rm -rf temp-expo
```

### 3. node_modules 재설치 (복사본 불완전 시)

```bash
rm -rf node_modules
npm install
```

### 4. Expo Router 및 플랫폼 의존성 설치

```bash
npx expo install expo-router react-native-screens expo-linking expo-constants react-native-safe-area-context react-native-reanimated react-native-gesture-handler react-native-web react-dom @expo/metro-runtime expo-image
```

### 5. NativeWind, TanStack Query, Zustand 설치

```bash
npm install nativewind @tanstack/react-query zustand
npm install --save-dev tailwindcss@3 babel-preset-expo
```

### 6. React / React Native peer 의존성 확인

```bash
npx expo install react react-native
```

### 7. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일에 EXPO_PUBLIC_TMDB_API_KEY 값 입력
```

### 8. 타입 검사

```bash
npx tsc --noEmit
```

### 9. 웹 빌드 검증

```bash
npx expo export --platform web
```

### 10. 개발 서버 실행

```bash
# 모바일 (Expo Go)
npx expo start

# 웹
npx expo start --web

# 캐시 초기화 후 실행 (NativeWind 설정 변경 시)
npx expo start --clear
```

### NativeWind 웹 다크모드 오류 수정

웹에서 `Cannot manually set color scheme, as dark mode is type 'media'` 오류 발생 시:

- `tailwind.config.js`에 `darkMode: 'class'` 추가
- Metro 캐시 초기화 후 재시작: `npx expo start --clear --web`

---

## 예정 — Android APK 빌드 (EAS)

```bash
# EAS CLI 설치 (전역)
npm install -g eas-cli

# EAS 로그인 및 초기 설정
eas login
eas build:configure

# APK 빌드 (preview 프로필 — eas.json에 buildType: apk 설정됨)
eas build --platform android --profile preview
```

로컬 APK 빌드 (prebuild 후):

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

---

## 생성된 주요 파일 구조

```
cineverse/
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # 상영 중 (now_playing)
│   │   └── favorites.tsx
│   └── movie/[id].tsx
├── src/
│   ├── components/ui/
│   ├── components/layout/
│   ├── components/movie/
│   ├── hooks/
│   ├── services/tmdb.ts
│   ├── stores/uiStore.ts
│   ├── lib/queryClient.ts
│   ├── types/movie.ts
│   └── constants/config.ts
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── global.css
├── eas.json
└── .env.example
```

---

## 2026-06-10 — 기능 확장 (카드, 검색, 인증, 목록)

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install @expo/vector-icons @react-navigation/bottom-tabs
npx tsc --noEmit
```

### 추가된 주요 기능

- MovieCard: 2:3 비율, hover scale/shadow, 찜 하트, 카드 메타 레이아웃
- 검색 탭 (`/search`) — TMDB `search/movie`
- 즐겨찾기 하위메뉴: 찜목록 / 커스텀 목록
- TMDB 로그인 3단계 (request token → 승인 → session)
- 장르·피드 카테고리 사이드바 (모바일: 좌측 드로어)
- 하단 탭 잘림 수정 (`useBottomTabBarHeight` + safe area padding)

---

## 2026-06-10 — CINEVERSE 디자인 적용

```bash
npx expo install expo-linear-gradient
npx tsc --noEmit
```

- 다크 테마 (`#0D0D12`) + 퍼플/핑크 그라데이션
- 홈: CINEVERSE 헤더, 히어로 배너, 가로 스크롤 추천
- 탐색: 필터 칩, 장르 그리드, 검색 리스트
- 상세: 백드롭 히어로, 액션 아이콘
- 프로필 탭 추가
- 하단 탭: 홈 / 탐색 / 즐겨찾기 / 프로필

---

## 명령어 추가 기록

이후 작업에서 사용한 명령어는 위와 같은 형식으로 이 파일에 추가합니다.
