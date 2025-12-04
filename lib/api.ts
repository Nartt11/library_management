export const API_BASE = 'https://librarymanagementapi-x5bq.onrender.com/api';

export async function apiGet<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const search = params ? new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
  const url = API_BASE + normalizedPath + (search ? `?${search}` : '');

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = API_BASE + normalizedPath;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}