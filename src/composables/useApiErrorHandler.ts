import { watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';

interface ErrorHandlerOptions {
  ignore?: number[];
}

export function useApiErrorHandler(
  statusCodeRef: Ref<number | null>,
  options: ErrorHandlerOptions = {},
) {
  const router = useRouter();

  watch(statusCodeRef, (code) => {
    if (!code) return;

    if (options.ignore?.includes(code)) return;

    if (code >= 400) {
      router.push({ name: 'Error', params: { code: String(code) } });
    }
  });
}
