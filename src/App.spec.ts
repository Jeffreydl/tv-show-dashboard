import { shallowMount } from '@vue/test-utils';
import App from './App.vue';
import AppHeader from '@/components/AppHeader/AppHeader.vue';

it('renders header and main layout', () => {
  const wrapper = shallowMount(App, {
    global: {
      stubs: ['router-view'],
    },
  });
  expect(wrapper.findComponent(AppHeader).exists()).toBe(true);
  expect(wrapper.find('main.app-main').exists()).toBe(true);
});
