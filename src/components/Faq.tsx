import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "../utils/cn";
import { Reveal } from "../lib/motion";
import { ORG_URL } from "../utils/constants";

const FAQS = [
  {
    q: "How can I review the app before installing?",
    a: "Auralis's source code is available on GitHub under GPL-3.0. You can review the code and compare the downloaded APK's SHA-256 checksum with the one shown here. The app has no advertising or analytics SDK, but it connects to third-party services for streaming, lyrics, updates and optional features. See the Privacy Policy for those data flows. Open source code and a matching checksum do not guarantee that an app is risk-free.",
  },
  {
    q: "Why isn't it on the Play Store?",
    a: "Auralis is currently distributed directly through this website and GitHub Releases rather than the Play Store. Check the version and SHA-256 checksum before installing an APK.",
  },
  {
    q: "Why is the APK about 25 MB?",
    a: "The release is a universal APK with native code for arm64-v8a, armeabi-v7a, x86 and x86_64. It supports Android 7.0 and later on those architectures. The Discord SDK contributes substantially to its size. Device-specific compatibility can still vary.",
  },
  {
    q: "How to update?",
    a: "For the rebuilt 1.1.1 release, download the APK from this website and open it in Android's installer. It has the same version code as the earlier 1.1.1 build, so the in-app updater may not offer it. Android can install it over the earlier build because both use the same signing certificate; follow the installer prompts.",
  },
  {
    q: "Which certificate signs the current APK?",
    a: "The rebuilt 1.1.1 APK is a minified release build signed with the same Android Debug certificate as the previous hosted 1.1.1 build. Android updates require the same signing certificate; a differently signed build cannot install over it. The SHA-256 on this page identifies the APK file, not its signing key.",
  },
  {
    q: "Can I log in with my Google account?",
    a: "Yes. Sign in with Google or email and password to back up your playlists, liked songs, saved artists and listening stats. After reinstalling or switching phones, sign in with the same account to restore data that was successfully backed up.",
  },
  {
    q: "Is there an iOS version?",
    a: "There is no iOS release at present. The published app is for Android.",
  },
  {
    q: "What is \"Listen Together\" and how does it work?",
    a: "Listen Together lets you create a shared room with a 6-character code. Playback position, play/pause state and the queue synchronize across members, subject to network and buffering delays.",
  },
  {
    q: "Can I play music offline without an internet connection?",
    a: "Fully cached or downloaded tracks, including playlist downloads, can play offline while their files are available on your device. New searches and streams require a connection. Use of third-party content remains subject to its source's terms and rights.",
  },
  {
    q: "Does Auralis support Android lock-screen and Quick Settings media controls?",
    a: "Auralis integrates with Android's media controls for lock-screen playback and seeking. Background playback may vary with the device, network and source availability.",
  },
  {
    q: "Can I import playlists from Spotify and YouTube?",
    a: "Yes. Paste a public Spotify or YouTube playlist link. Imports filter identifiable Shorts when metadata is available and preserve an existing local playlist with the same name.",
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
                If the answer you need is not here, you can open a report in our GitHub issue tracker.
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
