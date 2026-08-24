export const DEFAULT_APK_URL = 'https://github.com/shreyanshchoubey09/Auralis/releases/latest/download/app-release.apk';

export interface ReleaseInfo {
  url: string;
  version: string;
  sizeMb?: string;
}

let cachedReleaseInfo: ReleaseInfo | null = null;

export async function fetchLatestApkUrl(): Promise<ReleaseInfo> {
  if (cachedReleaseInfo) return cachedReleaseInfo;

  try {
    const response = await fetch('https://api.github.com/repos/shreyanshchoubey09/Auralis/releases/latest', {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (response.ok) {
      const data = await response.json();
      const apkAsset = data.assets?.find((asset: { name?: string; browser_download_url?: string; size?: number }) =>
        asset.name?.toLowerCase().endsWith('.apk')
      );

      if (apkAsset?.browser_download_url) {
        const sizeMb = apkAsset.size ? (apkAsset.size / (1024 * 1024)).toFixed(1) + ' MB' : undefined;
        cachedReleaseInfo = {
          url: apkAsset.browser_download_url,
          version: data.tag_name || 'v1.0.0',
          sizeMb,
        };
        return cachedReleaseInfo;
      }

      if (data.tag_name) {
        cachedReleaseInfo = {
          url: `https://github.com/shreyanshchoubey09/Auralis/releases/download/${data.tag_name}/app-release.apk`,
          version: data.tag_name,
        };
        return cachedReleaseInfo;
      }
    }
  } catch (err) {
    console.info('Falling back to default direct APK download endpoint', err);
  }

  cachedReleaseInfo = { url: DEFAULT_APK_URL, version: 'v1.0.0' };
  return cachedReleaseInfo;
}

export function triggerDirectDownload(url: string, filename = 'auralis.apk') {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function initDownloadHandler() {
  const downloadBtns = document.querySelectorAll<HTMLElement>('.btn-direct-apk-download, #downloadApkBtn');
  const versionBadges = document.querySelectorAll<HTMLElement>('.apk-version-badge');
  const sizeBadges = document.querySelectorAll<HTMLElement>('.apk-size-badge');

  // Preload and hydrate version / file size
  fetchLatestApkUrl().then(({ url, version, sizeMb }) => {
    versionBadges.forEach((badge) => {
      badge.textContent = version;
    });
    if (sizeMb) {
      sizeBadges.forEach((badge) => {
        badge.textContent = sizeMb;
      });
    }
    downloadBtns.forEach((btn) => {
      if (btn instanceof HTMLAnchorElement) {
        btn.href = url;
      }
    });
  });

  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      // Prevent default navigation to GitHub page so direct file download starts
      e.preventDefault();

      const originalContent = btn.innerHTML;
      btn.classList.add('downloading');
      btn.innerHTML = `
        <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="32" stroke-dashoffset="10"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"/>
        </svg>
        <span>Starting APK Download...</span>
      `;

      try {
        const { url } = await fetchLatestApkUrl();
        triggerDirectDownload(url);
      } catch {
        triggerDirectDownload(DEFAULT_APK_URL);
      }

      setTimeout(() => {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Downloading! Check Notifications</span>
        `;

        // Reset button state after 3.5s
        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.classList.remove('downloading');
        }, 3500);
      }, 800);
    });
  });
}
