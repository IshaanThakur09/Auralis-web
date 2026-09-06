import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../utils/cn";
import { Reveal } from "../lib/motion";

const STEPS: Array<{ n: string; title: string; body: string }> = [
  {
    n: "01",
    title: "Permit your browser to install",
    body: "Settings → Apps → (your browser) → Install unknown apps. Android asks once per source. You are not disabling any security check — only naming who you trust.",
  },
  {
    n: "02",
    title: "Universal compatibility",
    body: "The Universal APK is featherweight (~8 MB) and engineered to run seamlessly across all Android CPU architectures (arm64-v8a, armeabi-v7a, x86, x86_64) with no architecture guesswork required.",
  },
  {
    n: "03",
    title: "Verify the checksum",
    body: "Optional but encouraged. Compare the SHA-256 in the catalog with the hash of your downloaded file. If they differ, delete it and tell us immediately.",
  },
  {
    n: "04",
    title: "Install and update",
    body: "Android verifies our signature on install. Later builds must be signed with the same key or the system refuses them — this is your protection against tampered mirrors.",
  },
];

const TABS = [
  { id: "linux", label: "Linux / macOS", cmd: "sha256sum Auralis-v1.0.0-universal.apk" },
  { id: "win", label: "Windows", cmd: "certutil -hashfile Auralis-v1.0.0-universal.apk SHA256" },
  { id: "adb", label: "adb", cmd: "adb install -r Auralis-v1.0.0-universal.apk" },
];

export default function Install() {
  const [tab, setTab] = useState(TABS[0]);
  const [copied, setCopied] = useState(false);

  return (
    <section id="install" className="relative scroll-mt-24 border-t border-edge px-5 py-24 sm:px-10 sm:py-32">
      <div className="grid gap-6 border-b border-edge pb-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone-500">04 — Install</p>
          <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-bone-50 sm:text-6xl">
            Sideloading, plainly
          </h2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-5">
          <p className="max-w-sm text-[15px] leading-relaxed text-bone-300 lg:ml-auto lg:text-right">
            Four steps, once per device. Nothing here roots your phone, disables Play Protect, or
            asks you to trust us more than you trust arithmetic.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-12 pt-10 lg:grid-cols-12">
        {/* steps */}
        <ol className="lg:col-span-7">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 80} className="spot grid grid-cols-12 gap-4 border-b border-edge py-7">
              <span className="col-span-2 font-mono text-[11px] tabnum text-bone-500 sm:col-span-1">{s.n}</span>
              <div className="col-span-10 sm:col-span-11">
                <h3 className="font-display text-xl font-semibold text-bone-50">{s.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-bone-300">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* terminal */}
        <Reveal delay={200} className="lg:col-span-5">
          <div className="spot sticky top-28 border border-edge bg-ink-900">
            <div className="flex items-center justify-between border-b border-edge px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-500">
                verify
              </span>
              <div className="flex gap-1" role="tablist" aria-label="Platform">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={tab.id === t.id}
                    onClick={() => {
                      setTab(t);
                      setCopied(false);
                    }}
                    className={cn(
                      "px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-300",
                      tab.id === t.id ? "bg-bone-50 text-ink-950" : "text-bone-400 hover:text-bone-100"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              <pre className="scrollbar-none overflow-x-auto font-mono text-[12px] leading-relaxed text-bone-100">
                <code>
                  <span className="text-bone-500">$ </span>
                  {tab.cmd}
                  <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 bg-bone-200 anim-blink" />
                </code>
              </pre>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(tab.cmd);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  } catch {
                    setCopied(false);
                  }
                }}
                className="mt-5 inline-flex items-center gap-2 border border-edge-hi px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-300 transition-colors hover:border-bone-200 hover:text-bone-50"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy command"}
              </button>

              <p className="mt-6 border-t border-edge pt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-bone-500">
                Expected output must match the SHA-256 listed beside the build in the catalog.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
