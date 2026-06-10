import * as Linking from 'expo-linking';

import type { Account, RequestTokenResponse, SessionResponse } from '@/types/movie';

import { tmdbFetch, tmdbPost, tmdbDelete } from './client';

const TMDB_SIGNUP_URL = 'https://www.themoviedb.org/signup';

export function getSignupUrl() {
  return TMDB_SIGNUP_URL;
}

export function getAuthRedirectUrl() {
  const override = process.env.EXPO_PUBLIC_AUTH_CALLBACK_URL?.trim();
  if (override) return override;

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/auth/callback`;
  }
  return Linking.createURL('/auth/callback');
}

/** TMDB는 redirect_to에 localhost/127.0.0.1을 넣으면 CloudFront 403을 반환합니다. */
export function requiresManualAuthCallback() {
  return /localhost|127\.0\.0\.1/i.test(getAuthRedirectUrl());
}

export function getTmdbAuthUrl(requestToken: string) {
  const callbackUrl = getAuthRedirectUrl();

  if (requiresManualAuthCallback()) {
    return `https://www.themoviedb.org/authenticate/${requestToken}`;
  }

  return `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent(callbackUrl)}`;
}

export async function createRequestToken(): Promise<RequestTokenResponse> {
  return tmdbFetch<RequestTokenResponse>({ path: '/authentication/token/new' });
}

export async function createSession(
  requestToken: string,
): Promise<SessionResponse> {
  return tmdbPost<SessionResponse>(
    { path: '/authentication/session/new' },
    { request_token: requestToken },
  );
}

export async function deleteSession(sessionId: string) {
  return tmdbDelete<{ success: boolean }>(
    { path: '/authentication/session' },
    { session_id: sessionId },
  );
}

export async function fetchAccount(sessionId: string): Promise<Account> {
  return tmdbFetch<Account>({
    path: '/account',
    sessionId,
  });
}

export async function openTmdbAuth(requestToken: string) {
  const url = getTmdbAuthUrl(requestToken);

  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  await Linking.openURL(url);
}
