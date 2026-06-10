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
| `.cursor/rules/movie-collection.mdc` | 프로젝트 통합 Cursor 룰 (6개 섹션) |
| `docs/setup-commands.md`             | 명령어 사용 기록 (이 파일)         |

> 파일 내용은 에디터/도구로 직접 작성. 셸에서 `touch`·`echo` 등은 사용하지 않음.

---

## 예정 — Expo 프로젝트 초기화 (아직 미실행)

아래는 프로젝트 스캐폴딩 시 사용할 예정 명령어입니다.

### 1. Expo 프로젝트 생성

```bash
npx create-expo-app@latest . --template tabs
```

또는 빈 템플릿:

```bash
npx create-expo-app@latest . --template blank-typescript
```

### 2. 의존성 설치

```bash
# NativeWind
npx expo install nativewind react-native-reanimated react-native-safe-area-context
npm install --save-dev tailwindcss@3

# TanStack Query
npm install @tanstack/react-query

# Zustand
npm install zustand

# Expo Router (tabs 템플릿 미사용 시)
npx expo install expo-router react-native-screens expo-linking expo-constants expo-status-bar
```

### 3. NativeWind 초기화

```bash
npx tailwindcss init
```

### 4. 환경 변수

```bash
cp .env
# .env 파일에 EXPO_PUBLIC_TMDB_API_KEY 값 입력
```

### 5. 개발 서버 실행

```bash
# 모바일 (Expo Go)
npx expo start

# 웹
npx expo start --web
```

### 6. Android APK 빌드 (EAS)

```bash
# EAS CLI 설치 (전역)
npm install -g eas-cli

# EAS 로그인 및 초기 설정
eas login
eas build:configure

# APK 빌드 (preview 프로필)
eas build --platform android --profile preview
```

로컬 APK 빌드 (prebuild 후):

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

---

## 명령어 추가 기록

이후 작업에서 사용한 명령어는 위와 같은 형식으로 이 파일에 추가합니다.
