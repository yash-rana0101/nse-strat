// src/services/wishlist.ts
import type {
  WishlistEmailPayload,
  WishlistApiResponse,
} from '@/types/wishlist';

const apiUrl =
  import.meta.env.PUBLIC_WEB_API_URL || 'https://api-web.stratai.live/api/v1';

/**
 * Submit email waitlist details to the API.
 */
export async function joinWishlistWithEmail(
  payload: WishlistEmailPayload
): Promise<WishlistApiResponse> {
  const response = await fetch(`${apiUrl}/wishlist/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Server returned ${response.status} status code`
    );
  }

  const json = (await response.json()) as WishlistApiResponse;

  if (json && json.success) {
    return json;
  }

  throw new Error(json?.message || 'Failed to join waitlist');
}

/**
 * Submit Google OAuth auth code to the API.
 */
export async function joinWishlistWithGoogle(
  code: string
): Promise<WishlistApiResponse> {
  const response = await fetch(
    `${apiUrl}/wishlist/google?code=${encodeURIComponent(code)}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Server returned ${response.status} status code`
    );
  }

  const json = (await response.json()) as WishlistApiResponse;

  if (json && json.success) {
    return json;
  }

  throw new Error(json?.message || 'Failed to join waitlist with Google');
}
