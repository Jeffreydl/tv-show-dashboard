import { shallowMount } from '@vue/test-utils';
import { ref } from 'vue';
import type { TvShow } from '@/types/tv-show';

const makeShow = (overrides: Partial<TvShow> = {}): Partial<TvShow> => ({
  name: 'Test Show',
  genres: ['Drama', 'Sci-Fi'],
  rating: { average: 8.5 },
  premiered: '2001-01-01',
  ended: '2010-12-31',
  image: {
    medium: 'https://example.com',
    original: 'https://example.com',
  },
  summary: '<p>Epic series</p>',
  ...overrides,
});

async function createWrapper({
  show,
  loading,
  statusCode,
}: {
  show: Partial<TvShow> | null;
  loading: boolean;
  statusCode: number | null;
}) {
  vi.resetModules();

  vi.doMock('vue-router', () => ({
    useRoute: () => ({ params: { id: '123' } }),
  }));

  vi.doMock('@/composables/useTvShowApi', () => ({
    useGetShowById: () => ({
      data: ref(show),
      loading: ref(loading),
      statusCode: ref(statusCode),
      execute: vi.fn(),
    }),
  }));

  vi.doMock('@/composables/useApiErrorHandler', () => ({
    useApiErrorHandler: vi.fn(),
  }));

  const { default: ShowDetails } = await import('./ShowDetails.vue');

  return shallowMount(ShowDetails, {
    global: {
      stubs: {
        EpisodeCarousel: true,
        CastCarousel: true,
        BackToShowsLink: true,
      },
    },
  });
}

describe('ShowDetails', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('renders show details', async () => {
    const wrapper = await createWrapper({
      show: makeShow(),
      loading: false,
      statusCode: null,
    });

    expect(wrapper.text()).toContain('Test Show');
    expect(wrapper.text()).toContain('Drama, Sci-Fi');
    expect(wrapper.text()).toContain('★ 8.5');
    expect(wrapper.text()).toMatch(/Aired:.*–.*\d{4}/);
    expect(wrapper.find('img.poster').attributes('src')).toBe('https://example.com');
    expect(wrapper.find('.summary').html()).toContain('Epic series');
    expect(wrapper.findComponent({ name: 'EpisodeCarousel' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'CastCarousel' }).exists()).toBe(true);
  });

  it('renders "Present" when no ended date and hides image/summary if missing', async () => {
    const wrapper = await createWrapper({
      show: makeShow({ ended: null }),
      loading: false,
      statusCode: null,
    });
    expect(wrapper.text()).toContain('Present');
  });

  it('does not render meta data and poster if they are not available', async () => {
    const wrapper = await createWrapper({
      show: makeShow({
        genres: [],
        rating: { average: null },
        premiered: null,
        image: { medium: '', original: '' },
      }),
      loading: false,
      statusCode: null,
    });
    expect(wrapper.find('.genre').exists()).toBe(false);
    expect(wrapper.find('.rating').exists()).toBe(false);
    expect(wrapper.find('.runtime-range').exists()).toBe(false);
    expect(wrapper.find('img.poster').exists()).toBe(false);
  });

  it('renders loading state', async () => {
    const wrapper = await createWrapper({
      show: null,
      loading: true,
      statusCode: null,
    });

    expect(wrapper.text()).toContain('Loading show details...');
  });

  it('renders 404 message', async () => {
    const wrapper = await createWrapper({
      show: null,
      loading: false,
      statusCode: 404,
    });

    expect(wrapper.text()).toContain('Show not found');
    expect(wrapper.text()).toContain("We couldn't find a show with that ID.");
  });
});
