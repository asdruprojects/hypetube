import type { ApiErrorPayload, ApiErrorResponse, ApiSuccess } from '@hypetube/contracts';

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: unknown;

  constructor({ code, message, details, status }: ApiErrorPayload & { status: number }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

export interface ApiClientOptions {
  baseUrl: string;
  /** Permite inyectar un fetch alternativo (tests, SSR, etc.). */
  fetcher?: typeof fetch;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<ApiSuccess<T>>;
  get<T>(path: string, options?: RequestOptions): Promise<ApiSuccess<T>>;
}

/**
 * En el navegador, `localhost` puede resolver a IPv6 (::1) mientras Node escucha
 * solo IPv4. Forzamos 127.0.0.1 para evitar ERR_CONNECTION_REFUSED en Windows.
 */
function normalizeBaseUrl(raw: string): string {
  const cleaned = raw.replace(/\/$/, '');
  if (typeof window === 'undefined') return cleaned;
  try {
    const u = new URL(cleaned);
    if (u.hostname === 'localhost' || u.hostname === '::1' || u.hostname === '[::1]') {
      u.hostname = '127.0.0.1';
      return u.origin;
    }
  } catch {
    /* noop */
  }
  return cleaned;
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const fetcher = options.fetcher ?? fetch.bind(globalThis);

  async function request<T>(path: string, opts: RequestOptions = {}): Promise<ApiSuccess<T>> {
    const { params, body, headers, ...rest } = opts;
    const url = new URL(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') continue;
        url.searchParams.set(key, String(value));
      }
    }

    const hasJsonBody = body !== undefined && body !== null && !(body instanceof FormData);

    const init: RequestInit = {
      ...rest,
      headers: {
        Accept: 'application/json',
        ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...(headers ?? {}),
      },
      body: hasJsonBody ? JSON.stringify(body) : (body as BodyInit | null | undefined),
    };

    let response: Response;
    try {
      response = await fetcher(url.toString(), init);
    } catch (err) {
      throw new ApiError({
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Error de red',
        status: 0,
      });
    }

    if (response.status === 204) {
      return { data: undefined as T };
    }

    const payload = (await response.json().catch(() => null)) as
      | ApiSuccess<T>
      | ApiErrorResponse
      | null;

    if (!response.ok) {
      const errPayload = (payload as ApiErrorResponse | null)?.error;
      throw new ApiError({
        code: errPayload?.code ?? 'UNKNOWN_ERROR',
        message: errPayload?.message ?? response.statusText ?? 'Error inesperado',
        details: errPayload?.details,
        status: response.status,
      });
    }

    return (payload ?? { data: undefined as T }) as ApiSuccess<T>;
  }

  return {
    request,
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  };
}
