/**
 * Auralis Web — Admin Panel Controller
 * Dedicated standalone APK Deployment Console
 * Authenticates strictly via Google Sign-In for ishaanthakur49@gmail.com
 */

import { loadApkMetadata } from './config';
import {
  isAuthConfigured,
  getGoogleClientId,
  getStoredUser,
  storeUser,
  clearUser,
  isAuthorizedAdmin,
  parseJwt,
  loadGoogleGsiScript,
  GoogleUser,
} from './auth';

// Staged APK in memory
let stagedApkFile: File | null = null;
let stagedSha256Hash: string = '';
let toastTimeout: number | null = null;

// DOM View Containers
const configRequiredView = document.getElementById('configRequiredView') as HTMLElement;
const authGatewayView = document.getElementById('authGatewayView') as HTMLElement;
const accessDeniedView = document.getElementById('accessDeniedView') as HTMLElement;
const adminDashboardView = document.getElementById('adminDashboardView') as HTMLElement;

// Header Elements
const adminStatusPill = document.getElementById('adminStatusPill') as HTMLElement;
const adminPulseDot = document.getElementById('adminPulseDot') as HTMLElement;
const adminStatusText = document.getElementById('adminStatusText') as HTMLElement;
const adminProfilePill = document.getElementById('adminProfilePill') as HTMLElement;
const adminProfileAvatar = document.getElementById('adminProfileAvatar') as HTMLImageElement;
const adminProfileName = document.getElementById('adminProfileName') as HTMLElement;
const adminSignOutBtn = document.getElementById('adminSignOutBtn') as HTMLButtonElement;

// Auth Gateway Elements
const authAlert = document.getElementById('authAlert') as HTMLElement;
const authAlertText = document.getElementById('authAlertText') as HTMLElement;
const deniedAccountChip = document.getElementById('deniedAccountChip') as HTMLElement;
const switchAccountBtn = document.getElementById('switchAccountBtn') as HTMLButtonElement;

// Dashboard Elements
const refreshApkBtn = document.getElementById('refreshApkBtn') as HTMLButtonElement;
const activeFileName = document.getElementById('activeFileName') as HTMLElement;
const activeVersionTag = document.getElementById('activeVersionTag') as HTMLElement;
const activeFileSize = document.getElementById('activeFileSize') as HTMLElement;
const activeMinAndroid = document.getElementById('activeMinAndroid') as HTMLElement;
const activeVersionValue = document.getElementById('activeVersionValue') as HTMLElement;
const liveChecksumHash = document.getElementById('liveChecksumHash') as HTMLElement;
const copyLiveShaBtn = document.getElementById('copyLiveShaBtn') as HTMLButtonElement;
const testDownloadLink = document.getElementById('testDownloadLink') as HTMLAnchorElement;

// Upload Form Elements
const apkUploadForm = document.getElementById('apkUploadForm') as HTMLFormElement;
const apkDropZone = document.getElementById('apkDropZone') as HTMLElement;
const apkFileInput = document.getElementById('apkFileInput') as HTMLInputElement;
const dropZonePrompt = document.getElementById('dropZonePrompt') as HTMLElement;
const stagedFileCard = document.getElementById('stagedFileCard') as HTMLElement;
const stagedFileName = document.getElementById('stagedFileName') as HTMLElement;
const stagedFileSize = document.getElementById('stagedFileSize') as HTMLElement;
const removeStagedFileBtn = document.getElementById('removeStagedFileBtn') as HTMLButtonElement;
const stagedChecksumBox = document.getElementById('stagedChecksumBox') as HTMLElement;
const stagedChecksumHash = document.getElementById('stagedChecksumHash') as HTMLElement;
const newVersionInput = document.getElementById('newVersionInput') as HTMLInputElement;
const newReleaseTagInput = document.getElementById('newReleaseTagInput') as HTMLInputElement;
const newMinAndroidInput = document.getElementById('newMinAndroidInput') as HTMLInputElement;
const releaseNotesInput = document.getElementById('releaseNotesInput') as HTMLTextAreaElement;
const deployApkBtn = document.getElementById('deployApkBtn') as HTMLButtonElement;
const uploadStatusPill = document.getElementById('uploadStatusPill') as HTMLElement;
const uploadProgressWrapper = document.getElementById('uploadProgressWrapper') as HTMLElement;
const uploadProgressBar = document.getElementById('uploadProgressBar') as HTMLElement;
const progressStatusText = document.getElementById('progressStatusText') as HTMLElement;
const progressPercentText = document.getElementById('progressPercentText') as HTMLElement;

// Toast Element
const adminToast = document.getElementById('adminToast') as HTMLElement;
const adminToastText = document.getElementById('adminToastText') as HTMLElement;

/**
 * Main Initialization
 */
async function initAdmin() {
  setupEventListeners();

  // 1. Check if Google Client ID is configured
  if (!isAuthConfigured()) {
    showView('config');
    return;
  }

  // 2. Check for OAuth redirect token in URL hash (access_token or id_token)
  if (window.location.hash.includes('access_token') || window.location.hash.includes('id_token')) {
    const rawHash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
    const params = new URLSearchParams(rawHash);
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');

    // Clean up URL hash so refreshing never gets stuck in a loop
    window.history.replaceState(null, '', window.location.pathname + window.location.search);

    let authenticatedUser: GoogleUser | null = null;

    // A. Fast path: Decode id_token directly if available
    if (idToken) {
      const payload = parseJwt(idToken);
      if (payload && payload.email) {
        authenticatedUser = {
          email: payload.email,
          name: payload.name || payload.email,
          picture: payload.picture,
          sub: payload.sub,
        };
      }
    }

    // B. Secondary path: Fetch user profile using access_token
    if (!authenticatedUser && accessToken) {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const profile = await res.json();
          if (profile && profile.email) {
            authenticatedUser = {
              email: profile.email,
              name: profile.name || profile.email,
              picture: profile.picture,
              sub: profile.sub,
            };
          }
        } else {
          console.warn('Google userinfo API returned error status:', res.status);
        }
      } catch (err) {
        console.error('Failed to parse OAuth redirect token:', err);
      }
    }

    if (authenticatedUser) {
      if (isAuthorizedAdmin(authenticatedUser.email)) {
        storeUser(authenticatedUser);
        showAdminDashboard(authenticatedUser);
        showToast('Welcome, Ishaan! Authenticated via Google.');
        return;
      } else {
        clearUser();
        showAccessDenied(authenticatedUser.email);
        return;
      }
    } else {
      showToast('Authentication failed or token was invalid. Please try again.');
    }
  }

  // 3. Check existing session
  const user = getStoredUser();
  if (user) {
    if (isAuthorizedAdmin(user.email)) {
      showAdminDashboard(user);
    } else {
      showAccessDenied(user.email);
    }
    return;
  }

  // 4. Not logged in, render Google Sign-In
  showView('auth');
  await initGoogleSignIn();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}

/**
 * View Management
 */
function showView(view: 'config' | 'auth' | 'denied' | 'dashboard') {
  if (configRequiredView) configRequiredView.style.display = view === 'config' ? 'flex' : 'none';
  if (authGatewayView) authGatewayView.style.display = view === 'auth' ? 'flex' : 'none';
  if (accessDeniedView) accessDeniedView.style.display = view === 'denied' ? 'flex' : 'none';
  if (adminDashboardView) adminDashboardView.style.display = view === 'dashboard' ? 'block' : 'none';

  if (view === 'config') {
    if (adminStatusText) adminStatusText.textContent = 'Setup Required';
    if (adminPulseDot) adminPulseDot.className = 'admin-pulse-dot offline';
    if (adminProfilePill) adminProfilePill.style.display = 'none';
    if (adminStatusPill) adminStatusPill.style.display = 'flex';
    if (adminSignOutBtn) adminSignOutBtn.style.display = 'none';
  } else if (view === 'auth') {
    if (adminStatusText) adminStatusText.textContent = 'Restricted Access';
    if (adminPulseDot) adminPulseDot.className = 'admin-pulse-dot offline';
    if (adminProfilePill) adminProfilePill.style.display = 'none';
    if (adminStatusPill) adminStatusPill.style.display = 'flex';
    if (adminSignOutBtn) adminSignOutBtn.style.display = 'none';
  } else if (view === 'denied') {
    if (adminStatusText) adminStatusText.textContent = 'Unauthorized';
    if (adminPulseDot) adminPulseDot.className = 'admin-pulse-dot offline';
    if (adminProfilePill) adminProfilePill.style.display = 'none';
    if (adminStatusPill) adminStatusPill.style.display = 'flex';
    if (adminSignOutBtn) adminSignOutBtn.style.display = 'none';
  } else if (view === 'dashboard') {
    if (adminStatusPill) adminStatusPill.style.display = 'none';
    if (adminProfilePill) adminProfilePill.style.display = 'flex';
    if (adminSignOutBtn) adminSignOutBtn.style.display = 'inline-flex';
  }
}

/**
 * Redirect to Google OAuth (Uses pure domain origin with NO path)
 */
function redirectToGoogleOAuth(clientId: string) {
  const redirectUri = window.location.origin;
  const nonce = Math.random().toString(36).substring(2);
  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token%20id_token&scope=email%20profile%20openid&nonce=${nonce}&prompt=select_account`;
  window.location.href = oauthUrl;
}

/**
 * Trigger Google Login (Popup first, fallback to pure origin redirect)
 */
async function triggerGoogleLogin(clientId: string) {
  const googleSignInBtn = document.getElementById('googleSignInBtn') as HTMLButtonElement;
  if (googleSignInBtn) {
    googleSignInBtn.disabled = true;
    googleSignInBtn.style.opacity = '0.7';
  }

  try {
    await loadGoogleGsiScript();

    if ((window as any).google?.accounts?.oauth2) {
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: any) => {
          if (googleSignInBtn) {
            googleSignInBtn.disabled = false;
            googleSignInBtn.style.opacity = '1';
          }
          if (tokenResponse && tokenResponse.access_token) {
            await handleAccessToken(tokenResponse.access_token);
          }
        },
        error_callback: (err: any) => {
          console.warn('OAuth popup closed/failed:', err);
          if (googleSignInBtn) {
            googleSignInBtn.disabled = false;
            googleSignInBtn.style.opacity = '1';
          }
          redirectToGoogleOAuth(clientId);
        },
      });
      tokenClient.requestAccessToken({ prompt: 'select_account' });
      return;
    }
  } catch (e) {
    console.warn('Google GSI SDK unavailable, falling back to direct auth:', e);
  }

  redirectToGoogleOAuth(clientId);
}

/**
 * Initialize Google Identity Services
 */
async function initGoogleSignIn() {
  try {
    await loadGoogleGsiScript();

    const clientId = getGoogleClientId();
    if (!clientId) return;

    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  } catch (err: any) {
    console.warn('Google Identity Services script failed:', err);
  }
}

/**
 * Handle Access Token (from OAuth Token Client or Hash)
 */
async function handleAccessToken(token: string) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Google API returned status ${res.status}`);
    }
    const profile = await res.json();
    if (profile && profile.email) {
      const user: GoogleUser = {
        email: profile.email,
        name: profile.name || profile.email,
        picture: profile.picture,
        sub: profile.sub,
      };
      if (isAuthorizedAdmin(user.email)) {
        storeUser(user);
        showAdminDashboard(user);
        showToast('Welcome, Ishaan! Authenticated with Google.');
      } else {
        clearUser();
        showAccessDenied(user.email);
      }
    } else {
      throw new Error('No email found in Google profile');
    }
  } catch (err: any) {
    console.error('Failed to fetch user profile:', err);
    showToast('Failed to fetch user profile: ' + (err.message || 'Unknown error'));
  }
}

/**
 * Handle Google Credential Response
 */
function handleGoogleCredentialResponse(response: any) {
  if (!response || !response.credential) {
    if (authAlert) {
      authAlert.style.display = 'flex';
      authAlertText.textContent = 'Google authentication was cancelled or failed.';
    }
    return;
  }

  const payload = parseJwt(response.credential);
  if (!payload || !payload.email) {
    if (authAlert) {
      authAlert.style.display = 'flex';
      authAlertText.textContent = 'Invalid credential payload received from Google.';
    }
    return;
  }

  const user: GoogleUser = {
    email: payload.email,
    name: payload.name || payload.email,
    picture: payload.picture,
    sub: payload.sub,
  };

  // STRICT AUTHORIZATION CHECK
  if (isAuthorizedAdmin(user.email)) {
    storeUser(user);
    showAdminDashboard(user);
    showToast('Welcome, Ishaan! Authenticated with Google.');
  } else {
    clearUser();
    showAccessDenied(user.email);
  }
}

/**
 * Show Admin Dashboard
 */
async function showAdminDashboard(user: GoogleUser) {
  showView('dashboard');

  if (adminProfileName) adminProfileName.textContent = 'Ishaan';
  if (adminProfileAvatar && user.picture) {
    adminProfileAvatar.src = user.picture;
  }

  await refreshActiveApkSpecs();
}

/**
 * Show Access Denied View
 */
function showAccessDenied(email: string) {
  showView('denied');
  if (deniedAccountChip) deniedAccountChip.textContent = email;
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  // Google Sign-In Button — Immediately Clickable
  const googleSignInBtn = document.getElementById('googleSignInBtn') as HTMLButtonElement;
  googleSignInBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const clientId = getGoogleClientId();
    if (!clientId) {
      showToast('Google Client ID is missing. Check .env configuration.');
      return;
    }
    triggerGoogleLogin(clientId);
  });

  // Sign Out Button
  adminSignOutBtn?.addEventListener('click', () => {
    clearUser();
    showToast('Signed out of Admin Console.');
    showView('auth');
  });

  // Switch Account Button on Denied Screen
  switchAccountBtn?.addEventListener('click', () => {
    clearUser();
    showView('auth');
    initGoogleSignIn();
  });

  // Refresh Active Specs Button
  refreshApkBtn?.addEventListener('click', async () => {
    refreshApkBtn.disabled = true;
    await refreshActiveApkSpecs();
    showToast('APK specifications updated from server.');
    setTimeout(() => {
      refreshApkBtn.disabled = false;
    }, 600);
  });

  // Copy Live SHA256 Hash
  copyLiveShaBtn?.addEventListener('click', () => {
    const hash = liveChecksumHash?.textContent?.trim() || '';
    if (hash) {
      navigator.clipboard.writeText(hash);
      showToast('SHA-256 checksum copied to clipboard!');
    }
  });

  // Drag and Drop Zone
  apkDropZone?.addEventListener('click', () => {
    apkFileInput?.click();
  });

  apkFileInput?.addEventListener('change', (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      stageFile(files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    apkDropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      apkDropZone.classList.add('is-dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    apkDropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      apkDropZone.classList.remove('is-dragover');
    });
  });

  apkDropZone?.addEventListener('drop', (e: DragEvent) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      stageFile(files[0]);
    }
  });

  // Remove Staged File
  removeStagedFileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    resetStagedFile();
  });

  // Form Submit / Deploy
  apkUploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleDeployApk();
  });
}

/**
 * Refresh Active Specs
 */
async function refreshActiveApkSpecs() {
  try {
    const meta = await loadApkMetadata();

    if (activeFileName) activeFileName.textContent = meta.fileName;
    if (activeVersionTag) activeVersionTag.textContent = meta.releaseTag;
    if (activeFileSize) activeFileSize.textContent = meta.fileSizeFormatted;
    if (activeMinAndroid) activeMinAndroid.textContent = meta.minAndroidVersion;
    if (activeVersionValue) activeVersionValue.textContent = meta.version;
    if (liveChecksumHash) liveChecksumHash.textContent = meta.sha256;
    if (testDownloadLink) testDownloadLink.href = meta.downloadUrl;
  } catch (err) {
    console.error('Failed to load APK metadata:', err);
  }
}

/**
 * Process Incoming File (Auto-handles .apk and WhatsApp .zip archives)
 */
async function processIncomingFile(file: File): Promise<File | null> {
  const isZip = file.name.toLowerCase().endsWith('.zip');
  if (!isZip) {
    if (!file.name.toLowerCase().endsWith('.apk')) {
      showToast('Invalid file format. Please upload an .apk or .zip file.', 4000);
      return null;
    }
    return file;
  }

  showToast('Inspecting WhatsApp ZIP archive...', 3500);

  const JSZipLib = (window as any).JSZip;
  if (!JSZipLib) {
    showToast('Zip library loading... please retry in a moment.', 3000);
    return null;
  }

  try {
    const zip = await JSZipLib.loadAsync(file);

    // 1. Search for any .apk file packaged inside the zip
    let apkEntryName: string | null = null;
    for (const name of Object.keys(zip.files)) {
      if (name.toLowerCase().endsWith('.apk') && !zip.files[name].dir) {
        apkEntryName = name;
        break;
      }
    }

    if (apkEntryName) {
      const apkBlob = await zip.files[apkEntryName].async('blob');
      const cleanFileName = apkEntryName.split('/').pop() || 'Auralis-update.apk';
      showToast(`Extracted ${cleanFileName} from ZIP archive!`, 4000);
      return new File([apkBlob], cleanFileName, { type: 'application/vnd.android.package-archive' });
    }

    // 2. Check if the ZIP IS an APK directly (WhatsApp / Browser often renames APKs to .zip)
    if (zip.file('AndroidManifest.xml') || zip.file('classes.dex')) {
      let cleanName = file.name.replace(/\.zip$/i, '');
      if (!cleanName.toLowerCase().endsWith('.apk')) {
        cleanName += '.apk';
      }
      showToast(`Detected renamed APK package! Loaded as ${cleanName}`, 4000);
      return new File([file], cleanName, { type: 'application/vnd.android.package-archive' });
    }

    showToast('No Android APK found inside this ZIP archive.', 5000);
    return null;
  } catch (err: any) {
    console.error('Failed to unpack ZIP:', err);
    showToast('Could not unpack ZIP file: ' + err.message, 4500);
    return null;
  }
}

/**
 * Stage an APK File
 */
async function stageFile(rawFile: File) {
  const file = await processIncomingFile(rawFile);
  if (!file) return;

  stagedApkFile = file;
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

  // Update UI
  if (dropZonePrompt) dropZonePrompt.style.display = 'none';
  if (stagedFileCard) stagedFileCard.style.display = 'flex';
  if (stagedFileName) stagedFileName.textContent = file.name;
  if (stagedFileSize) stagedFileSize.textContent = `${sizeMb} MB`;

  if (stagedChecksumBox) stagedChecksumBox.style.display = 'block';
  if (stagedChecksumHash) stagedChecksumHash.textContent = 'Computing SHA-256 checksum...';

  if (uploadStatusPill) {
    uploadStatusPill.className = 'meta-pill warning';
    uploadStatusPill.textContent = 'Calculating Hash...';
  }

  // Auto-fill version if filename contains semver (e.g. Auralis-v1.0.1.apk)
  const match = file.name.match(/v?(\d+\.\d+\.\d+)/i);
  if (match && match[1]) {
    if (newVersionInput) newVersionInput.value = match[1];
    if (newReleaseTagInput) newReleaseTagInput.value = `v${match[1]}`;
  }

  // Compute real SHA-256 hash using Web Crypto API
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    stagedSha256Hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    if (stagedChecksumHash) stagedChecksumHash.textContent = stagedSha256Hash;
    if (deployApkBtn) deployApkBtn.disabled = false;
    if (uploadStatusPill) {
      uploadStatusPill.className = 'meta-pill success';
      uploadStatusPill.textContent = 'Ready to Deploy';
    }
  } catch (e) {
    if (stagedChecksumHash) stagedChecksumHash.textContent = 'Hash calculation failed';
    if (deployApkBtn) deployApkBtn.disabled = false;
  }
}

/**
 * Reset Staged File
 */
function resetStagedFile() {
  stagedApkFile = null;
  stagedSha256Hash = '';
  if (apkFileInput) apkFileInput.value = '';
  if (dropZonePrompt) dropZonePrompt.style.display = 'block';
  if (stagedFileCard) stagedFileCard.style.display = 'none';
  if (stagedChecksumBox) stagedChecksumBox.style.display = 'none';
  if (deployApkBtn) deployApkBtn.disabled = true;
  if (uploadStatusPill) {
    uploadStatusPill.className = 'meta-pill warning';
    uploadStatusPill.textContent = 'Ready for Upload';
  }
}

/**
 * Handle Deploy APK Update
 */
async function handleDeployApk() {
  const version = newVersionInput?.value.trim();
  const releaseTag = newReleaseTagInput?.value.trim();
  const minAndroid = newMinAndroidInput?.value.trim() || 'Android 8.0+';
  const notes = releaseNotesInput?.value.trim() || 'Universal Android Release';

  if (!version || !releaseTag) {
    showToast('Please enter both a Version number and Release Tag.');
    return;
  }

  deployApkBtn.disabled = true;
  if (uploadProgressWrapper) uploadProgressWrapper.style.display = 'block';
  updateProgress(20, 'Reading APK package...');

  try {
    let base64Data = '';
    const fileName = `Auralis-${releaseTag}-universal.apk`;

    if (stagedApkFile) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1] || res);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(stagedApkFile);
      base64Data = await base64Promise;
    }

    updateProgress(55, 'Uploading to server...');

    const res = await fetch('/api/admin/upload-apk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName,
        version,
        releaseTag,
        minAndroidVersion: minAndroid,
        releaseNotes: notes,
        sha256: stagedSha256Hash,
        fileBase64: base64Data,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      updateProgress(100, 'Deployment Complete!');
      showToast(`Successfully deployed Auralis ${releaseTag}! 🎉`, 5000);
      resetStagedFile();
      await refreshActiveApkSpecs();
    } else {
      throw new Error(data.error || 'Deployment failed');
    }
  } catch (err: any) {
    showToast('Deployment error: ' + err.message, 5000);
  } finally {
    setTimeout(() => {
      if (uploadProgressWrapper) uploadProgressWrapper.style.display = 'none';
      if (deployApkBtn) deployApkBtn.disabled = false;
    }, 1200);
  }
}

/**
 * Update Progress Bar
 */
function updateProgress(percent: number, status: string) {
  if (uploadProgressBar) uploadProgressBar.style.width = `${percent}%`;
  if (progressPercentText) progressPercentText.textContent = `${percent}%`;
  if (progressStatusText) progressStatusText.textContent = status;
}

/**
 * Show Toast
 */
function showToast(message: string, duration = 3500) {
  if (toastTimeout) clearTimeout(toastTimeout);
  if (adminToastText) adminToastText.textContent = message;
  if (adminToast) adminToast.classList.add('is-visible');

  toastTimeout = window.setTimeout(() => {
    if (adminToast) adminToast.classList.remove('is-visible');
  }, duration);
}
