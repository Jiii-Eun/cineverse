import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { MovieReview } from '@/types/movie';

interface MovieReviewsSectionProps {
  reviews: MovieReview[];
}

function formatReviewDate(value: string) {
  return value.slice(0, 10).replace(/-/g, '.');
}

export function MovieReviewsSection({ reviews }: MovieReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <View className="gap-3">
      <Text variant="subtitle">리뷰</Text>
      {reviews.slice(0, 5).map((review) => (
        <View key={review.id} className="gap-2 rounded-card bg-card p-4">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-sm font-semibold text-foreground">
              {review.author}
            </Text>
            {review.author_details.rating ? (
              <Text variant="caption" className="text-rating">
                ★ {review.author_details.rating}
              </Text>
            ) : null}
          </View>
          <Text variant="caption">{formatReviewDate(review.created_at)}</Text>
          <Text variant="body" className="leading-6 text-muted" numberOfLines={6}>
            {review.content.trim()}
          </Text>
        </View>
      ))}
    </View>
  );
}
