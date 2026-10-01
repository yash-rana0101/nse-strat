// src/types/support.ts

export interface ContactInquiryPayload {
  email: string;
  mobile: string;
  type: string;
}

export interface ContactInquiryResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    mobile: string;
    type: string;
    status: string;
    reply: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
