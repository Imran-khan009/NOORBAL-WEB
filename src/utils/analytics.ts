import { AnalyticsEvent } from '../types';

const STORAGE_KEY = 'noorbal_analytics_events';

export function getStoredEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function trackEvent(
  type: AnalyticsEvent['type'],
  details: string,
  extra?: { productId?: string; productName?: string }
): void {
  const newEvent: AnalyticsEvent = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    type,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    details,
    productId: extra?.productId,
    productName: extra?.productName,
  };

  try {
    const current = getStoredEvents();
    const updated = [newEvent, ...current].slice(0, 50); // Keep last 50 events
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time reactivity in UI
    window.dispatchEvent(new CustomEvent('noorbal:analytics_updated'));
  } catch (err) {
    console.warn('Could not store analytics event', err);
  }
}
