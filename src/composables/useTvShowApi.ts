import { useFetch } from './useFetch';
import { computed } from 'vue';
import type { Ref } from 'vue';

import type { TvShow, TvShowSearchResult } from '@/types/tv-show';

const BASE_URL = import.meta.env.VITE_TVMAZE_API;

export function useGetList() {
  return useFetch<TvShow[]>(`${BASE_URL}/shows`);
}

export function useGetShowById(id: number) {
  return useFetch<TvShow>(`${BASE_URL}/shows/${id}?embed[]=cast&embed[]=episodes`);
}

export function useSearchShows(showName: Ref<string>) {
  const url = computed(() => `${BASE_URL}/search/shows?q=${encodeURIComponent(showName.value)}`);
  return useFetch<TvShowSearchResult[]>(url);
}
