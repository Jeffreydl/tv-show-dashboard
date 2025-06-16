import { ref, nextTick, type Ref } from 'vue';
import {
  groupShowsByGenre,
  sortByRatingThenName,
  useGroupedSortedShows,
} from './useGroupedSortedShows';
import type { TvShow } from '@/types/tv-show';

type MinimalTvShow = Pick<TvShow, 'id' | 'name' | 'genres' | 'rating'>;

function makeShow(overrides: Partial<MinimalTvShow>): MinimalTvShow {
  return {
    id: 1,
    name: '',
    genres: [],
    rating: { average: 0 },
    ...overrides,
  };
}

describe('groupShowsByGenre', () => {
  it('groups shows by each genre', () => {
    const shows: MinimalTvShow[] = [
      makeShow({ name: 'A', genres: ['Drama', 'Comedy'], rating: { average: 8 } }),
      makeShow({ name: 'B', genres: ['Drama'], rating: { average: 7 } }),
      makeShow({ name: 'C', genres: [], rating: { average: 9 } }),
    ];
    const grouped = groupShowsByGenre(shows as unknown as TvShow[]);
    expect(grouped).toHaveProperty('Drama');
    expect(grouped).toHaveProperty('Comedy');
    expect(grouped).toHaveProperty('Other');
    expect(grouped['Drama'].length).toBe(2);
    expect(grouped['Comedy'].length).toBe(1);
    expect(grouped['Other'].length).toBe(1);
    expect(grouped['Other'][0].name).toBe('C');
  });

  it('returns empty object for null or undefined', () => {
    expect(groupShowsByGenre(null)).toEqual({});
    expect(groupShowsByGenre(undefined)).toEqual({});
  });
});

describe('sortByRatingThenName', () => {
  it('sorts by rating descending then name ascending', () => {
    const shows: MinimalTvShow[] = [
      makeShow({ name: 'B', rating: { average: 8 } }),
      makeShow({ name: 'A', rating: { average: 9 } }),
      makeShow({ name: 'C', rating: { average: 8 } }),
    ];
    const sorted = (shows as unknown as TvShow[]).slice().sort(sortByRatingThenName);
    expect(sorted.map((s) => s.name)).toEqual(['A', 'B', 'C']);
  });

  it('handles missing ratings as zero and invalid strings as zero', () => {
    const shows: MinimalTvShow[] = [
      makeShow({ name: 'C', rating: { average: 'n/a' as unknown as number | null } }),
      makeShow({ name: 'B', rating: {} as { average: number | null } }),
      makeShow({ name: 'A', rating: { average: 3 } }),
    ];
    const sorted = (shows as unknown as TvShow[]).slice().sort(sortByRatingThenName);
    expect(sorted.map((s) => s.name)).toEqual(['A', 'B', 'C']);
  });
});

describe('useGroupedSortedShows', () => {
  it('produces alphabetically sorted genres with sorted shows', async () => {
    const shows: MinimalTvShow[] = [
      makeShow({ name: 'A', genres: ['Comedy'], rating: { average: 7 } }),
      makeShow({ name: 'C', genres: ['Drama'], rating: { average: 8 } }),
      makeShow({ name: 'B', genres: ['Comedy'], rating: { average: 9 } }),
    ];
    const listData = ref(shows as unknown as TvShow[]);

    const { genreGroups } = useGroupedSortedShows(listData);

    await nextTick();

    expect(genreGroups.value.map((g) => g.genre)).toEqual(['Comedy', 'Drama']);
    expect(genreGroups.value[0].shows.map((s) => s.name)).toEqual(['B', 'A']);
    expect(genreGroups.value[1].shows.map((s) => s.name)).toEqual(['C']);
  });

  it('reacts to changing listData', async () => {
    const listData = ref<MinimalTvShow[]>([]);
    const { genreGroups } = useGroupedSortedShows(listData as Ref<TvShow[] | undefined | null>);

    expect(genreGroups.value.length).toBe(0);

    listData.value = [
      makeShow({ name: 'X', genres: ['Anime'], rating: { average: 10 } }),
      makeShow({ name: 'Y', genres: [], rating: { average: 4 } }),
    ];
    await nextTick();

    expect(genreGroups.value[0].genre).toBe('Anime');
    expect(genreGroups.value[1].genre).toBe('Other');
    expect(genreGroups.value[0].shows[0].name).toBe('X');
    expect(genreGroups.value[1].shows[0].name).toBe('Y');
  });

  it('handles null or undefined input', () => {
    const listData = ref(null);
    const { genreGroups } = useGroupedSortedShows(listData);
    expect(genreGroups.value).toEqual([]);
  });
});
