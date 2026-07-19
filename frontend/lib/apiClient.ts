const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

/**
 * Field-level validation errors as returned by DRF serializers, e.g.
 * `{ "email": ["This field is required."], "non_field_errors": ["..."] }`.
 */
export type ApiFieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ApiFieldErrors;

  constructor(status: number, fieldErrors: ApiFieldErrors, message?: string) {
    super(
      message ??
        ApiError.summarize(fieldErrors) ??
        `Request failed with status ${status}`
    );
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  private static summarize(fieldErrors: ApiFieldErrors): string | undefined {
    const firstKey = Object.keys(fieldErrors)[0];
    return firstKey ? fieldErrors[firstKey]?.[0] : undefined;
  }
}

/**
 * DRF doesn't always return `{ field: string[] }` -- `{"detail": "Not found."}`
 * (404s, permission errors) and similar payloads use a bare string. Normalize
 * everything into `ApiFieldErrors` so callers can always safely index `[0]`
 * for the full message instead of silently getting its first character.
 */
function normalizeFieldErrors(payload: unknown): ApiFieldErrors {
  if (payload === null || payload === undefined) {
    return {};
  }

  if (typeof payload !== 'object') {
    return { non_field_errors: [String(payload)] };
  }

  const normalized: ApiFieldErrors = {};
  for (const [field, value] of Object.entries(
    payload as Record<string, unknown>
  )) {
    const targetField = field === 'detail' ? 'non_field_errors' : field;
    if (Array.isArray(value)) {
      normalized[targetField] = value.map((item) =>
        typeof item === 'string' ? item : String(item)
      );
    } else if (typeof value === 'string') {
      normalized[targetField] = [value];
    } else {
      normalized[targetField] = [String(value)];
    }
  }

  if (Object.keys(normalized).length === 0) {
    normalized.non_field_errors = [String(payload)];
  }

  return normalized;
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  idempotencyKey?: string;
  /** Request-scoped bearer token; never retained by the shared client. */
  authToken?: string;
};

/** Shape returned by DRF's `core.pagination.StandardPagination` for every list endpoint. */
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/**
 * Single, unified fetch-based client for all requests to the Django backend.
 * Centralizes base URL resolution, JSON (de)serialization, auth headers, and
 * DRF error-payload parsing so callers/components never touch `fetch` directly.
 */
class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  private async request<T>(path: string, options: RequestOptions): Promise<T> {
    const { body, idempotencyKey, authToken, headers, ...rest } = options;

    const requestHeaders = new Headers(headers);
    requestHeaders.set('Accept', 'application/json');
    if (body !== undefined) {
      requestHeaders.set('Content-Type', 'application/json');
    }
    if (authToken) {
      requestHeaders.set('Authorization', `Bearer ${authToken}`);
    }
    if (idempotencyKey) {
      requestHeaders.set('Idempotency-Key', idempotencyKey);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    const payload = await response.json().catch(() => undefined);

    if (!response.ok) {
      throw new ApiError(response.status, normalizeFieldErrors(payload));
    }

    return payload as T;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
