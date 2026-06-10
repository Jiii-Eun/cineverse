import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, { Layout } from 'react-native-reanimated';

import { MovieCard } from '@/components/movie/MovieCard';
import {
  getInitialMovieGridColumns,
  resolveMovieGridColumns,
} from '@/constants/layout';
import { useContentBottomPadding } from '@/hooks/useContentBottomPadding';
import type { Movie } from '@/types/movie';

interface MovieGridProps {
  movies: Movie[];
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  ListHeaderComponent?: React.ReactElement | null;
  embedded?: boolean;
  withTabBarPadding?: boolean;
  listId?: number;
  onRemoveFromList?: (movieId: number) => void;
  isRemovingFromList?: boolean;
}

const GRID_GAP = 12;

/** 열 증가·화면 확대 시에만 재배치 애니메이션 */
const GRID_LAYOUT_EXPAND = Layout.duration(360).springify().damping(20).stiffness(120);

function calcItemWidth(
  containerWidth: number,
  horizontalPadding: number,
  numColumns: number,
) {
  if (containerWidth <= 0 || numColumns <= 0) return 0;

  const available =
    containerWidth - horizontalPadding * 2 - GRID_GAP * (numColumns - 1);

  return Math.floor(available / numColumns);
}

/**
 * 축소·열 감소 시 애니메이션 없음 — Reanimated width 보간이 flex-wrap을 깨뜨림
 */
function useGridLayoutAnimation(numColumns: number, containerWidth: number) {
  const prevNumColumnsRef = useRef(numColumns);
  const prevContainerWidthRef = useRef(0);

  const colsChanged = prevNumColumnsRef.current !== numColumns;
  const isExpanding = colsChanged && numColumns > prevNumColumnsRef.current;
  const isContainerShrinking =
    containerWidth > 0 &&
    prevContainerWidthRef.current > 0 &&
    containerWidth < prevContainerWidthRef.current;

  useLayoutEffect(() => {
    prevNumColumnsRef.current = numColumns;
    if (containerWidth > 0) {
      prevContainerWidthRef.current = containerWidth;
    }
  }, [numColumns, containerWidth]);

  if (isContainerShrinking || !isExpanding) return undefined;
  return GRID_LAYOUT_EXPAND;
}

function useStableGridColumns(viewportWidth: number, containerWidth: number) {
  const colsRef = useRef(getInitialMovieGridColumns(viewportWidth));

  if (containerWidth > 0) {
    colsRef.current = resolveMovieGridColumns(containerWidth, colsRef.current);
  }

  return colsRef.current;
}

function GridMovieItem({
  movie,
  itemWidth,
  layoutAnimation,
  listId,
  onRemoveFromList,
  isRemovingFromList,
}: {
  movie: Movie;
  itemWidth: number;
  layoutAnimation?: typeof GRID_LAYOUT_EXPAND;
  listId?: number;
  onRemoveFromList?: (movieId: number) => void;
  isRemovingFromList?: boolean;
}) {
  const style = {
    width: itemWidth,
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 0,
  };

  const content = (
    <MovieCard
      movie={movie}
      listId={listId}
      onRemoveFromList={onRemoveFromList}
      isRemovingFromList={isRemovingFromList}
    />
  );

  if (!layoutAnimation) {
    return <View style={style}>{content}</View>;
  }

  return (
    <Animated.View layout={layoutAnimation} style={style}>
      {content}
    </Animated.View>
  );
}

function MovieGridContent({
  movies,
  containerWidth,
  horizontalPadding,
  numColumns,
  listId,
  onRemoveFromList,
  isRemovingFromList,
}: {
  movies: Movie[];
  containerWidth: number;
  horizontalPadding: number;
  numColumns: number;
  listId?: number;
  onRemoveFromList?: (movieId: number) => void;
  isRemovingFromList?: boolean;
}) {
  const layoutAnimation = useGridLayoutAnimation(numColumns, containerWidth);
  const itemWidth = calcItemWidth(
    containerWidth,
    horizontalPadding,
    numColumns,
  );

  if (itemWidth <= 0) return null;

  return (
    <View
      className="w-full"
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GRID_GAP,
        paddingHorizontal: horizontalPadding,
        width: '100%',
      }}
    >
      {movies.map((movie) => (
        <GridMovieItem
          key={movie.id}
          movie={movie}
          itemWidth={itemWidth}
          layoutAnimation={layoutAnimation}
          listId={listId}
          onRemoveFromList={onRemoveFromList}
          isRemovingFromList={isRemovingFromList}
        />
      ))}
    </View>
  );
}

export function MovieGrid({
  movies,
  onEndReached,
  isFetchingNextPage,
  ListHeaderComponent,
  embedded = false,
  withTabBarPadding = true,
  listId,
  onRemoveFromList,
  isRemovingFromList = false,
}: MovieGridProps) {
  const { width: viewportWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const contentBottomPadding = useContentBottomPadding(withTabBarPadding);
  const bottomPadding = embedded ? 24 : contentBottomPadding;
  const horizontalPadding = embedded ? 4 : 16;

  const numColumns = useStableGridColumns(viewportWidth, containerWidth);
  const layoutAnimation = useGridLayoutAnimation(numColumns, containerWidth);
  const itemWidth = calcItemWidth(
    containerWidth,
    horizontalPadding,
    numColumns,
  );

  const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setContainerWidth((prev) => (prev === nextWidth ? prev : nextWidth));
  }, []);

  const footer = isFetchingNextPage ? (
    <View className="py-4">
      <View className="h-6" />
    </View>
  ) : null;

  const renderItem = ({ item }: { item: Movie }) => (
    <GridMovieItem
      movie={item}
      itemWidth={itemWidth}
      layoutAnimation={layoutAnimation}
      listId={listId}
      onRemoveFromList={onRemoveFromList}
      isRemovingFromList={isRemovingFromList}
    />
  );

  if (embedded) {
    return (
      <View className="w-full web:overflow-visible" onLayout={onContainerLayout}>
        {ListHeaderComponent}
        {containerWidth > 0 ? (
          <MovieGridContent
            movies={movies}
            containerWidth={containerWidth}
            horizontalPadding={horizontalPadding}
            numColumns={numColumns}
            listId={listId}
            onRemoveFromList={onRemoveFromList}
            isRemovingFromList={isRemovingFromList}
          />
        ) : null}
        {footer}
      </View>
    );
  }

  return (
    <View
      className="min-h-0 w-full flex-1"
      onLayout={onContainerLayout}
      style={{ flex: 1, minHeight: 0 }}
    >
      {containerWidth > 0 && itemWidth > 0 ? (
        <FlatList
          data={movies}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          className="movie-grid-scroll flex-1"
          style={{ flex: 1, minHeight: 0 }}
          ListHeaderComponent={ListHeaderComponent}
          columnWrapperStyle={{
            gap: GRID_GAP,
            paddingHorizontal: horizontalPadding,
          }}
          contentContainerStyle={{
            paddingBottom: bottomPadding,
            paddingTop: 4,
          }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={footer}
        />
      ) : null}
    </View>
  );
}
