import { ArrowUpRight, ArrowUp, Download } from "lucide-react";
import { Reveal } from "../lib/motion";
import { Magnetic } from "../lib/pointer";
import GithubIcon from "./GithubIcon";
import { ORG_URL } from "../utils/constants";
import { useApkMetadata } from "../lib/useApkMetadata";

export default function Footer({
  onOpenLegal,
}: {
  onOpenLegal?: (doc: "privacy" | "terms") => void;
}) {
  const { meta } = useApkMetadata();
  const downloadUrl = meta?.downloadUrl || "/downloads/Auralis-v1.0.0-universal.apk";
  const size = meta?.fileSizeFormatted || "8.18 MB";

  return (
    <footer className="relative border-t border-edge">
      {/* closing call */}
      <div className="relative overflow-hidden px-5 py-24 sm:px-10 sm:py-32">
        <div className="relative">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone-500">
              High-Fidelity Sound · Direct APK
            </p>
            <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.4rem,7vw,5.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-bone-50">
              Get Auralis
              <br />
              for Android
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.26}>
                <a
                  href={downloadUrl}
                  download="Auralis-v1.0.0-universal.apk"
                  data-cursor={size}
                  className="btn-solid"
                >
                  <Download className="h-4 w-4" />
                  Download Auralis ({size})
                </a>
              </Magnetic>
              <Magnetic strength={0.18}>
                <a
                  href={ORG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="GitHub"
                  className="btn-ghost"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub Repository
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>

      {/* link grid */}
      <div className="grid gap-10 border-t border-edge px-5 py-14 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Auralis" className="h-7 w-7 object-contain" />
            <span className="font-display text-lg font-semibold tracking-tight text-bone-50">Auralis</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-400">
            A sleek, open-source music streaming player engineered with synchronized lyrics, collaborative
            Listen Together rooms, and seamless YouTube Music integration.
          </p>
          <div className="mt-5 flex items-center gap-2 font-mono text-[11px] text-bone-400">
            <span className="h-2 w-2 rounded-full bg-bone-200 anim-blink" />
            <span>Core Audio · Latest Version · GPL-3.0 License</span>
          </div>
        </div>

        <nav aria-label="Navigation" className="lg:col-span-3 lg:col-start-7">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-500">Navigation</h3>
          <ul className="mt-5 space-y-2.5">
            {[
              ["Capabilities", "#features"],
              ["Download APK", "#download"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="hot-link text-sm text-bone-300 transition-colors hover:text-bone-50">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal & Code" className="lg:col-span-3">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-500">Legal & Code</h3>
          <ul className="mt-5 space-y-2.5">
            {[
              { label: "Privacy Policy", doc: "privacy" as const },
              { label: "Terms of Service", doc: "terms" as const },
              { label: "GitHub Releases", href: `${ORG_URL}/releases` },
              { label: "GPL-3.0 License", href: `${ORG_URL}/blob/main/LICENSE` },
            ].map((item) => (
              <li key={item.label}>
                {"doc" in item ? (
                  <a
                    href={`#${item.doc}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenLegal?.(item.doc);
                    }}
                    className="hot-link inline-flex items-center gap-1.5 text-sm text-bone-300 transition-colors hover:text-bone-50 cursor-pointer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hot-link inline-flex items-center gap-1.5 text-sm text-bone-300 transition-colors hover:text-bone-50"
                  >
                    {item.label}
                    <ArrowUpRight className="h-3 w-3 text-bone-500" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* disclaimer & baseline */}
      <div className="border-t border-edge px-5 py-8 sm:px-10">
        <p className="max-w-4xl text-xs leading-relaxed text-bone-500">
          Disclaimer: Auralis is an independent, free, and open-source project and is not affiliated with,
          sponsored by, or endorsed by Google LLC, YouTube, or Spotify. YouTube and YouTube Music are trademarks
          of Google LLC. Spotify is a trademark of Spotify AB.
        </p>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-edge/60 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-500">
            © 2026 Auralis · Open source under GPL-3.0 License
          </p>
          <a
            href="#index"
            data-cursor="Top"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-400 transition-colors hover:text-bone-50"
          >
            Back to top
            <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
