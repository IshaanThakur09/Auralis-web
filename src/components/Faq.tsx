import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "../utils/cn";
import { Reveal } from "../lib/motion";
import { ORG_URL } from "../utils/constants";

const FAQS = [
  {
    q: "Is the app safe to use?",
    a: "Yes. Auralis is 100% open-source under the GNU General Public License v3.0 (GPL-3.0). This strong copyleft license guarantees that the code is publicly auditable on GitHub and legally ensures that all modifications and derivatives must remain free and open. There is zero telemetry, no hidden tracking, and no proprietary spyware.",
  },
  {
    q: "Why isn't it on the Play Store?",
    a: "Google does not allow third-party YouTube clients on the Play Store. You can safely download updates from GitHub or this website.",
  },
  {
    q: "Why is the Auralis APK only ~8 MB compared to other 30–100 MB music apps?",
    a: "Auralis is engineered with a 100% native Jetpack Compose and modern AndroidX architecture. Unlike bloated cross-platform apps that bundle heavy Electron, Flutter, React Native, or multi-megabyte C/C++ runtime libraries, Auralis interfaces directly with Android's lean system audio pipeline. Combined with aggressive whole-program R8 tree shaking and ProGuard dead-code elimination, every unused class and debug symbol is stripped away, producing an ultra-fast, featherweight universal package.",
  },
  {
    q: "How to update?",
    a: "Use the in-app updater, or download the latest APK from GitHub Releases and install it over the old version.",
  },
  {
    q: "Can I log in with my Google account?",
    a: "Yes, Auralis supports Google account login and Firebase Cloud Sync to synchronize your playlists and library.",
  },
  {
    q: "Is there an iOS version?",
    a: "No, Auralis is Android-only and we are not planning to have an iOS version.",
  },
  {
    q: "What is \"Listen Together\" and how does it work?",
    a: "Listen Together allows you to create a shared room with a unique 6-character code. Friends join using the code and their playback position, play/pause states, and queue automatically synchronize in real time.",
  },
  {
    q: "Can I play music offline without an internet connection?",
    a: "Yes, you can cache and save music to play offline without an internet connection.",
  },
  {
    q: "Does Auralis support Android lock-screen and Quick Settings media controls?",
    a: "Yes, Auralis natively integrates with the Android system media card, giving you lock-screen playback controls, an interactive scrub seekbar, high-res artwork, and uninterrupted background playback.",
  },
  {
    q: "Can I import playlists from Spotify and YouTube?",
    a: "Yes, you can easily import playlists by pasting public Spotify or YouTube playlist links directly into your library.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative scroll-mt-0 border-t border-edge px-5 pt-8 pb-20 sm:px-10 sm:pt-10 sm:pb-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-10">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone-500">04 — FAQ</p>
              <h2 className="mt-3 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-bone-50 sm:text-5xl">
                Reasonable
                <br />
                questions
              </h2>
              <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-bone-300">
                If the answer you need is not here, our GitHub issue tracker is open and we read every report.
              </p>
              <a
                href={`${ORG_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="hot-link mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-100"
              >
                GitHub Issues →
              </a>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal as="li" key={f.q} delay={i * 45} className="spot border-b border-edge first:border-t">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[10px] tabnum text-bone-500">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-display text-lg font-medium transition-colors duration-300 sm:text-xl",
                            isOpen ? "text-bone-50" : "text-bone-200 group-hover:text-bone-50"
                          )}
                        >
                          {f.q}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border transition-all duration-400",
                          isOpen
                            ? "rotate-45 border-bone-50 bg-bone-50 text-ink-950"
                            : "border-edge-hi text-bone-300 group-hover:border-bone-200"
                        )}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-${i}`}
                    className={cn(
                      "grid transition-all duration-500 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-2xl pb-7 leading-relaxed text-bone-300 sm:pl-9">{f.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
