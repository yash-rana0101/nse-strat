import { liquidGlass } from '@/utils/liquid-glass';

let currentGlassInstance: ReturnType<typeof liquidGlass> | null = null;
let currentThemeObserver: MutationObserver | null = null;

function initDynamicIsland() {
  const islandWrapper = document.getElementById('dynamic-island-wrapper');
  const island = document.getElementById('dynamic-island');
  const desktopNavPill = document.getElementById('desktop-nav-pill');
  const toggle = document.getElementById('island-mobile-toggle');
  const expanded = document.getElementById('island-expanded');
  const statusText = document.getElementById('island-status');
  const menuIcon = toggle?.querySelector('.mobile-menu-icon');
  const closeIcon = toggle?.querySelector('.mobile-close-icon');

  if (!island || !toggle || !expanded) return;

  // Cleanup old state on page re-initialization / Astro swap
  if (currentGlassInstance) {
    currentGlassInstance.destroy();
    currentGlassInstance = null;
  }
  if (currentThemeObserver) {
    currentThemeObserver.disconnect();
    currentThemeObserver = null;
  }

  let isExpanded = false;

  function updateLiquidGlass() {
    if (window.scrollY < 50 || island?.classList.contains('is-at-top')) {
      if (currentGlassInstance) {
        currentGlassInstance.destroy();
        currentGlassInstance = null;
      }
      return;
    }

    if (!currentGlassInstance) {
      currentGlassInstance = liquidGlass(island!, {
        scale: -80,
        chroma: 6,
        border: 0.04,
        mapBlur: 10,
        blur: 4,
        saturate: 1.6,
        fallbackBlur: 16,
      });
    } else {
      currentGlassInstance.refresh();
    }
  }

  // Scroll Transformation: Completely Transparent Broad Header at Top -> Glass Pill on Scroll
  function handleScrollTransformation() {
    if (!island || !islandWrapper) return;

    const scrollY = window.scrollY;
    const navLinks = island.querySelectorAll('.island-nav-link');

    if (scrollY < 50) {
      if (!island.classList.contains('is-at-top')) {
        if (currentGlassInstance) {
          currentGlassInstance.destroy();
          currentGlassInstance = null;
        }

        island.classList.add(
          'is-at-top',
          'max-w-7xl',
          '!bg-transparent',
          '!border-none',
          '!border-transparent',
          '!shadow-none',
          '!backdrop-blur-none',
          '!rounded-none'
        );
        island.classList.remove(
          'is-scrolled',
          'max-w-[800px]',
          'bg-canvas/80',
          'backdrop-blur-xl',
          'border',
          'border-hairline',
          'rounded-[28px]',
          'shadow-2xl'
        );
        islandWrapper.classList.remove('pt-6', 'md:pt-4');
        islandWrapper.classList.add('pt-4', 'md:pt-3');

        desktopNavPill?.classList.add(
          '!bg-transparent',
          '!border-none',
          '!border-transparent',
          '!shadow-none'
        );
        desktopNavPill?.classList.remove(
          'bg-surface-soft/80',
          'border',
          'border-hairline-soft'
        );

        navLinks.forEach((link) => {
          link.classList.remove('bg-canvas', 'shadow-sm');
          link.classList.add('!bg-transparent');
        });
      }
    } else {
      if (!island.classList.contains('is-scrolled')) {
        island.classList.remove(
          'is-at-top',
          'max-w-7xl',
          '!bg-transparent',
          '!border-none',
          '!border-transparent',
          '!shadow-none',
          '!backdrop-blur-none',
          '!rounded-none'
        );
        island.classList.add(
          'is-scrolled',
          'max-w-[800px]',
          'bg-canvas/80',
          'backdrop-blur-xl',
          'border',
          'border-hairline',
          'rounded-[28px]',
          'shadow-2xl'
        );
        islandWrapper.classList.remove('pt-4', 'md:pt-3');
        islandWrapper.classList.add('pt-6', 'md:pt-4');

        desktopNavPill?.classList.remove(
          '!bg-transparent',
          '!border-none',
          '!border-transparent',
          '!shadow-none'
        );
        desktopNavPill?.classList.add(
          'bg-surface-soft/80',
          'border',
          'border-hairline-soft'
        );

        updateLiquidGlass();
      }
    }
  }

  // Run initial transformation check
  handleScrollTransformation();

  // Attach scroll listener
  window.addEventListener('scroll', handleScrollTransformation, {
    passive: true,
  });

  // Watch for theme toggling on <html> element
  currentThemeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        updateLiquidGlass();
      }
    });
  });
  currentThemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  function scheduleTransitionRefreshes() {
    [50, 150, 250, 400].forEach((ms) => {
      setTimeout(() => currentGlassInstance?.refresh(), ms);
    });
  }

  // Toggle menu
  toggle.addEventListener('click', () => {
    isExpanded = !isExpanded;
    if (!isExpanded) {
      island.classList.remove('is-expanded');
      island.style.maxHeight = '56px';
      toggle.setAttribute('aria-expanded', 'false');
      expanded.setAttribute('aria-hidden', 'true');
      expanded.style.maxHeight = '0px';
      expanded.style.opacity = '0';
      expanded.classList.add('border-transparent');
      expanded.classList.remove('border-hairline');

      closeIcon?.classList.add('hidden');
      menuIcon?.classList.remove('hidden');
    } else {
      island.classList.add('is-expanded');
      island.style.maxHeight = '85vh';
      toggle.setAttribute('aria-expanded', 'true');
      expanded.setAttribute('aria-hidden', 'false');
      expanded.style.maxHeight = 'calc(85vh - 80px)';
      expanded.style.opacity = '1';
      expanded.classList.remove('border-transparent');
      expanded.classList.add('border-hairline');

      menuIcon?.classList.add('hidden');
      closeIcon?.classList.remove('hidden');
    }
    scheduleTransitionRefreshes();
  });

  // Close menu when a link is clicked
  const links = island.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      isExpanded = false;
      island.classList.remove('is-expanded');
      island.style.maxHeight = '56px';
      toggle.setAttribute('aria-expanded', 'false');
      expanded.setAttribute('aria-hidden', 'true');
      expanded.style.maxHeight = '0px';
      expanded.style.opacity = '0';
      expanded.classList.add('border-transparent');
      expanded.classList.remove('border-hairline');

      closeIcon?.classList.add('hidden');
      menuIcon?.classList.remove('hidden');
    });
  });

  // Scroll active section tracking (only active on homepage)
  const isHomepage =
    window.location.pathname === '/' || window.location.pathname === '';
  if (isHomepage) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = island.querySelectorAll('.island-nav-link');
    const mobileLinks = island.querySelectorAll('.mobile-nav-link');

    function updateActiveState(activeId: string) {
      if (statusText) {
        if (activeId === 'hero' || !activeId) {
          statusText.textContent = 'Strat Ai';
        } else {
          statusText.textContent = activeId;
        }
      }

      const isTop = window.scrollY < 50;

      navLinks.forEach((link) => {
        const sectionId = link.getAttribute('data-section');
        if (sectionId === activeId) {
          if (isTop) {
            link.classList.remove('bg-canvas', 'shadow-sm', 'text-muted');
            link.classList.add('text-ink', 'font-semibold', '!bg-transparent');
          } else {
            link.classList.add('bg-canvas', 'text-ink', 'shadow-sm');
            link.classList.remove('text-muted', '!bg-transparent');
          }
        } else {
          link.classList.remove('bg-canvas', 'shadow-sm', 'font-semibold');
          link.classList.add('text-muted', '!bg-transparent');
        }
      });

      mobileLinks.forEach((link) => {
        const sectionId = link.getAttribute('data-section');
        if (sectionId === activeId) {
          link.classList.add('text-ink', 'bg-surface-soft', 'font-semibold');
          link.classList.remove('text-muted');
        } else {
          link.classList.remove('text-ink', 'bg-surface-soft', 'font-semibold');
          link.classList.add('text-muted');
        }
      });
    }

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            updateActiveState(id);
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY < 50) {
          updateActiveState('hero');
        }
      },
      { passive: true }
    );
  }
}

initDynamicIsland();
document.addEventListener('astro:after-swap', initDynamicIsland);
