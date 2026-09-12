import { AnalyticsEvent } from '../types';

/**
 * Client-Side Anonymous Activity Beacon
 * Strictly dispatches privacy-compliant event beacons to the protected server endpoint.
 * Zero analytics or BI metrics are exposed or persisted in client-side storage.
 */
export function trackEvent(
  type: AnalyticsEvent['type'] | string,
  details: string,
  extra?: { productId?: string; productName?: string }
): void {
  try {
    const payload = {
      type,
      details,
      productId: extra?.productId,
      productName: extra?.productName,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      path: typeof window !== 'undefined' ? (window.location.pathname + window.location.hash) : '',
    };

    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/event', blob);
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently — never break customer experience
  }
}

