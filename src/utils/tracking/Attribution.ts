export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  timestamp: number;
}

export function initAttribution(): void {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ];
    const hasUtm = utmKeys.some((key) => urlParams.has(key));
    const currentReferrer = document.referrer || 'direct';

    const currentSession: AttributionData = {
      timestamp: Date.now(),
      referrer: currentReferrer,
    };

    utmKeys.forEach((key) => {
      const val = urlParams.get(key);
      if (val) {
        (currentSession as any)[key] = val;
      }
    });

    // 1. First Touch Attribution (Write once, never overwrite)
    const storedFirst = localStorage.getItem('strat_attr_first');
    if (!storedFirst) {
      localStorage.setItem(
        'strat_attr_first',
        JSON.stringify({
          ...currentSession,
          landing_page: window.location.href,
        })
      );
    }

    // 2. Last Touch Attribution (Overwrite when new campaign params exist)
    if (
      hasUtm ||
      (currentReferrer !== 'direct' &&
        !currentReferrer.includes(window.location.hostname))
    ) {
      localStorage.setItem('strat_attr_last', JSON.stringify(currentSession));
    }
  } catch (err) {
    console.error('Failed to initialize marketing attribution metrics', err);
  }
}

export function getAttribution(): {
  first: AttributionData | null;
  last: AttributionData | null;
} {
  if (typeof window === 'undefined') return { first: null, last: null };
  try {
    const first = localStorage.getItem('strat_attr_first');
    const last = localStorage.getItem('strat_attr_last');
    return {
      first: first ? JSON.parse(first) : null,
      last: last ? JSON.parse(last) : null,
    };
  } catch {
    return { first: null, last: null };
  }
}
