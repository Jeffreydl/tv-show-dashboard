import { shallowMount } from '@vue/test-utils';
import EpisodeCarousel from './EpisodeCarousel.vue';
import type { Episode } from '@/types/episode';

const makeEpisode = (overrides = {}): Episode =>
  ({
    id: 1,
    name: 'Pilot',
    season: 1,
    number: 1,
    image: { medium: 'https://example.com' },
    rating: { average: 8.3 },
    ...overrides,
  }) as Episode;

const mountWithEpisodes = (episodes: Episode[]) =>
  shallowMount(EpisodeCarousel, {
    props: { episodes },
    global: {
      stubs: {
        BaseCarousel: {
          template: `
            <div class="episode-carousel">
              <slot :item="items[0]"></slot>
            </div>
          `,
          props: ['items', 'title'],
        },
      },
    },
  });

describe('EpisodeCarousel', () => {
  it('does not render BaseCarousel if episodes are missing or empty', () => {
    const wrapper1 = shallowMount(EpisodeCarousel, { props: { episodes: [] } });
    const wrapper2 = shallowMount(EpisodeCarousel);
    expect(wrapper1.find('.episode-carousel').exists()).toBe(false);
    expect(wrapper2.find('.episode-carousel').exists()).toBe(false);
  });

  it('renders episode image if available', () => {
    const wrapper = mountWithEpisodes([makeEpisode()]);
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com');
  });

  it('renders placeholder if image is missing', () => {
    const wrapper = mountWithEpisodes([makeEpisode({ image: null })]);
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.classes()).toContain('placeholder');
  });

  it('renders episode name and metadata', () => {
    const wrapper = mountWithEpisodes([makeEpisode()]);
    expect(wrapper.text()).toContain('Pilot');
    expect(wrapper.text()).toContain('S1 E1');
    expect(wrapper.text()).toContain('★ 8.3');
  });

  it('renders metadata without rating if missing', () => {
    const wrapper = mountWithEpisodes([makeEpisode({ rating: null })]);
    expect(wrapper.text()).toContain('S1 E1');
    expect(wrapper.text()).not.toContain('★');
  });
});
