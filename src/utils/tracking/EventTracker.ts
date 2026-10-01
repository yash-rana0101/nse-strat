export function trackCustomEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Google Tag Manager DataLayer
    const dataLayer = (window as any).dataLayer || [];
    dataLayer.push({
      event: eventName,
      ...eventParams,
    });
    (window as any).dataLayer = dataLayer;

    // 2. Google Analytics 4 (gtag)
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, eventParams);
    }

    // 3. Meta Pixel (fbq)
    if (typeof (window as any).fbq === 'function') {
      const standardMetaEvents: Record<string, string> = {
        page_view: 'PageView',
        view_content: 'ViewContent',
        lead: 'Lead',
        signup: 'CompleteRegistration',
        contact: 'Contact',
      };
      const metaEvent = standardMetaEvents[eventName] || 'Custom';
      if (metaEvent === 'Custom') {
        (window as any).fbq('trackCustom', eventName, eventParams);
      } else {
        (window as any).fbq('track', metaEvent, eventParams);
      }
    }

    // 4. Microsoft Advertising (UET)
    if (
      typeof (window as any).uetq === 'object' &&
      Array.isArray((window as any).uetq)
    ) {
      (window as any).uetq.push('event', eventName, eventParams || {});
    }

    // 5. Reddit Pixel (rdt)
    if (typeof (window as any).rdt === 'function') {
      const standardRedditEvents: Record<string, string> = {
        lead: 'Lead',
        signup: 'SignUp',
        page_view: 'PageVisit',
      };
      const redditEvent = standardRedditEvents[eventName] || 'Custom';
      (window as any).rdt('track', redditEvent, eventParams || {});
    }

    // 6. X (Twitter) Ads Pixel (twq)
    if (typeof (window as any).twq === 'function') {
      (window as any).twq('track', eventName, eventParams || {});
    }
  } catch (err) {
    console.error('Failed to log analytics event:', eventName, err);
  }
}

// Helper to track CTA button clicks
export function trackCTA(ctaName: string, label: string): void {
  trackCustomEvent('cta_click', {
    cta_name: ctaName,
    cta_label: label,
  });
}
