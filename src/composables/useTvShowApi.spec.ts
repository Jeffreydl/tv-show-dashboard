import { ref, type Ref } from 'vue';
import { useGetList, useGetShowById, useSearchShows } from './useTvShowApi.ts';
import * as useFetchModule from './useFetch';
import type { Mock } from 'vitest';

vi.stubEnv('VITE_TVMAZE_API', 'https://api.tvmaze.test');

vi.mock('./useFetch', () => ({
  useFetch: vi.fn(),
}));

const useFetchMock = useFetchModule.useFetch as Mock;

function unwrapUrl(arg: string | Ref<string>): string {
  if (typeof arg === 'object' && arg !== null && 'value' in arg) {
    return arg.value;
  }
  return arg;
}

describe('API Composables', () => {
  beforeEach(() => {
    useFetchMock.mockClear();
  });

  it('useGetList calls useFetch with the correct URL', () => {
    useGetList();
    expect(useFetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/shows');
  });

  it('useGetShowById calls useFetch with show ID and embed params', () => {
    useGetShowById(42);
    expect(useFetchMock).toHaveBeenCalledWith(
      'https://api.tvmaze.com/shows/42?embed[]=cast&embed[]=episodes',
    );
  });

  it('useSearchShows uses a computed URL and passes it to useFetch', () => {
    const showName = ref('Breaking bad');
    useSearchShows(showName);
    const [urlArg] = useFetchMock.mock.calls[0];
    const actualUrl = unwrapUrl(urlArg);
    expect(actualUrl).toBe('https://api.tvmaze.com/search/shows?q=Breaking%20bad');
  });
});
