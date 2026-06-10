import { create } from 'zustand';

interface UiState {
  favorites: number[];
  searchQuery: string;
  toggleFavorite: (movieId: number) => void;
  setSearchQuery: (query: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  favorites: [],
  searchQuery: '',
  toggleFavorite: (movieId) =>
    set((state) => ({
      favorites: state.favorites.includes(movieId)
        ? state.favorites.filter((id) => id !== movieId)
        : [...state.favorites, movieId],
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
