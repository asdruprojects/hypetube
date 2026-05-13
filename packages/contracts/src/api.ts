/**
 * Sobre estructurada que devuelven los interceptores del backend.
 * Mantener este shape sincronizado con `ResponseInterceptor` y
 * `HttpExceptionFilter` en apps/api.
 */
export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiErrorPayload;
}
