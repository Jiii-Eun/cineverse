const currentYear = new Date().getFullYear();

export const EXPLORE_FILTER_TABS = ['전체', '장르', '개봉연도', '평점'] as const;
export type ExploreFilterTab = (typeof EXPLORE_FILTER_TABS)[number];

export const RELEASE_YEAR_OPTIONS = Array.from({ length: 30 }, (_, index) => ({
  label: String(currentYear - index),
  value: currentYear - index,
}));

export const RATING_FILTER_OPTIONS = [
  { label: '9점 이상', value: 9 },
  { label: '8점 이상', value: 8 },
  { label: '7점 이상', value: 7 },
  { label: '6점 이상', value: 6 },
  { label: '5점 이상', value: 5 },
] as const;
