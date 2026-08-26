import { APP_CONFIG } from './config';

document.addEventListener('DOMContentLoaded', () => {
  initDownloadHandlers();
  initMobileDrawer();
  initPreviewCard();
});

/**
 * Handle APK Download clicks & placeholder fallbacks
 */
function initDownloadHandlers() {
  const downloadBtns = document.querySelectorAll<HTMLElement>('[data-action="download-apk"]');
  const toast = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');

  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      if (APP_CONFIG.apkDownloadUrl && APP_CONFIG.apkDownloadUrl.trim() !== '') {
        // Direct APK download link provided
        window.location.href = APP_CONFIG.apkDownloadUrl;
      } else {
        // Placeholder state - notify user and provide GitHub link fallback
        showToast('APK build is being finalized. Redirecting to GitHub repository...');
        setTimeout(() => {
          window.open(APP_CONFIG.githubRepoUrl, '_blank', 'noopener,noreferrer');
        }, 1200);
      }
    });
  });

  function showToast(message: string) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileDrawer() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileBtn || !drawer) return;

  mobileBtn.addEventListener('click', () => {
    drawer.classList.toggle('is-open');
  });

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
    });
  });
}

/**
 * Interactive Preview Card Controls (Minimalist Demo)
 */
function initPreviewCard() {
  const playBtn = document.getElementById('previewPlayBtn');
  const playIcon = document.getElementById('previewPlayIcon');
  const pauseIcon = document.getElementById('previewPauseIcon');
  const progressBar = document.getElementById('previewProgress');
  const currentTimeEl = document.getElementById('previewCurrentTime');

  if (!playBtn || !progressBar || !currentTimeEl) return;

  let isPlaying = true;
  let progress = 42; // Percentage
  let totalSeconds = 230; // 3:50
  let currentSeconds = Math.floor((progress / 100) * totalSeconds);

  function formatTime(secs: number): string {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  }

  // Update time indicator
  currentTimeEl.textContent = formatTime(currentSeconds);

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (playIcon && pauseIcon) {
      if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    }
  });

  // Subtle progress ticker
  setInterval(() => {
    if (!isPlaying) return;
    progress += 0.5;
    if (progress > 100) progress = 0;
    progressBar.style.width = `${progress}%`;
    currentSeconds = Math.floor((progress / 100) * totalSeconds);
    currentTimeEl.textContent = formatTime(currentSeconds);
  }, 1000);
}
