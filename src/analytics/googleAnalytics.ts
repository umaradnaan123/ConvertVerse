// GA4 Google Analytics Integration Module

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-CVSEOWORK1';

/**
 * Initializes Google Analytics 4 tracking script dynamically
 */
export function initGA(measurementId: string = GA_MEASUREMENT_ID) {
  if (typeof window === 'undefined') return;

  if (!document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId, { send_page_view: false });
  }
}

/**
 * Tracks pageview events on route navigation
 */
export function trackPageView(pathname: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pathname,
    page_title: title || document.title,
    page_location: window.location.href
  });
}

/**
 * Tracks custom user interactions and tool usages
 */
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
}

/**
 * Tracks conversion completions (file downloads, batch conversions)
 */
export function trackConversion(toolName: string, formatFrom: string, formatTo: string) {
  trackEvent('file_conversion_success', 'Workstation', `${toolName}: ${formatFrom} -> ${formatTo}`);
}

/**
 * Tracks search queries executed in the Tool Search Center
 */
export function trackSearchQuery(query: string) {
  trackEvent('search', 'Navigation', query);
}
