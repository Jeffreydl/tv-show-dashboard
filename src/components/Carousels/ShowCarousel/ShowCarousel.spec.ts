import { shallowMount } from '@vue/test-utils';
import ShowCarousel from './ShowCarousel.vue';
import BaseCarousel from '@/components/Carousels/BaseCarousel/BaseCarousel.vue';
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

const mockShows: MinimalTvShow[] = [
  makeShow({ id: 1, name: 'Breaking Bad', genres: ['Drama'], rating: { average: 9 } }),
  makeShow({ id: 2, name: 'Better Call Saul', genres: ['Drama'], rating: { average: 8 } }),
];

const groupedShows = [
  {
    genre: 'Drama',
    shows: mockShows as unknown as TvShow[],
  },
  {
    genre: 'Comedy',
    shows: [
      makeShow({ id: 3, name: 'Brooklyn Nine-Nine', genres: ['Comedy'], rating: { average: 8.5 } }),
    ] as unknown as TvShow[],
  },
];

describe('ShowCarousel', () => {
  it('renders loading message when loading is true', () => {
    const wrapper = shallowMount(ShowCarousel, {
      props: {
        showsByGenre: [],
        loading: true,
      },
    });

    expect(wrapper.text()).toContain('Loading...');
    expect(wrapper.findComponent(BaseCarousel).exists()).toBe(false);
  });

  it('renders BaseCarousel for each genre group when not loading', () => {
    const wrapper = shallowMount(ShowCarousel, {
      props: {
        showsByGenre: groupedShows,
        loading: false,
      },
    });

    const carousels = wrapper.findAllComponents(BaseCarousel);
    expect(carousels).toHaveLength(2);
    expect(carousels[0].props('title')).toBe('Drama');
    expect(carousels[0].props('items')).toEqual(mockShows);
  });

  it('emits open-details when a show is clicked', async () => {
    const wrapper = shallowMount(ShowCarousel, {
      props: {
        showsByGenre: [groupedShows[0]],
        loading: false,
      },
    });

    const baseCarousel = wrapper.findComponent(BaseCarousel);
    await baseCarousel.vm.$emit('item-click', mockShows[0]);

    expect(wrapper.emitted('open-details')).toBeTruthy();
    expect(wrapper.emitted('open-details')![0]).toEqual([mockShows[0].id]);
  });
});
