const configured = import.meta.env.VITE_API_BASE_URL?.trim()
export const apiBaseUrl = configured || '/api'
if (!(apiBaseUrl.startsWith('/') && !apiBaseUrl.startsWith('//')) && !/^https?:\/\//.test(apiBaseUrl)) throw new Error('VITE_API_BASE_URL must be an HTTP(S) URL or same-origin path')

export class ApiError extends Error {
  constructor(message: string, public readonly status: number = 0) { super(message) }
}
/** GET retries are owned by the connection's bounded backoff. Writes are never retried. */
export async function requestApi(path: string, { signal, method='GET', body }: { signal?: AbortSignal; method?: 'GET'|'POST'|'PATCH'; body?: unknown } = {}): Promise<unknown> {
  const controller = new AbortController()
  const cancel = () => controller.abort(signal?.reason)
  if (signal?.aborted) controller.abort(signal.reason)
  else signal?.addEventListener('abort', cancel, { once: true })
  const timeout = setTimeout(() => controller.abort(new Error('API request timed out')), 5000)
  try {
    const response = await fetch(`${apiBaseUrl.replace(/\/$/,'')}${path}`, {
      method, signal: controller.signal, cache: 'no-store', credentials: 'omit',
      headers: body === undefined ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    if (!response.headers.get('content-type')?.includes('application/json')) throw new ApiError('Service returned a non-JSON response', response.status)
    const result: unknown = await response.json()
    if (!response.ok) throw new ApiError(`Demo service request failed (${response.status})`, response.status)
    return result
  } finally { clearTimeout(timeout); signal?.removeEventListener('abort', cancel) }
}
