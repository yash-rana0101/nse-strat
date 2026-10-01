export function initPerformanceTracker(): void {
  if (typeof window === 'undefined') return;

  // 1. Listen for Unhandled Javascript Errors
  window.addEventListener('error', (event) => {
    dispatchPerformanceMetric('js_error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack || '',
    });
  });

  // 2. Track Web Vitals (LCP, CLS, FID)
  try {
    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      dispatchPerformanceMetric('CLS', { value: clsValue });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      dispatchPerformanceMetric('LCP', { value: lastEntry.startTime });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const delay = (entry as any).processingStart - entry.startTime;
        dispatchPerformanceMetric('FID', { value: delay });
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Time to First Byte (TTFB)
    window.addEventListener('load', () => {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const navTiming = navEntries[0] as PerformanceNavigationTiming;
        dispatchPerformanceMetric('TTFB', { value: navTiming.responseStart });
      }
    });
  } catch (err) {
    console.warn(
      'PerformanceObserver metrics are partially supported in this browser',
      err
    );
  }
}

function dispatchPerformanceMetric(
  metricName: string,
  data: Record<string, any>
): void {
  if (typeof window === 'undefined') return;
  const dataLayer = (window as any).dataLayer || [];
  dataLayer.push({
    event: 'core_web_vital',
    vital_metric: metricName,
    vital_data: data,
  });
  (window as any).dataLayer = dataLayer;
}
