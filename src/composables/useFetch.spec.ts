import { ref } from 'vue';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  const mockData = { foo: 'bar' };
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('loads and returns data successfully', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const { data, statusCode, loading, execute } =
      useFetch<typeof mockData>('https://api.example.com');

    const promise = execute();
    expect(loading.value).toBe(true);
    await promise;

    expect(loading.value).toBe(false);
    expect(statusCode.value).toBe(null);
    expect(data.value).toEqual(mockData);
  });

  it('handles HTTP error response', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve({}),
    } as Response);

    const { data, statusCode, loading, execute } = useFetch('https://api.example.com');

    await execute();

    expect(loading.value).toBe(false);
    expect(data.value).toBeNull();
    expect(statusCode.value).toBe(404);
  });

  it('handles network error', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network Error'));

    const { data, statusCode, loading, execute } = useFetch('https://api.example.com');

    await execute();

    expect(loading.value).toBe(false);
    expect(data.value).toBeNull();
    expect(statusCode.value).toBe(500);
  });

  it('accepts a reactive ref URL', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const url = ref('https://api.example.com');
    const { data, execute } = useFetch<typeof mockData>(url);

    await execute();

    expect(data.value).toEqual(mockData);
  });
});
