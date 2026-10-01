// src/types/wishlist.ts

/**
 * Payload required for joining wishlist via email form.
 */
export interface WishlistEmailPayload {
  name: string;
  email: string;
  recapchaToken: string;
}

/**
 * Structure of standard response from wishlist endpoints.
 */
export interface WishlistApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
