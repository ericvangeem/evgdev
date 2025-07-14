import { getMetadata } from '../../scripts/aem.js';

/**
 * Blog-specific JavaScript functionality
 * Designed to work with the mint green theme and Plus Jakarta Sans font
 */

// Reading progress indicator
function updateReadingProgress() {
  if (!document.body.classList.contains('blog')) return;

  const article = document.querySelector('main');
  if (!article) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = article.offsetHeight;
  const winHeight = window.innerHeight;
  const headerHeight = document.querySelector('header')?.offsetHeight || 64;

  // Adjust calculation to account for header
  const scrollPercent = scrollTop / (docHeight - winHeight + headerHeight);
  const scrollPercentRounded = Math.round(scrollPercent * 100);

  // Update the progress bar width
  document.body.style.setProperty('--progress-width', `${Math.min(Math.max(scrollPercentRounded, 0), 100)}%`);
}

// Smooth scrolling for anchor links
function initSmoothScrolling(main) {
  main.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

// Add copy button to code blocks
function addCodeCopyButtons(main) {
  if (!document.body.classList.contains('blog')) return;

  main.querySelectorAll('pre').forEach((pre) => {
    // Skip if button already exists
    if (pre.querySelector('.copy-code-button')) return;

    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.innerHTML = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code') || pre;
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.innerHTML = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
          button.innerHTML = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy code: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          button.innerHTML = 'Copied!';
          button.classList.add('copied');
          setTimeout(() => {
            button.innerHTML = 'Copy';
            button.classList.remove('copied');
          }, 2000);
        } catch (fallbackErr) {
          button.innerHTML = 'Error';
          setTimeout(() => {
            button.innerHTML = 'Copy';
          }, 2000);
        }
        document.body.removeChild(textArea);
      }
    });

    pre.style.position = 'relative';
    pre.appendChild(button);
  });
}

// Enhance external links
function enhanceExternalLinks(main) {
  main.querySelectorAll('a[href^="http"]').forEach((link) => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('aria-label', `${link.textContent} (opens in new tab)`);

      // Add subtle external link indicator
      if (!link.querySelector('.external-icon')) {
        const icon = document.createElement('span');
        icon.className = 'external-icon';
        icon.innerHTML = ' ↗';
        icon.style.fontSize = '0.8em';
        icon.style.opacity = '0.7';
        link.appendChild(icon);
      }
    }
  });
}

// Calculate and display estimated reading time and publication date
function addReadingTime(main) {
  const content = main.querySelector('.default-content-wrapper');
  if (!content) return;

  const text = content.textContent || content.innerText || '';
  const wordsPerMinute = 120;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Hero might be outside main, so check document first, then main
  const hero = document.querySelector('.hero') || main.querySelector('.hero');
  if (hero) {
    // Add publication date
    const publicationMeta = getMetadata('publication-date');
    if (publicationMeta) {
      const publicationDateElement = document.createElement('div');

      // Format the date nicely
      const date = new Date(publicationMeta);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      publicationDateElement.className = 'post-info';
      publicationDateElement.innerHTML = `<small>${formattedDate}</small>`;
      hero.appendChild(publicationDateElement);
    }

    // Add reading time if it doesn't exist and we have content
    if (readingTime > 0) {
      const readingTimeElement = document.createElement('div');
      readingTimeElement.className = 'post-info';
      readingTimeElement.innerHTML = `<small>${readingTime} min read</small>`;
      hero.appendChild(readingTimeElement);
    }
  }
}

// Add keyboard shortcuts for better accessibility
function addKeyboardShortcuts() {
  // Remove existing listener if it exists
  if (window.blogKeyboardHandler) {
    document.removeEventListener('keydown', window.blogKeyboardHandler);
  }

  window.blogKeyboardHandler = (e) => {
    // Only on blog pages
    if (!document.body.classList.contains('blog')) return;

    // Alt + T: Go to top
    if (e.altKey && e.key === 't') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Alt + B: Go to bottom
    if (e.altKey && e.key === 'b') {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  document.addEventListener('keydown', window.blogKeyboardHandler);
}

// Add focus management for better accessibility
function improveFocusManagement(main) {
  // Add skip link if it doesn't exist
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -50px;
      left: 6px;
      background: var(--link-color);
      color: white;
      padding: 8px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      z-index: 1000;
      transition: top 0.2s ease;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-50px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Add main content ID if it doesn't exist
  if (main && !main.id) {
    main.id = 'main-content';
  }
}

// Initialize blog functionality
function decorate(main) {
  if (!document.body.classList.contains('blog')) return;

  // Set up reading progress (document level)
  updateReadingProgress();
  window.addEventListener('scroll', updateReadingProgress);
  window.addEventListener('resize', updateReadingProgress);

  // Initialize main-scoped features
  initSmoothScrolling(main);
  addCodeCopyButtons(main);
  enhanceExternalLinks(main);
  addReadingTime(main);
  improveFocusManagement(main);

  // Initialize document-level features
  addKeyboardShortcuts();

  // Add loaded class for any CSS animations
  setTimeout(() => {
    document.body.classList.add('blog-loaded');
  }, 100);
}

// Re-initialize if the page content changes (for SPA-like behavior)
function observeContentChanges(main) {
  if (!main || !document.body.classList.contains('blog')) return null;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if new content was added that might need blog features
        const hasNewContent = Array.from(mutation.addedNodes).some((node) => (
          node.nodeType === Node.ELEMENT_NODE
          && (node.querySelector('pre') || node.querySelector('a[href^="http"]'))
        ));

        if (hasNewContent) {
          // Re-run specific initialization functions
          addCodeCopyButtons(main);
          enhanceExternalLinks(main);
        }
      }
    });
  });

  observer.observe(main, {
    childList: true,
    subtree: true,
  });

  return observer;
}

// Export the decorate function for Edge Delivery Services
export default function decorateMain(main) {
  decorate(main);
  observeContentChanges(main);
}
