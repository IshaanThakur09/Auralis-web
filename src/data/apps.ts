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
    version: "1.0.0",
    updated: "2026-09-02",
    minAndroid: "7.0+",
    size: "8.18 MB",
    license: "GPL-3.0",
    summary:
      "A lightweight streaming and local-library player with millisecond-accurate synced lyrics, shared listening rooms and bit-perfect output. Built to stay out of the way of the music.",
    highlights: [
      "Line-by-line synced lyrics, cached for offline",
      "Listen Together rooms with sample-accurate sync",
      "32-bit float pipeline, gapless, USB exclusive mode",
      "YouTube Music streaming with background audio playback",
    ],
    permissions: ["INTERNET", "FOREGROUND_SERVICE", "WAKE_LOCK", "POST_NOTIFICATIONS"],
    builds: [
      {
        arch: "universal",
        size: "8.18 MB",
        sha: "d5af6e8546dc50dec4c54f7341fa27b8663e407bd3245dc0c910fc74f9bdbd15",
        url: "/downloads/Auralis-v1.0.0-universal.apk",
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
