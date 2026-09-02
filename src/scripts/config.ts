/**
 * Central configuration for Auralis Web
 */
export interface ApkMetadata {
  fileName: string;
  version: string;
  releaseTag: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  sha256: string;
  lastUpdated: string;
  minAndroidVersion: string;
  downloadUrl: string;
  releaseNotes: string;
}

export const APP_CONFIG = {
  appName: 'Auralis',
  tagline: 'Music, your way.',
  version: '1.0.0',
  releaseTag: 'v1.0.0',
  minAndroidVersion: 'Android 8.0+',
  
  // GitHub repository link
  githubRepoUrl: 'https://github.com/shreyanshchoubey09/Auralis',
  
  // Direct APK download link
  apkDownloadUrl: '/downloads/Auralis-v1.0.0-universal.apk',
  
  // Authorized Admin Email
  adminEmail: 'ishaanthakur49@gmail.com',
};

/**
 * Fetch dynamic APK metadata if available (falls back gracefully to APP_CONFIG)
 */
export async function loadApkMetadata(): Promise<ApkMetadata> {
  try {
    const res = await fetch('/downloads/apk-meta.json?t=' + Date.now());
    if (res.ok) {
      const data: ApkMetadata = await res.json();
      if (data && data.downloadUrl) {
        APP_CONFIG.apkDownloadUrl = data.downloadUrl;
        APP_CONFIG.version = data.version;
        APP_CONFIG.releaseTag = data.releaseTag;
        APP_CONFIG.minAndroidVersion = data.minAndroidVersion;
        return data;
      }
    }
  } catch {
    // Network or parse failure, fallback
  }

  return {
    fileName: 'Auralis-v1.0.0-universal.apk',
    version: APP_CONFIG.version,
    releaseTag: APP_CONFIG.releaseTag,
    fileSizeBytes: 8548522,
    fileSizeFormatted: '8.5 MB',
    sha256: 'e0b1c854a3476abb868891809e340f70c5d7029aae219a1d1d46d4db5f0e0e78',
    lastUpdated: '2026-09-02',
    minAndroidVersion: APP_CONFIG.minAndroidVersion,
    downloadUrl: APP_CONFIG.apkDownloadUrl,
    releaseNotes: 'Official universal release.',
  };
}
