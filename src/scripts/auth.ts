/**
 * Google Authentication Service for Auralis Admin Panel
 * Uses Google Identity Services (GSI)
 * Requires VITE_GOOGLE_CLIENT_ID in .env
 */

export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

const SESSION_STORAGE_KEY = 'auralis_admin_google_user';
export const AUTHORIZED_ADMIN_EMAIL = 'ishaanthakur49@gmail.com';
export const DEFAULT_GOOGLE_CLIENT_ID = '658283139281-fkas76bbb5cgcg89dqu62kpd9a8rlsam.apps.googleusercontent.com';

export function getGoogleClientId(): string {
  const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  return envId.length > 0 ? envId : DEFAULT_GOOGLE_CLIENT_ID;
}

export function isAuthConfigured(): boolean {
  return getGoogleClientId().length > 0;
}

export function isAuthorizedAdmin(email: string): boolean {
  return email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
}

export function getStoredUser(): GoogleUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeUser(user: GoogleUser): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

export function clearUser(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}

/**
 * Decode JWT token returned by Google Identity Services
 */
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT:', e);
    return null;
  }
}

/**
 * Dynamically load Google Identity Services SDK (Never hangs)
 */
export function loadGoogleGsiScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).google?.accounts) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as any).google?.accounts) {
        resolve();
        return;
      }
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => resolve());
      // Safety timeout: never block execution longer than 800ms
      setTimeout(() => resolve(), 800);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    setTimeout(() => resolve(), 800);
    document.head.appendChild(script);
  });
}
