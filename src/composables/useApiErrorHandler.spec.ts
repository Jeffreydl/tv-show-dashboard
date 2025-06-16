import { ref, nextTick } from 'vue';
import { useApiErrorHandler } from './useApiErrorHandler';

const push = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}));

beforeEach(() => {
  push.mockClear();
});

describe('useApiErrorHandler', () => {
  it('redirects on error status code >= 400', async () => {
    const statusCode = ref<number | null>(null);
    useApiErrorHandler(statusCode);

    statusCode.value = 500;
    await nextTick();

    expect(push).toHaveBeenCalledWith({ name: 'Error', params: { code: '500' } });
  });

  it('does not redirect if status code is null', async () => {
    const statusCode = ref<number | null>(null);
    useApiErrorHandler(statusCode);

    statusCode.value = null;
    await nextTick();

    expect(push).not.toHaveBeenCalled();
  });

  it('does not redirect if status code is in ignore list', async () => {
    const statusCode = ref<number | null>(404);
    useApiErrorHandler(statusCode, { ignore: [404] });

    await nextTick();

    expect(push).not.toHaveBeenCalled();
  });

  it('redirects if status code is not in ignore list', async () => {
    const statusCode = ref<number | null>(null);
    useApiErrorHandler(statusCode, { ignore: [404] });

    statusCode.value = 403;
    await nextTick();

    expect(push).toHaveBeenCalledWith({ name: 'Error', params: { code: '403' } });
  });
});
