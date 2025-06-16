import { shallowMount } from '@vue/test-utils';
import ShowDashboard from './ShowDashboard.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import SearchResults from '@/components/SearchResults/SearchResults.vue';
import ShowCarousel from '@/components/Carousels/ShowCarousel/ShowCarousel.vue';
import { useSearchShows } from '@/composables/useTvShowApi';
import router from '@/router';
import type { Mock } from 'vitest';

vi.mock('@/composables/useTvShowApi', () => ({
  useGetList: vi.fn(() => ({
    data: [{ id: 1, name: 'A', genres: ['Drama'], rating: { average: 8 } }],
    loading: false,
    statusCode: null,
    execute: vi.fn(),
  })),
  useSearchShows: vi.fn(),
}));
vi.mock('@/router', () => ({
  default: { push: vi.fn() },
}));
vi.mock('@/composables/useApiErrorHandler', () => ({
  useApiErrorHandler: vi.fn(),
}));

function mockUseSearchShows<T = unknown>({
  data = null as T,
  loading = false,
  statusCode = null,
  execute = vi.fn(),
} = {}) {
  (useSearchShows as Mock).mockReturnValue({
    data: { value: data },
    loading,
    statusCode,
    execute,
  });
  return { execute };
}

describe('ShowDashboard', () => {
  let executeSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    executeSearch = vi.fn();
    mockUseSearchShows({ data: null, loading: false, statusCode: null, execute: executeSearch });
  });

  it('renders SearchInput', () => {
    const wrapper = shallowMount(ShowDashboard);
    expect(wrapper.findComponent(SearchInput).exists()).toBe(true);
  });

  it('renders ShowCarousel when there is no search query', () => {
    const wrapper = shallowMount(ShowDashboard);
    expect(wrapper.findComponent(ShowCarousel).exists()).toBe(true);
    expect(wrapper.findComponent(SearchResults).exists()).toBe(false);
  });

  it('renders SearchResults when there is a search query and results', async () => {
    mockUseSearchShows({
      data: [{ show: { id: 2, name: 'Breaking Bad', genres: ['Drama'], rating: { average: 9 } } }],
      loading: false,
    });
    const wrapper = shallowMount(ShowDashboard);

    await wrapper.findComponent(SearchInput).vm.$emit('search', 'Breaking Bad');
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(SearchResults).exists()).toBe(true);
    expect(wrapper.findComponent(ShowCarousel).exists()).toBe(false);
  });

  it('calls executeSearch when onSearch is triggered', async () => {
    const wrapper = shallowMount(ShowDashboard);
    await wrapper.findComponent(SearchInput).vm.$emit('search', 'Ozark');
    expect(executeSearch).toHaveBeenCalled();
  });

  it('does not call executeSearch if search query is empty', async () => {
    const wrapper = shallowMount(ShowDashboard);
    await wrapper.findComponent(SearchInput).vm.$emit('search', '');
    expect(executeSearch).not.toHaveBeenCalled();
  });

  it('navigates to details when onOpenDetails is called', async () => {
    const wrapper = shallowMount(ShowDashboard);
    await wrapper.findComponent(ShowCarousel).vm.$emit('open-details', 123);
    expect(router.push).toHaveBeenCalledWith({ name: 'ShowDetails', params: { id: 123 } });
  });
});
