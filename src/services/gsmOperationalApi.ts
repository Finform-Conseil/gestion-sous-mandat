const GSM_PROXY_BASE = '/api/gsm';
const GSM_OPERATIONAL_WRITE_KEY_STORAGE =
  'opcvm-gsm-operational-admin-key-session';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  adminKey?: string | null;
};

export const gsmOperationalUrl = (path = '') =>
  `${GSM_PROXY_BASE}${path.startsWith('/') ? path : `/${path}`}`;

export async function gsmOperationalRequest<T = unknown>(
  path: string,
  { method = 'GET', body, adminKey }: RequestOptions = {}
): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' });

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (adminKey) {
    headers.set('X-Admin-Key', adminKey);
  }

  const response = await fetch(gsmOperationalUrl(path), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });

  const raw = await response.text();
  let payload: unknown = null;

  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    payload = raw;
  }

  if (!response.ok) {
    const detail =
      typeof payload === 'object' &&
      payload !== null &&
      'detail' in payload &&
      typeof (payload as { detail?: unknown }).detail === 'string'
        ? (payload as { detail: string }).detail
        : typeof payload === 'string'
          ? payload
          : `Erreur HTTP ${response.status}`;

    throw new Error(detail);
  }

  return payload as T;
}

export const loadGsmOperationalSnapshot = () =>
  gsmOperationalRequest<{
    clients?: unknown[];
    withdrawalRequests?: unknown[];
    generatedAt?: string;
  }>('/api/snapshot');

export const getGsmOperationalWriteKey = () => {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(GSM_OPERATIONAL_WRITE_KEY_STORAGE) || '';
};

export const setGsmOperationalWriteKey = (value: string) => {
  if (typeof window === 'undefined') return;

  if (value) {
    window.sessionStorage.setItem(GSM_OPERATIONAL_WRITE_KEY_STORAGE, value);
    return;
  }

  window.sessionStorage.removeItem(GSM_OPERATIONAL_WRITE_KEY_STORAGE);
};
