import { ref, shallowRef, unref } from 'vue';
import type { Ref } from 'vue';

export class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function useFetch<T = unknown>(url: string | Ref<string>) {
  const data = shallowRef<T | null>(null);
  const statusCode = ref<number | null>(null);
  const loading = ref(false);

  async function execute() {
    loading.value = true;
    statusCode.value = null;

    try {
      const urlValue = unref(url);
      const res = await fetch(urlValue);

      if (!res.ok) {
        throw new FetchError(res.statusText, res.status);
      }

      const json = await res.json();
      data.value = json;
    } catch (e) {
      statusCode.value = e instanceof FetchError ? e.status : 500;
      data.value = null;
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    statusCode,
    loading,
    execute,
  };
}
