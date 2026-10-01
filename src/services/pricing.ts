// src/services/pricing.ts
import type { PlansApiResponse, PlanData } from '@/types/pricing';

/**
 * Service to fetch pricing plans from Heroku backend API.
 * Includes fallback logic to static plans to ensure compile-time robustness.
 */
export async function fetchPlans(): Promise<PlanData[]> {
  const apiUrl =
    import.meta.env.PUBLIC_WEB_API_URL || 'https://api-web.stratai.live/api/v1';

  try {
    const response = await fetch(`${apiUrl}/plans/`, {
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = (await response.json()) as PlansApiResponse;

    // An empty list is treated the same as an outage: shipping a pricing page
    // (or /pricing.md) with no prices is worse than shipping the known plans.
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      // Sort plans by price to ensure Basic -> Pro -> Maxx ordering
      return json.data.sort((a, b) => a.priceINR - b.priceINR);
    }

    throw new Error(json.message || 'Failed to fetch plans');
  } catch (error) {
    console.error('[PricingService] Error fetching plans from API:', error);

    // Fallback static plans to safeguard builds against endpoint outages
    return [
      {
        id: '9cc931dc-3862-4315-a882-af48d125311e',
        name: 'basic',
        priceINR: 3000,
        creditsGiven: 10,
        description: 'Basic plan with Strat AI Co-Pilot research loop access',
        canAccessDeepseekGLM: true,
        canAccessMultiModel: false,
        canAccessGhostline: false,
        canAccessFootprint: false,
        canAccessTopup: false,
        canSeeInstantNewsSantiments: true,
        canGetAdvanceChartAccess: true,
        creditMultiplier: null,
        deletedAt: null,
        createdAt: '2026-07-15T09:39:29.510Z',
        updatedAt: '2026-07-15T09:39:29.510Z',
      },
      {
        id: 'aba6d8a6-c14f-4c01-9aa0-221196e1e5f4',
        name: 'pro',
        priceINR: 6000,
        creditsGiven: 20,
        description:
          'Pro plan with Multi-Agent DEBATE, Trajectory projections, and Top-ups',
        canAccessDeepseekGLM: true,
        canAccessMultiModel: true,
        canAccessGhostline: true,
        canAccessFootprint: false,
        canAccessTopup: true,
        canSeeInstantNewsSantiments: true,
        canGetAdvanceChartAccess: true,
        creditMultiplier: null,
        deletedAt: null,
        createdAt: '2026-07-15T09:39:30.035Z',
        updatedAt: '2026-07-15T09:39:30.035Z',
      },
      {
        id: '7efb4894-1192-4c22-be2d-96685f53f1a6',
        name: 'maxx',
        priceINR: 10000,
        creditsGiven: 40,
        description:
          'Maxx plan with Footprint charts and complete research suite',
        canAccessDeepseekGLM: true,
        canAccessMultiModel: true,
        canAccessGhostline: true,
        canAccessFootprint: true,
        canAccessTopup: true,
        canSeeInstantNewsSantiments: true,
        canGetAdvanceChartAccess: true,
        creditMultiplier: null,
        deletedAt: null,
        createdAt: '2026-07-15T09:39:30.288Z',
        updatedAt: '2026-07-15T09:39:30.288Z',
      },
    ];
  }
}
