import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import {
  EXPLORE_FILTER_TABS,
  RELEASE_YEAR_OPTIONS,
  RATING_FILTER_OPTIONS,
  type ExploreFilterTab,
} from '@/constants/exploreFilters';
import type { Genre } from '@/types/movie';

export interface ExploreFilterValues {
  genreId: number | null;
  year: number | null;
  ratingMin: number | null;
}

interface ExploreFiltersProps {
  activeTab: ExploreFilterTab;
  onTabChange: (tab: ExploreFilterTab) => void;
  filters: ExploreFilterValues;
  genres: Genre[];
  onGenreChange: (genreId: number | null) => void;
  onYearChange: (year: number | null) => void;
  onRatingChange: (ratingMin: number | null) => void;
  onClearAll: () => void;
}

function FilterTabButton({
  label,
  active,
  hasValue,
  onPress,
}: {
  label: string;
  active: boolean;
  hasValue: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[34px] flex-row items-center gap-1 rounded-button border px-2.5 md:min-h-[40px] md:gap-1.5 md:px-3 ${
        active
          ? 'border-primary bg-primary/15'
          : 'border-white/10 bg-elevated'
      }`}
    >
      <Ionicons
        name="options-outline"
        size={13}
        color={active ? '#8B5CF6' : '#9CA3AF'}
      />
      <Text
        className={`text-xs font-medium md:text-sm ${
          active ? 'text-primary' : 'text-muted'
        }`}
      >
        {label}
      </Text>
      {hasValue ? (
        <View className="h-1.5 w-1.5 rounded-full bg-primary" />
      ) : null}
    </Pressable>
  );
}

function FilterOptionPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[32px] items-center justify-center rounded-chip border px-2.5 md:min-h-[36px] md:px-3 ${
        active
          ? 'border-primary bg-primary/20'
          : 'border-white/10 bg-surface'
      }`}
    >
      <Text
        className={`text-xs md:text-sm ${active ? 'font-semibold text-primary' : 'text-muted'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ActiveFilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={onRemove}
      className="min-h-[38px] flex-row items-center gap-2 rounded-chip border-2 border-violet-300/80 bg-violet-500/45 px-4 py-2.5"
    >
      <Text className="text-sm font-semibold text-white">{label}</Text>
      <Ionicons name="close" size={16} color="#FFFFFF" />
    </Pressable>
  );
}

export function ExploreFilters({
  activeTab,
  onTabChange,
  filters,
  genres,
  onGenreChange,
  onYearChange,
  onRatingChange,
  onClearAll,
}: ExploreFiltersProps) {
  const activeTags: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.genreId) {
    const genre = genres.find((item) => item.id === filters.genreId);
    activeTags.push({
      key: 'genre',
      label: genre?.name ?? '장르',
      onRemove: () => onGenreChange(null),
    });
  }
  if (filters.year) {
    activeTags.push({
      key: 'year',
      label: `${filters.year}년`,
      onRemove: () => onYearChange(null),
    });
  }
  if (filters.ratingMin) {
    activeTags.push({
      key: 'rating',
      label: `${filters.ratingMin}점 이상`,
      onRemove: () => onRatingChange(null),
    });
  }

  const showGenre = activeTab === '전체' || activeTab === '장르';
  const showYear = activeTab === '전체' || activeTab === '개봉연도';
  const showRating = activeTab === '전체' || activeTab === '평점';

  return (
    <View className="border-b border-white/5 pb-4">
      {activeTags.length > 0 ? (
        <View className="mb-3 flex-row flex-wrap items-center gap-2 px-4 md:px-8">
          {activeTags.map((tag) => (
            <ActiveFilterTag
              key={tag.key}
              label={tag.label}
              onRemove={tag.onRemove}
            />
          ))}
          <Pressable onPress={onClearAll} className="px-1 py-1">
            <Text className="text-xs text-muted">전체 해제</Text>
          </Pressable>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-4 md:px-8"
        className="max-w-full"
      >
        {EXPLORE_FILTER_TABS.map((tab) => (
          <FilterTabButton
            key={tab}
            label={tab}
            active={activeTab === tab}
            hasValue={
              (tab === '장르' && filters.genreId !== null) ||
              (tab === '개봉연도' && filters.year !== null) ||
              (tab === '평점' && filters.ratingMin !== null)
            }
            onPress={() => onTabChange(tab)}
          />
        ))}
      </ScrollView>

      <View className="mt-3 w-full px-4 md:px-8">
        <View className="w-full rounded-card border border-white/10 bg-surface/60 p-3 md:p-4">
        {showGenre ? (
          <View className={showYear || showRating ? 'mb-4' : ''}>
            <Text variant="caption" className="mb-2 font-semibold text-foreground">
              장르
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <FilterOptionPill
                label="전체"
                active={filters.genreId === null}
                onPress={() => onGenreChange(null)}
              />
              {genres.map((genre) => (
                <FilterOptionPill
                  key={genre.id}
                  label={genre.name}
                  active={filters.genreId === genre.id}
                  onPress={() =>
                    onGenreChange(
                      filters.genreId === genre.id ? null : genre.id,
                    )
                  }
                />
              ))}
            </View>
          </View>
        ) : null}

        {showYear ? (
          <View className={showRating ? 'mb-4' : ''}>
            <Text variant="caption" className="mb-2 font-semibold text-foreground">
              개봉연도
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
            >
              <FilterOptionPill
                label="전체"
                active={filters.year === null}
                onPress={() => onYearChange(null)}
              />
              {RELEASE_YEAR_OPTIONS.map((option) => (
                <FilterOptionPill
                  key={option.value}
                  label={option.label}
                  active={filters.year === option.value}
                  onPress={() =>
                    onYearChange(
                      filters.year === option.value ? null : option.value,
                    )
                  }
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {showRating ? (
          <View>
            <Text variant="caption" className="mb-2 font-semibold text-foreground">
              평점
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <FilterOptionPill
                label="전체"
                active={filters.ratingMin === null}
                onPress={() => onRatingChange(null)}
              />
              {RATING_FILTER_OPTIONS.map((option) => (
                <FilterOptionPill
                  key={option.value}
                  label={option.label}
                  active={filters.ratingMin === option.value}
                  onPress={() =>
                    onRatingChange(
                      filters.ratingMin === option.value ? null : option.value,
                    )
                  }
                />
              ))}
            </View>
          </View>
        ) : null}
        </View>
      </View>
    </View>
  );
}
