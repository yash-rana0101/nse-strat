// src/components/sections/waitlistClient.ts
import { triggerPaperCuts } from '@/utils/effects/paperCuts';
import {
  joinWishlistWithEmail,
  joinWishlistWithGoogle,
} from '@/services/wishlist';

function initWaitlist() {
  const formContainer = document.getElementById('waitlist-form-container');
  const successContainer = document.getElementById(
    'waitlist-success-container'
  );
  const form = document.getElementById(
    'waitlist-form'
  ) as HTMLFormElement | null;
  const nameInput = document.getElementById(
    'waitlist-name'
  ) as HTMLInputElement | null;
  const emailInput = document.getElementById(
    'waitlist-email'
  ) as HTMLInputElement | null;
  const submitBtn = document.getElementById(
    'submit-btn'
  ) as HTMLButtonElement | null;
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');

  const successName = document.getElementById('success-user-name');
  const successEmail = document.getElementById('success-user-email');
  const successSpot = document.getElementById('success-queue-spot');

  const errorAlert = document.getElementById('waitlist-error-alert');
  const errorMessage = document.getElementById('waitlist-error-message');

  const placeholderBtn = document.getElementById('google-signin-placeholder');
  const googleBtnContainer =
    document.getElementById('google-signin-btn') || placeholderBtn;
  const googleClientId =
    googleBtnContainer
      ?.closest('[data-google-id]')
      ?.getAttribute('data-google-id') ||
    import.meta.env.PUBLIC_GOOGLE_CLIENT_ID ||
    '';
  const recaptchaSiteKey = import.meta.env.PUBLIC_RECAPTCHA_SITE || '';

  if (
    !form ||
    !nameInput ||
    !emailInput ||
    !submitBtn ||
    !formContainer ||
    !successContainer ||
    !submitText ||
    !submitSpinner
  )
    return;

  const LOCAL_KEY = 'strat-waitlist-user';

  // Helper to load external scripts dynamically
  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(script);
    });
  }

  // Helper to get Google reCAPTCHA v3 token
  async function getRecaptchaToken(siteKey: string): Promise<string> {
    if (!siteKey) {
      console.warn('reCAPTCHA site key not provided. Using fallback token.');
      return 'fallback-local-development-token';
    }
    try {
      await loadScript(
        `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      );
      return new Promise((resolve, reject) => {
        const g = (window as any).grecaptcha;
        if (!g) {
          reject(new Error('reCAPTCHA library not initialized'));
          return;
        }
        g.ready(() => {
          g.execute(siteKey, { action: 'waitlist' })
            .then((token: string) => resolve(token))
            .catch((err: any) => reject(err));
        });
      });
    } catch (error) {
      console.error('Failed to execute reCAPTCHA:', error);
      return 'fallback-error-token';
    }
  }

  // Show Success UI
  function showSuccess(user: any) {
    if (successName) successName.textContent = user.name;
    if (successEmail) successEmail.textContent = user.email;
    if (successSpot) successSpot.textContent = `#${user.spot.toLocaleString()}`;

    // Populate Thank You Modal
    const modal = document.getElementById('thank-you-modal');
    const modalContent = document.getElementById('thank-you-modal-content');
    const modalEmail = document.getElementById('modal-user-email');
    const modalSpot = document.getElementById('modal-queue-spot');

    if (modalEmail) modalEmail.textContent = user.email;
    if (modalSpot) modalSpot.textContent = `#${user.spot.toLocaleString()}`;

    // Open Modal
    if (modal && modalContent) {
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
      }, 10);
    }

    // Trigger Confetti Effect
    triggerPaperCuts();

    if (formContainer && successContainer) {
      formContainer.classList.add('hidden');
      successContainer.classList.remove('hidden');
      successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Show Error Alert
  function showError(msg: string) {
    if (errorAlert && errorMessage) {
      errorMessage.textContent = msg;
      errorAlert.classList.remove('hidden');
      errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Clear Error Alert
  function clearError() {
    if (errorAlert) {
      errorAlert.classList.add('hidden');
    }
  }

  // Save to local storage and dispatch event
  function saveAndDispatchUser(
    name: string,
    email: string,
    spotCount?: number
  ) {
    const spot = spotCount || Math.floor(Math.random() * 100) + 1800; // Mock spot
    const refId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const user = { name, email, spot, refId };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(user));

    if (window.dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent('waitlist-signup', { detail: { email } })
      );
    }
    return user;
  }

  // Check if user is already on waitlist
  const savedUser = localStorage.getItem(LOCAL_KEY);
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      showSuccess(user);
    } catch (e) {
      localStorage.removeItem(LOCAL_KEY);
    }
  }

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) return;

    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    submitSpinner.classList.remove('hidden');

    try {
      const recapchaToken = await getRecaptchaToken(recaptchaSiteKey);
      const res = await joinWishlistWithEmail({ name, email, recapchaToken });

      const count = res.data?.count ? parseInt(res.data.count, 10) : undefined;
      const user = saveAndDispatchUser(name, email, count);
      showSuccess(user);
    } catch (err: any) {
      console.error('Waitlist submission failed:', err);
      showError(err.message || 'An error occurred. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      submitSpinner.classList.add('hidden');
    }
  });

  // Google OAuth Code Flow via GIS
  let googleAuthClient: any = null;

  async function handleGoogleCodeResponse(response: any) {
    if (!response.code) return;

    submitBtn!.disabled = true;
    submitText!.classList.add('hidden');
    submitSpinner!.classList.remove('hidden');
    clearError();

    try {
      const res = await joinWishlistWithGoogle(response.code);

      const count = res.data?.count ? parseInt(res.data.count, 10) : undefined;
      const user = saveAndDispatchUser('Google User', '', count);
      showSuccess(user);
    } catch (err: any) {
      console.error('Google waitlist registration failed:', err);
      showError(
        err.message || 'Google waitlist registration failed. Please try again.'
      );
    } finally {
      submitBtn!.disabled = false;
      submitText!.classList.remove('hidden');
      submitSpinner!.classList.add('hidden');
    }
  }

  function initGoogleOAuth() {
    const g = (window as any).google;
    if (typeof g === 'undefined' || !g.accounts) {
      setTimeout(initGoogleOAuth, 100);
      return;
    }

    // Initialize the GIS Auth Code client
    googleAuthClient = g.accounts.oauth2.initCodeClient({
      client_id: googleClientId,
      scope: 'email profile openid',
      ux_mode: 'popup',
      callback: handleGoogleCodeResponse,
    });
  }

  // Attach event handlers for Google Sign-In
  const googleBtn = document.getElementById('google-signin-btn');
  const googlePlaceholder = document.getElementById(
    'google-signin-placeholder'
  );

  if (googleClientId) {
    initGoogleOAuth();

    const triggerGoogleAuth = (e: Event) => {
      e.preventDefault();
      if (googleAuthClient) {
        googleAuthClient.requestCode();
      } else {
        showError(
          'Google OAuth is initializing. Please try again in a moment.'
        );
      }
    };

    if (googleBtn) {
      googleBtn.addEventListener('click', triggerGoogleAuth);
    }
    if (googlePlaceholder) {
      googlePlaceholder.addEventListener('click', triggerGoogleAuth);
    }
  } else if (googlePlaceholder) {
    googlePlaceholder.addEventListener('click', () => {
      alert(
        'Google Client ID is not configured. Please define PUBLIC_GOOGLE_CLIENT_ID in your environment (.env file) to connect your Google OAuth client.'
      );
    });
  }
}

// Init waitlist
initWaitlist();
document.addEventListener('astro:after-swap', initWaitlist);
