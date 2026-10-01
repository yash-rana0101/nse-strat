// src/utils/agent/actionTools.ts
/**
 * Write WebMCP tools.
 *
 * These submit data on the user's behalf, so each carries `readOnlyHint: false`
 * to signal that an agent should confirm before calling.
 *
 * They drive the page's real form rather than calling the API directly. That
 * reuses the existing validation, reCAPTCHA, success and error handling, keeps
 * the user looking at the same feedback a human submitter would see, and means
 * there is only one submission path to maintain.
 */
import type { ToolArguments, WebMcpTool } from '@/types/agent';
import { INQUIRY_TYPES, SITE_URL } from '@/constants/agent';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OUTCOME_TIMEOUT_MS = 20000;
const POLL_INTERVAL_MS = 150;

interface FormOutcomeSelectors {
  form: string;
  success: string;
  error: string;
  errorText: string;
}

function readString(args: ToolArguments, key: string): string {
  const value = args[key];
  return typeof value === 'string' ? value.trim() : '';
}

function isVisible(selector: string): boolean {
  const element = document.querySelector(selector);
  return (
    element instanceof HTMLElement && !element.classList.contains('hidden')
  );
}

/** Set a field's value and fire the events the page's own listeners expect. */
function setField(selector: string, value: string): boolean {
  const field = document.querySelector(selector);
  if (
    !(field instanceof HTMLInputElement) &&
    !(field instanceof HTMLSelectElement) &&
    !(field instanceof HTMLTextAreaElement)
  ) {
    return false;
  }

  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

/** Poll for the form's own success or error state to appear. */
async function waitForOutcome(
  selectors: FormOutcomeSelectors,
  signal?: AbortSignal
): Promise<string> {
  const deadline = Date.now() + OUTCOME_TIMEOUT_MS;

  while (Date.now() < deadline) {
    if (signal?.aborted) return 'Submission was cancelled before it completed.';

    if (isVisible(selectors.success)) return '';

    if (isVisible(selectors.error)) {
      const node = document.querySelector(selectors.errorText);
      const message = node?.textContent?.trim();
      return message && message.length > 0
        ? message
        : 'The form reported an error.';
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return 'Timed out waiting for the form to confirm the submission.';
}

function submitForm(selector: string): boolean {
  const form = document.querySelector(selector);
  if (!(form instanceof HTMLFormElement)) return false;

  form.requestSubmit();
  return true;
}

export const joinBetaTool: WebMcpTool = {
  name: 'join_private_beta',
  description:
    'Register a name and email address for Strat AI private beta access. This is the only way to get access; there is no self-serve signup or API key. Only works on the /waitlist page. Confirm the email with the user before calling, because this submits their details.',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: "The user's full name." },
      email: {
        type: 'string',
        description:
          "The user's email address. Beta invitations are sent to this address.",
      },
    },
    required: ['name', 'email'],
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  execute: async (args, context) => {
    const name = readString(args, 'name');
    const email = readString(args, 'email');

    if (name.length === 0) {
      return 'A name is required. Ask the user for their full name and call again.';
    }
    if (!EMAIL_PATTERN.test(email)) {
      return `"${email}" is not a valid email address. Ask the user to confirm it and call again.`;
    }

    if (!document.querySelector('#waitlist-form')) {
      return `The beta registration form is not on this page. Navigate to ${SITE_URL}/waitlist and call this tool again.`;
    }

    if (isVisible('#waitlist-success-container')) {
      return 'This browser is already registered for the Strat AI private beta. No further action is needed.';
    }

    if (
      !setField('#waitlist-name', name) ||
      !setField('#waitlist-email', email)
    ) {
      return `Could not fill the registration form. The user can register directly at ${SITE_URL}/waitlist.`;
    }

    if (!submitForm('#waitlist-form')) {
      return `Could not submit the registration form. The user can register directly at ${SITE_URL}/waitlist.`;
    }

    const failure = await waitForOutcome(
      {
        form: '#waitlist-form',
        success: '#waitlist-success-container',
        error: '#waitlist-error-alert',
        errorText: '#waitlist-error-message',
      },
      context?.signal
    );

    return failure.length > 0
      ? `Registration did not complete: ${failure} The user can retry at ${SITE_URL}/waitlist.`
      : `Registered ${name} (${email}) for the Strat AI private beta. Terminal access invitations are sent to that address as onboarding expands.`;
  },
};

export const contactInquiryTool: WebMcpTool = {
  name: 'submit_contact_inquiry',
  description:
    'File an inquiry with the Strat AI team for early access, partnerships, research collaboration, media, or general questions. Only works on the /contact page. Confirm the details with the user before calling, because this sends their contact information to the team.',
  inputSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: "The user's email address for the reply.",
      },
      mobile: {
        type: 'string',
        description:
          "The user's phone number including country code, for example +91 9876543210.",
      },
      type: {
        type: 'string',
        description: 'Which desk should receive the inquiry.',
        enum: INQUIRY_TYPES,
      },
    },
    required: ['email', 'mobile', 'type'],
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  execute: async (args, context) => {
    const email = readString(args, 'email');
    const mobile = readString(args, 'mobile');
    const type = readString(args, 'type');

    if (!EMAIL_PATTERN.test(email)) {
      return `"${email}" is not a valid email address. Ask the user to confirm it and call again.`;
    }
    if (mobile.length < 6) {
      return 'A contact phone number is required, including country code.';
    }
    if (!INQUIRY_TYPES.includes(type)) {
      return `"${type}" is not a valid inquiry type. Choose one of: ${INQUIRY_TYPES.join(', ')}.`;
    }

    if (!document.querySelector('#contact-form')) {
      return `The inquiry form is not on this page. Navigate to ${SITE_URL}/contact and call this tool again.`;
    }

    const filled =
      setField('#contact-email', email) &&
      setField('#contact-mobile', mobile) &&
      setField('#contact-type', type);

    if (!filled || !submitForm('#contact-form')) {
      return `Could not submit the inquiry form. The user can submit it directly at ${SITE_URL}/contact.`;
    }

    const failure = await waitForOutcome(
      {
        form: '#contact-form',
        success: '#contact-success',
        error: '#contact-error',
        errorText: '#contact-error-text',
      },
      context?.signal
    );

    return failure.length > 0
      ? `The inquiry was not submitted: ${failure} The user can retry at ${SITE_URL}/contact.`
      : `Submitted a "${type}" inquiry for ${email}. The team replies to support and billing inquiries within 24 to 48 business hours.`;
  },
};

export const ACTION_TOOLS: WebMcpTool[] = [joinBetaTool, contactInquiryTool];
