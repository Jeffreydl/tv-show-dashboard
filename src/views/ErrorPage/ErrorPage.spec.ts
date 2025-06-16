import { shallowMount } from '@vue/test-utils';
import ErrorPage from './ErrorPage.vue';
import { useRoute } from 'vue-router';
import type { Mock } from 'vitest';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
  },
}));

describe('ErrorPage', () => {
  const mountWithCode = (code: string | undefined) => {
    (useRoute as Mock).mockReturnValue({
      params: { code },
    });

    return shallowMount(ErrorPage, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a class="router-link-stub" :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });
  };

  it.each([
    ['400', 'Bad Request – something went wrong with your request.'],
    ['401', 'Unauthorized – please log in to continue.'],
    ['403', 'Forbidden – you do not have permission to access this page.'],
    ['404', 'Page not found – the page you’re looking for doesn’t exist.'],
    ['500', 'Internal Server Error – something went wrong on our side.'],
    ['502', 'Bad Gateway – received an invalid response from the upstream server.'],
    ['503', 'Service Unavailable – the server is currently overloaded or under maintenance.'],
    ['504', 'Gateway Timeout – the server took too long to respond.'],
    ['999', 'An unexpected error occurred.'],
    [undefined, 'An unexpected error occurred.'],
  ])('renders correct message for error code %s', (code, expectedMessage) => {
    const wrapper = mountWithCode(code);
    expect(wrapper.text()).toContain(code ?? 'Unknown');
    expect(wrapper.text()).toContain(expectedMessage);
  });
});
