// src/types/pricing.ts

export interface PlanData {
  id: string;
  name: string;
  priceINR: number;
  creditsGiven: number;
  description: string;
  canAccessDeepseekGLM: boolean;
  canAccessMultiModel: boolean;
  canAccessGhostline: boolean;
  canAccessFootprint: boolean;
  canAccessTopup: boolean;
  canSeeInstantNewsSantiments?: boolean;
  canGetAdvanceChartAccess?: boolean;
  creditMultiplier: number | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlansApiResponse {
  success: boolean;
  message: string;
  data: PlanData[];
}
