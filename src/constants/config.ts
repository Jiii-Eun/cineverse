const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const baseUrl = process.env.EXPO_PUBLIC_TMDB_BASE_URL;
const imageBaseUrl = process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL;

if (!apiKey || !baseUrl || !imageBaseUrl) {
  throw new Error(
    'TMDB 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.',
  );
}

export const config = {
  tmdb: {
    apiKey,
    baseUrl,
    imageBaseUrl,
    language: process.env.EXPO_PUBLIC_TMDB_LANGUAGE ?? 'ko-KR',
    region: process.env.EXPO_PUBLIC_TMDB_REGION ?? 'KR',
  },
} as const;
