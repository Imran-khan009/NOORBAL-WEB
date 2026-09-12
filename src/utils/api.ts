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
 * Safely parses response JSON, throwing a descriptive diagnostic error
 * if the server returned HTML (such as a CDN SPA fallback page).
 */
export async function safeJsonFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const response = await fetch(input, init);
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
      throw new Error(
        `Server returned an HTML document (${response.status}) instead of JSON. The API endpoint may be unrouted or redirected by a static CDN fallback.`
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
