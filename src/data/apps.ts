export type Build = {
  arch: string;
  size: string;
  /** Empty until you publish a real checksum. */
  sha?: string;
  /** Empty until you publish a real download. */
  url?: string;
};

export type App = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  category: "Audio";
  status: "Stable" | "Beta";
  version: string;
  /** ISO date string. */
  updated: string;
  minAndroid: string;
  /** Advertised size for the universal build. */
  size: string;
  license: string;
  summary: string;
  highlights: string[];
  permissions: string[];
  builds: Build[];
  repo?: string;
};

export const APPS: App[] = [
  {
    id: "auralis",
    index: "01",
    name: "Auralis",
    tagline: "Music player for Android",
    category: "Audio",
    status: "Stable",
    version: "1.1.1",
    updated: "2026-09-28",
    minAndroid: "7.0+",
    size: "24.95 MB",
    license: "GPL-3.0",
    summary:
      "A YouTube Music player with word-by-word synced lyrics, Listen Together rooms, an offline song cache and listening stats that follow your account. Built to stay out of the way of the music.",
    highlights: [
      "Timed word highlighting when lyrics are available",
      "Listen Together rooms with host controls",
      "Offline replay of available cached tracks and gapless playback",
      "Listening stats backed up to your account",
    ],
    permissions: ["INTERNET", "FOREGROUND_SERVICE", "WAKE_LOCK", "POST_NOTIFICATIONS", "RECORD_AUDIO", "REQUEST_INSTALL_PACKAGES"],
    builds: [
      {
        arch: "universal",
        size: "24.95 MB",
        sha: "ce6ea028aa43f1545c7b4af2d3b8cb0f533ee865f60fc81232bc993af79b25d6",
        url: "/downloads/Auralis-v1.1.1-universal.apk",
      },
    ],
    repo: "https://github.com/Shreyanshh071/Auralis",
  },
];

export const CATEGORIES = ["Audio"] as const;

/* Handy computed totals for the UI */
const parseMB = (s: string) => parseFloat(s.replace(/[^\d.]/g, "")) || 0;

export const TOTAL_APPS = APPS.length;
export const TOTAL_SIZE_MB = APPS.reduce((acc, a) => acc + parseMB(a.size), 0);
export const STABLE_COUNT = APPS.filter((a) => a.status === "Stable").length;
export const BETA_COUNT = APPS.filter((a) => a.status === "Beta").length;
