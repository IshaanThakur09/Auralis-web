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
    tagline: "High-fidelity music client",
    category: "Audio",
    status: "Stable",
    version: "1.1.0",
    updated: "2026-09-27",
    minAndroid: "7.0+",
    size: "43.34 MB",
    license: "GPL-3.0",
    summary:
      "A YouTube Music player with word-by-word synced lyrics, Listen Together rooms, an offline song cache and listening stats that follow your account. Built to stay out of the way of the music.",
    highlights: [
      "Word-by-word synced lyrics, cached for offline",
      "Listen Together rooms with host controls",
      "Offline song cache, playlist downloads, gapless playback",
      "Listening stats backed up to your account",
    ],
    permissions: ["INTERNET", "FOREGROUND_SERVICE", "WAKE_LOCK", "POST_NOTIFICATIONS", "RECORD_AUDIO", "REQUEST_INSTALL_PACKAGES"],
    builds: [
      {
        arch: "universal",
        size: "43.34 MB",
        sha: "83fe68694b985cf58ff620b4b184eb5cff01a740fefe59573f9562fae29a91f1",
        url: "/downloads/Auralis-v1.1.0-universal.apk",
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
