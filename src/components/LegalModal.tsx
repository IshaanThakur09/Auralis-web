import { useEffect } from "react";
import { X, ShieldCheck, FileText, ArrowUpRight, ExternalLink } from "lucide-react";
import { ORG_URL } from "../utils/constants";

interface LegalModalProps {
  activeDoc: "privacy" | "terms" | null;
  onClose: () => void;
  onSelectDoc: (doc: "privacy" | "terms") => void;
}

export default function LegalModal({ activeDoc, onClose, onSelectDoc }: LegalModalProps) {
  useEffect(() => {
    if (!activeDoc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeDoc, onClose]);

  if (!activeDoc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-ink-950/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col border border-edge-hi bg-ink-900 shadow-2xl shadow-black/80">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-edge px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Auralis" className="h-6 w-6 object-contain" />
            <span className="font-display text-base font-semibold tracking-tight text-bone-50">
              Auralis
              <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.2em] text-bone-400">
                Official Legal Text
              </span>
            </span>
          </div>

          {/* Doc switcher tabs */}
          <div className="hidden sm:flex items-center gap-1 border border-edge bg-ink-950/80 p-1 font-mono text-[11px] uppercase tracking-[0.14em]">
            <button
              type="button"
              onClick={() => onSelectDoc("privacy")}
              className={`flex items-center gap-1.5 px-3 py-1 transition-colors ${
                activeDoc === "privacy"
                  ? "bg-ink-800 text-bone-50 font-semibold border border-edge-hi"
                  : "text-bone-400 hover:text-bone-100"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onSelectDoc("terms")}
              className={`flex items-center gap-1.5 px-3 py-1 transition-colors ${
                activeDoc === "terms"
                  ? "bg-ink-800 text-bone-50 font-semibold border border-edge-hi"
                  : "text-bone-400 hover:text-bone-100"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Terms of Service
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="group flex items-center gap-2 border border-edge bg-ink-950/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-400 transition-colors hover:border-edge-hi hover:text-bone-50"
          >
            <span>Close</span>
            <kbd className="hidden sm:inline-block border border-edge bg-ink-900 px-1 py-0.2 text-[9px] text-bone-400 group-hover:text-bone-100">
              ESC
            </kbd>
            <X className="h-3.5 w-3.5 text-bone-300 group-hover:text-bone-50" />
          </button>
        </div>

        {/* Mobile tabs row */}
        <div className="flex border-b border-edge bg-ink-950/40 p-2 sm:hidden font-mono text-[10px] uppercase tracking-[0.14em]">
          <button
            type="button"
            onClick={() => onSelectDoc("privacy")}
            className={`flex-1 py-1.5 text-center transition-colors ${
              activeDoc === "privacy"
                ? "bg-ink-800 text-bone-50 font-semibold border border-edge"
                : "text-bone-400"
            }`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onSelectDoc("terms")}
            className={`flex-1 py-1.5 text-center transition-colors ${
              activeDoc === "terms"
                ? "bg-ink-800 text-bone-50 font-semibold border border-edge"
                : "text-bone-400"
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* Document Header */}
        <div className="border-b border-edge bg-ink-950/40 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-500">
            <span className="flex items-center gap-1.5 text-bone-300">
              <span className="h-1.5 w-1.5 rounded-full bg-bone-200" />
              {activeDoc === "privacy" ? "Effective Date: August 26, 2026" : "Last updated: August 2026"}
            </span>
            <span>·</span>
            <span>GPL-3.0 Copyleft</span>
            <span>·</span>
            <span>Zero Telemetry</span>
          </div>
          <h2
            id="legal-modal-title"
            className="mt-3 font-display text-3xl font-semibold uppercase leading-tight tracking-[-0.03em] text-bone-50 sm:text-4xl"
          >
            {activeDoc === "privacy" ? "Privacy Policy" : "Terms of Service"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone-300">
            {activeDoc === "privacy"
              ? "Our formal guarantee of user data sovereignty, transparent architecture, and zero tracking."
              : "Plain-language terms of use governing open-source access, third-party media endpoints, and GPL-3.0 licensing."}
          </p>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 font-body text-bone-200">
          {activeDoc === "privacy" ? (
            <div className="space-y-8 text-sm leading-relaxed">
              <section className="space-y-3">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  1. Introduction
                </h3>
                <p className="text-bone-300">
                  Auralis (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is a free and open-source music streaming client. This Privacy Policy explains our commitment to user privacy, transparent data practices, and compliance with applicable legal standards and API developer policies.
                </p>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  2. Zero Personal Data Collection & Tracking
                </h3>
                <p className="text-bone-300">Auralis is built with a privacy-by-design architecture:</p>
                <ul className="list-disc space-y-2 pl-5 text-bone-200">
                  <li>
                    We do <strong className="text-bone-50">not</strong> collect, harvest, store, or sell any personally identifiable information (PII).
                  </li>
                  <li>
                    We do <strong className="text-bone-50">not</strong> embed third-party advertising SDKs, commercial telemetry, analytics, or behavioral trackers.
                  </li>
                  <li>
                    We do <strong className="text-bone-50">not</strong> require user registration or account creation to access core music features.
                  </li>
                </ul>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  3. Third-Party Services & YouTube API Compliance
                </h3>
                <p className="text-bone-300">Auralis interacts with external services to provide content and features:</p>
                <div className="space-y-3 pl-2">
                  <div className="border-l-2 border-edge-hi pl-4">
                    <strong className="text-bone-100">YouTube API Services:</strong>
                    <p className="mt-1 text-bone-300">
                      Auralis uses YouTube API Services to retrieve music metadata and stream public content. By using Auralis, you agree to be bound by the{" "}
                      <a
                        href="https://www.youtube.com/t/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-bone-50 underline underline-offset-4 hover:text-white"
                      >
                        YouTube Terms of Service
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      . User data accessed via YouTube API is handled in strict accordance with the{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-bone-50 underline underline-offset-4 hover:text-white"
                      >
                        Google Privacy Policy
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      .
                    </p>
                  </div>
                  <div className="border-l-2 border-edge-hi pl-4">
                    <strong className="text-bone-100">Revoking Access:</strong>
                    <p className="mt-1 text-bone-300">
                      You can manage or revoke access to your Google permissions at any time through the{" "}
                      <a
                        href="https://security.google.com/settings/security/permissions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-bone-50 underline underline-offset-4 hover:text-white"
                      >
                        Google Security Settings page
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      .
                    </p>
                  </div>
                  <div className="border-l-2 border-edge-hi pl-4">
                    <strong className="text-bone-100">LRCLIB:</strong>
                    <p className="mt-1 text-bone-300">
                      Synchronized song lyrics are fetched on demand from the community-driven LRCLIB API. No user data is transmitted during lyric requests.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  4. Local Data Storage & Cloud Sync
                </h3>
                <p className="text-bone-300">
                  By default, all user data—including custom playlists, playback history, audio cache, and settings—is stored locally on your device.
                </p>
                <p className="text-bone-300">
                  <strong className="text-bone-100">Optional Cloud Sync:</strong> If you voluntarily choose to sign in with your Google account, your saved playlists and favorites are synchronized securely via Firebase Cloud Sync to enable cross-device access. We do not sell, monetize, or share this data with third parties.
                </p>
                <p className="text-bone-300">
                  <strong className="text-bone-100">Data Deletion:</strong> You retain complete control over your data. You can delete all local data, cached audio files, and playlist records at any time by selecting &quot;Clear Cache&quot; in app settings or by clearing application data via your Android device settings. You can also delete your cloud-synced account data by signing out or requesting deletion.
                </p>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  5. Device Permissions
                </h3>
                <p className="text-bone-300">
                  Auralis requests only the minimum necessary permissions required for core audio functionality:
                </p>
                <ul className="list-disc space-y-2 pl-5 text-bone-200">
                  <li>
                    <strong className="text-bone-100">Internet Access:</strong> To stream audio tracks and fetch synchronized lyrics.
                  </li>
                  <li>
                    <strong className="text-bone-100">Foreground Service & Audio Focus:</strong> To enable seamless background music playback and lock-screen media controls.
                  </li>
                  <li>
                    <strong className="text-bone-100">Notifications:</strong> To display active playback status in the system notification drawer.
                  </li>
                </ul>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  6. Children&apos;s Privacy (COPPA Compliance)
                </h3>
                <p className="text-bone-300">
                  Auralis is not directed toward children under 13 years of age. We do not knowingly collect or solicit any personal information from children.
                </p>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  7. Open Source Transparency
                </h3>
                <p className="text-bone-300">
                  Auralis is 100% open source under the GPL-3.0 License. The complete source code and network operations are publicly auditable on our{" "}
                  <a
                    href={ORG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-bone-50 underline underline-offset-4 hover:text-white"
                  >
                    GitHub repository
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                  .
                </p>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  8. Contact & Questions
                </h3>
                <p className="text-bone-300">
                  If you have questions or inquiries regarding this Privacy Policy, you can open an issue or start a discussion on our official{" "}
                  <a
                    href={`${ORG_URL}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-bone-50 underline underline-offset-4 hover:text-white"
                  >
                    GitHub Issues page
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                  .
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8 text-sm leading-relaxed">
              <section className="space-y-3">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  1. Terms of Use
                </h3>
                <p className="text-bone-300">
                  By accessing or using Auralis, you agree to comply with these terms. Auralis is a free, open-source client application distributed under the GNU General Public License v3.0 (GPL-3.0). Auralis does not host, upload, store, or own any audio, video, or copyrighted media. All media streamed through the app is sourced dynamically from public third-party APIs. You agree to use the application in full compliance with all applicable laws and third-party platform terms.
                </p>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  2. Third-Party Services
                </h3>
                <p className="text-bone-300">
                  Auralis connects to third-party APIs such as YouTube API Services. Your use of third-party features is subject to the respective provider&apos;s terms of service, including the{" "}
                  <a
                    href="https://www.youtube.com/t/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-bone-50 underline underline-offset-4 hover:text-white"
                  >
                    YouTube Terms of Service
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  and the{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-bone-50 underline underline-offset-4 hover:text-white"
                  >
                    Google Privacy Policy
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  3. Disclaimer of Warranty
                </h3>
                <p className="text-bone-300">
                  Auralis is provided &quot;as is&quot;, without warranty of any kind, express or implied, to the maximum extent permitted by applicable law, as stated in the GNU General Public License v3.0. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use of the software.
                </p>
              </section>

              <section className="space-y-3 border-t border-edge pt-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
                  4. Open Source License
                </h3>
                <p className="text-bone-300">
                  Auralis is distributed under the GNU General Public License v3.0 (GPL-3.0). You are free to run, study, share, and modify the software under the terms of the GPL-3.0 license. The full source code is publicly available on our{" "}
                  <a
                    href={ORG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-bone-50 underline underline-offset-4 hover:text-white"
                  >
                    GitHub repository
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                  .
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-edge bg-ink-950/60 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => onSelectDoc(activeDoc === "privacy" ? "terms" : "privacy")}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-400 transition-colors hover:text-bone-50"
          >
            Switch to {activeDoc === "privacy" ? "Terms of Service →" : "Privacy Policy →"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-edge bg-bone-50 px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-950 transition-colors hover:bg-bone-100"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
}
