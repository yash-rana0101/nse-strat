// src/services/support.ts
import type {
  ContactInquiryPayload,
  ContactInquiryResponse,
} from '@/types/support';

/**
 * Service to submit contact inquiries to the support API.
 */
export async function submitContactInquiry(
  payload: ContactInquiryPayload
): Promise<ContactInquiryResponse> {
  const apiUrl =
    import.meta.env.PUBLIC_WEB_API_URL || 'https://api-web.stratai.live/api/v1';

  const response = await fetch(`${apiUrl}/support/contact`, {
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

  const json = (await response.json()) as ContactInquiryResponse;

  if (json && json.success) {
    return json;
  }

  throw new Error(json?.message || 'Failed to submit contact inquiry');
}
