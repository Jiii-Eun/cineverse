import { create } from 'zustand';

import type { Genre, MovieFeedType } from '@/types/movie';

interface UiState {
  selectedFeed: MovieFeedType;
  selectedGenreId: number | null;
  genres: Genre[];
  mobileMenuOpen: boolean;
  desktopAsideOpen: boolean;
  setSelectedFeed: (feed: MovieFeedType) => void;
  setSelectedGenreId: (genreId: number | null) => void;
  setGenres: (genres: Genre[]) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setDesktopAsideOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedFeed: 'now_playing',
  selectedGenreId: null,
  genres: [],
  mobileMenuOpen: false,
  desktopAsideOpen: true,
  setSelectedFeed: (feed) => set({ selectedFeed: feed, selectedGenreId: null }),
  setSelectedGenreId: (genreId) => set({ selectedGenreId: genreId }),
  setGenres: (genres) => set({ genres }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setDesktopAsideOpen: (open) => set({ desktopAsideOpen: open }),
}));

export function useGenreName(genreIds: number[]) {
  const genres = useUiStore((s) => s.genres);
  return genreIds
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .join(', ');
}
