import { Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { Genre, MovieFeedType } from '@/types/movie';

const FEED_OPTIONS: { key: MovieFeedType; label: string }[] = [
  { key: 'now_playing', label: '상영 중' },
  { key: 'popular', label: '인기' },
  { key: 'top_rated', label: '베스트' },
  { key: 'upcoming', label: '예정' },
  { key: 'trending', label: '트렌드' },
];

const GENRE_COLORS = [
  'bg-purple-500/20',
  'bg-blue-500/20',
  'bg-pink-500/20',
  'bg-indigo-500/20',
  'bg-violet-500/20',
  'bg-fuchsia-500/20',
];

interface CategorySidebarProps {
  genres: Genre[];
  selectedFeed: MovieFeedType;
  selectedGenreId: number | null;
  onSelectFeed: (feed: MovieFeedType) => void;
  onSelectGenre: (genreId: number | null) => void;
  gridMode?: boolean;
  compact?: boolean;
}

export function CategorySidebar({
  genres,
  selectedFeed,
  selectedGenreId,
  onSelectFeed,
  onSelectGenre,
  gridMode = false,
  compact = false,
}: CategorySidebarProps) {
  if (gridMode) {
    return (
      <View className="flex-row flex-wrap gap-3 px-4 md:px-8">
        {genres.map((genre, index) => (
          <Pressable
            key={genre.id}
            onPress={() => onSelectGenre(genre.id)}
            className={`min-h-[72px] w-[47%] items-center justify-center rounded-card ${
              GENRE_COLORS[index % GENRE_COLORS.length]
            } ${selectedGenreId === genre.id ? 'border border-primary' : ''}`}
          >
            <Text className="font-semibold text-foreground">{genre.name}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  const itemClass = compact
    ? 'mb-0.5 min-h-[36px] justify-center rounded-md px-2 py-1'
    : 'mb-1 min-h-[44px] justify-center rounded-button px-3 py-2';

  const textClass = compact ? 'text-[11px] leading-4' : 'text-sm';

  return (
    <ScrollView
      className="flex-1 px-2 py-3"
      style={{ flex: 1, minHeight: 0 }}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-4"
    >
      <Text variant="subtitle" className="mb-2 text-xs font-bold">
        카테고리
      </Text>
      {FEED_OPTIONS.map((feed) => (
        <Pressable
          key={feed.key}
          onPress={() => onSelectFeed(feed.key)}
          className={`${itemClass} ${
            !selectedGenreId && selectedFeed === feed.key ? 'bg-primary/25' : ''
          }`}
        >
          <Text
            className={`${textClass} ${
              !selectedGenreId && selectedFeed === feed.key
                ? 'font-semibold text-primary'
                : 'text-muted'
            }`}
            numberOfLines={1}
          >
            {feed.label}
          </Text>
        </Pressable>
      ))}

      <View className="my-2 h-px bg-white/5" />

      <Text variant="caption" className="mb-1.5 text-[11px] font-semibold text-foreground">
        장르
      </Text>
      {genres.map((genre) => (
        <Pressable
          key={genre.id}
          onPress={() => onSelectGenre(genre.id)}
          className={`${itemClass} ${
            selectedGenreId === genre.id ? 'bg-accent/20' : ''
          }`}
        >
          <Text
            className={`${textClass} ${
              selectedGenreId === genre.id
                ? 'font-semibold text-accent'
                : 'text-muted'
            }`}
            numberOfLines={1}
          >
            {genre.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
