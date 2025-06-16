import { mount } from '@vue/test-utils';
import SearchInput from './SearchInput.vue';

describe('SearchInput', () => {
  it('renders input, label, and search button', () => {
    const wrapper = mount(SearchInput);
    expect(wrapper.find('label.search-label').exists()).toBe(true);
    expect(wrapper.find('input#search-input').exists()).toBe(true);
    expect(wrapper.find('button.search-btn').exists()).toBe(true);
  });

  it('emits search event with query on submit', async () => {
    const wrapper = mount(SearchInput);
    const input = wrapper.find('input#search-input');
    await input.setValue('Breaking bad');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.emitted('search')).toBeTruthy();
    expect(wrapper.emitted('search')![0]).toEqual(['Breaking bad']);
  });

  it('shows clear button only when input has value', async () => {
    const wrapper = mount(SearchInput);
    expect(wrapper.find('button.clear-btn').exists()).toBe(false);

    const input = wrapper.find('input#search-input');
    await input.setValue('Breaking bad');
    expect(wrapper.find('button.clear-btn').exists()).toBe(true);
  });

  it('clear button clears input and emits blank search', async () => {
    const wrapper = mount(SearchInput);
    const input = wrapper.find('input#search-input');
    await input.setValue('Breaking bad');
    const clearBtn = wrapper.find('button.clear-btn');

    await clearBtn.trigger('click');
    expect((input.element as HTMLInputElement).value).toBe('');
    expect(wrapper.emitted('search')).toBeTruthy();
    expect(wrapper.emitted('search')![0]).toEqual(['']);
  });
});
