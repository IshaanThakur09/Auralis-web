import { initPlayerDemo } from './player-demo';
import { initDownloadHandler } from './download';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Player Demo if canvas is present (Homepage)
  initPlayerDemo();

  // 2. Initialize Direct APK Download Handlers
  initDownloadHandler();

  // 3. Header scroll detection
  const header = document.querySelector('.site-header');

  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Drawer Controls
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileDrawerCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close other items
      faqItems.forEach((other) => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  // 5. Copy Code Snippet
  const copyBtn = document.getElementById('copySnippetBtn');
  copyBtn?.addEventListener('click', async () => {
    const codeEl = document.getElementById('buildSourceCode');
    if (!codeEl) return;
    try {
      await navigator.clipboard.writeText(codeEl.textContent || '');
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `<span>✓ Copied</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
      }, 2000);
    } catch (e) {
      console.warn('Could not copy code to clipboard', e);
    }
  });

  // 6. Table of Contents Scrollspy for Legal pages
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('.legal-toc-link');
  const legalSections = document.querySelectorAll<HTMLElement>('.legal-section');

  if (tocLinks.length > 0 && legalSections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    legalSections.forEach((section) => observer.observe(section));
  }
});
