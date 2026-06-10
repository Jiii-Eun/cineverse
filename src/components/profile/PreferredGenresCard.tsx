import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { Genre } from '@/types/movie';
import type { GenreRank } from '@/utils/genreStats';

interface PreferredGenresCardProps {
  topGenres: GenreRank[];
  genres: Genre[];
}

const RANK_COLOR = '#8B5CF6';
const DIVIDER_COLOR = 'rgba(255, 255, 255, 0.08)';

function getGenreName(genres: Genre[], genreId: number) {
  return genres.find((genre) => genre.id === genreId)?.name ?? '알 수 없음';
}

function GenreRankItem({
  rank,
  name,
  count,
}: {
  rank: number;
  name: string;
  count: number;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="min-w-0 flex-1 flex-row items-center gap-2">
        <Text
          variant="caption"
          className="w-5 font-bold"
          style={{ color: RANK_COLOR, fontWeight: '700' }}
        >
          {rank}
        </Text>
        <Text variant="body" numberOfLines={1}>
          {name}
        </Text>
      </View>
      <Text variant="caption" className="text-muted">
        {count}편
      </Text>
    </View>
  );
}

function GenreColumn({
  items,
  startRank,
  genres,
}: {
  items: GenreRank[];
  startRank: number;
  genres: Genre[];
}) {
  return (
    <View className="min-w-0 flex-1 gap-2">
      {items.map((item, index) => (
        <GenreRankItem
          key={item.genreId}
          rank={startRank + index}
          name={getGenreName(genres, item.genreId)}
          count={item.count}
        />
      ))}
    </View>
  );
}

export function PreferredGenresCard({
  topGenres,
  genres,
}: PreferredGenresCardProps) {
  const leftCount = Math.ceil(topGenres.length / 2);
  const leftItems = topGenres.slice(0, leftCount);
  const rightItems = topGenres.slice(leftCount);

  return (
    <View className="rounded-card bg-card p-4">
      <Text variant="subtitle" className="mb-3">
        선호 장르
      </Text>
      {topGenres.length === 0 ? (
        <Text variant="caption">
          찜·평점·보관 기록이 쌓이면 상위 10개 장르가 표시됩니다.
        </Text>
      ) : (
        <View className="flex-row">
          <GenreColumn items={leftItems} startRank={1} genres={genres} />
          <View
            style={{
              width: 1,
              alignSelf: 'stretch',
              marginHorizontal: 12,
              backgroundColor: DIVIDER_COLOR,
            }}
          />
          <GenreColumn
            items={rightItems}
            startRank={leftCount + 1}
            genres={genres}
          />
        </View>
      )}
    </View>
  );
}
