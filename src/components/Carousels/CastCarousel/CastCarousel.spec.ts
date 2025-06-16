import { shallowMount } from '@vue/test-utils';
import CastCarousel from './CastCarousel.vue';
import type { CastMember } from '@/types/cast-member';

const makeCastMember = (overrides = {}) =>
  ({
    person: {
      name: 'John Doe',
      image: { medium: 'https://example.com' },
    },
    character: {
      name: 'Hero',
    },
    ...overrides,
  }) as CastMember;

describe('CastCarousel', () => {
  const mountWithCast = (cast: CastMember[]) =>
    shallowMount(CastCarousel, {
      props: { cast },
      global: {
        stubs: {
          BaseCarousel: {
            template: `
              <div class="cast-carousel">
                <slot :item="items[0]"></slot>
              </div>
            `,
            props: ['items', 'title'],
          },
        },
      },
    });

  it('does not render BaseCarousel if cast is empty or undefined', () => {
    const wrapper1 = shallowMount(CastCarousel, { props: { cast: [] } });
    const wrapper2 = shallowMount(CastCarousel);
    expect(wrapper1.find('.cast-carousel').exists()).toBe(false);
    expect(wrapper2.find('.cast-carousel').exists()).toBe(false);
  });

  it('renders image if available', () => {
    const wrapper = mountWithCast([makeCastMember()]);
    const img = wrapper.find('img.cast-thumbnail');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com');
  });

  it('renders placeholder image if image is missing', () => {
    const wrapper = mountWithCast([makeCastMember({ person: { name: 'Jane Doe', image: null } })]);

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.classes()).toContain('placeholder');
  });

  it('renders person and character names', () => {
    const wrapper = mountWithCast([makeCastMember()]);
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Hero');
  });
});
