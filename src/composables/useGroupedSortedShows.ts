import { computed } from 'vue';
import type { Ref } from 'vue';
import type { TvShow } from '@/types/tv-show';

export function groupShowsByGenre(shows: TvShow[] | undefined | null): Record<string, TvShow[]> {
  const grouped: Record<string, TvShow[]> = {};
  if (!shows) return grouped;
  for (const show of shows) {
    const genres = show.genres && show.genres.length > 0 ? show.genres : ['Other'];
    for (const genre of genres) {
      grouped[genre] ??= [];
      grouped[genre].push(show);
    }
  }
  return grouped;
}

export function sortByRatingThenName(a: TvShow, b: TvShow) {
  let ra = Number(a.rating?.average ?? 0);
  let rb = Number(b.rating?.average ?? 0);
  if (isNaN(ra)) ra = 0;
  if (isNaN(rb)) rb = 0;
  if (rb !== ra) return rb - ra;
  return a.name.localeCompare(b.name);
}

export function useGroupedSortedShows(listData: Ref<TvShow[] | undefined | null>) {
  const genreGroups = computed(() => {
    const grouped = groupShowsByGenre(listData.value);

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((genre) => ({
        genre,
        shows: grouped[genre].slice().sort(sortByRatingThenName),
      }));
  });

  return { genreGroups };
}
