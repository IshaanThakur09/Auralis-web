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

export function getGoogleClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
}

export function isAuthConfigured(): boolean {
  return getGoogleClientId().length > 0;
}

export function isAuthorizedAdmin(email: string): boolean {
  return email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
}

export function getStoredUser(): GoogleUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeUser(user: GoogleUser): void {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
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
 * Dynamically load Google Identity Services SDK
 */
export function loadGoogleGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google SDK')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google SDK'));
    document.head.appendChild(script);
  });
}
