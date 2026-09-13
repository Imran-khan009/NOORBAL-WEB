/**
 * NOORBAL Commerce Engine — API Client Utility
 *
 * Resolves the appropriate API endpoint URL across:
 * 1. Same-domain full-stack / Netlify Functions (defaults to relative '/api/...')
 * 2. Cross-domain separated deployments (uses VITE_API_BASE_URL or VITE_API_URL if configured)
 */

export function getApiUrl(path: string): string {
  const customBase = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    ''
  ).replace(/\/+$/, '');

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (customBase) {
    return `${customBase}${cleanPath}`;
  }

  return cleanPath;
}

/**
 * Smart resilient API fetcher that:
 * 1. Automatically requests the endpoint with 'Accept: application/json'
 * 2. If a Netlify SPA rewrite incorrectly served index.html (Content-Type: text/html),
 *    transparently retries the direct Netlify function path (/.netlify/functions/api/*)
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const primaryUrl = getApiUrl(path);

  const headers = new Headers(init?.headers || {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const modifiedInit: RequestInit = { ...init, headers };

  let response: Response;
  try {
    response = await fetch(primaryUrl, modifiedInit);
  } catch (netErr) {
    if (path.startsWith('/api') && !primaryUrl.includes('/.netlify/functions/api')) {
      const netlifyFuncPath = path.replace(/^\/api/, '/.netlify/functions/api');
      const fallbackUrl = getApiUrl(netlifyFuncPath);
      return await fetch(fallbackUrl, modifiedInit);
    }
    throw netErr;
  }

  // Detect if server or Netlify CDN SPA fallback returned index.html
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    if (path.startsWith('/api') && !primaryUrl.includes('/.netlify/functions/api')) {
      const netlifyFuncPath = path.replace(/^\/api/, '/.netlify/functions/api');
      const fallbackUrl = getApiUrl(netlifyFuncPath);
      try {
        const fallbackRes = await fetch(fallbackUrl, modifiedInit);
        const fallbackType = fallbackRes.headers.get('content-type') || '';
        // If the direct function returned JSON or an API response, return it
        if (fallbackType.includes('application/json') || (!fallbackType.includes('text/html') && fallbackRes.status !== 200)) {
          return fallbackRes;
        }
      } catch (fbErr) {
        console.warn('Netlify function direct route attempted:', fbErr);
      }
    }
  }

  return response;
}

/**
 * Safely parses response JSON, throwing a descriptive diagnostic error
 * if the server returned HTML (such as an unrouted CDN fallback).
 */
export async function safeJsonFetch<T = any>(
  pathOrUrl: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const response = await apiFetch(pathOrUrl, init);
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
      throw new Error(
        `The server returned an HTML document instead of JSON. Ensure your Netlify Function or backend API is active.`
      );
    }
    try {
      const parsed = JSON.parse(text);
      return { ok: response.ok, status: response.status, data: parsed };
    } catch {
      throw new Error(`Server returned non-JSON response with status ${response.status}`);
    }
  }

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}
