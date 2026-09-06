import { useState } from "react";
import { Download, ArrowUpRight, Check, Copy } from "lucide-react";
import { Reveal } from "../lib/motion";
import { Magnetic } from "../lib/pointer";
import GithubIcon from "./GithubIcon";
import { useApkMetadata } from "../lib/useApkMetadata";

function ShaCell({ sha }: { sha: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(sha);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
      className="group/sha inline-flex max-w-full items-center gap-1.5 font-mono text-[11px] text-bone-400 transition-colors hover:text-bone-50"
      title={sha}
    >
      <span className="truncate max-w-[120px] sm:max-w-[200px]">
        {sha.slice(0, 10)}…{sha.slice(-6)}
      </span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-bone-50" />
      ) : (
        <Copy className="h-3 w-3 shrink-0 opacity-50 transition-opacity group-hover/sha:opacity-100" />
      )}
    </button>
  );
}

export default function DownloadHub() {
  const { appData } = useApkMetadata();
  const auralis = appData.find((a) => a.id === "auralis") || appData[0];

  if (!auralis) return null;

  return (
    <section id="download" className="relative scroll-mt-0 border-t border-edge px-4 pt-8 pb-20 sm:px-10 sm:pt-10 sm:pb-28">
      {/* header */}
      <div className="grid gap-6 border-b border-edge pb-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone-500">03 — Official Build</p>
          <h2 className="mt-3 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-bone-50 sm:text-6xl">
            Signed Universal Build
          </h2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-5">
          <p className="max-w-sm text-[15px] leading-relaxed text-bone-300 lg:ml-auto lg:text-right">
            Verified release build with architecture breakdown, SHA-256 checksums, and declared Android permissions.
            Direct APK download with zero telemetry.
          </p>
        </Reveal>
      </div>

      {/* Auralis Build Card */}
      <div className="pt-10 min-w-0 max-w-full">
        <Reveal className="border border-edge bg-ink-900/50 p-5 sm:p-8 md:p-10 min-w-0 max-w-full overflow-hidden">
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 min-w-0 w-full">
            {/* left: summary + highlights */}
            <div className="min-w-0 w-full lg:col-span-6">
              <div className="flex items-baseline gap-3 sm:gap-4">
                <span className="font-mono text-[12px] text-bone-500">01</span>
                <div>
                  <h3 className="font-display text-3xl font-semibold text-bone-50 sm:text-4xl">
                    {auralis.name}
                  </h3>
                  <p className="mt-1 font-mono text-[12px] text-bone-400">{auralis.tagline}</p>
                </div>
              </div>

              <p className="mt-6 text-[15px] leading-relaxed text-bone-200 break-words">
                {auralis.summary}
              </p>

              <ul className="mt-6 space-y-2.5 font-mono text-[12px] text-bone-300 min-w-0">
                {auralis.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 min-w-0 break-words">
                    <span className="mt-2 h-px w-3 shrink-0 bg-bone-500" />
                    <span className="min-w-0 break-words">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                {auralis.builds[0]?.url && (
                  <Magnetic strength={0.2}>
                    <a
                      href={auralis.builds[0].url}
                      download="Auralis-v1.0.0-universal.apk"
                      data-cursor={auralis.size}
                      className="btn-solid text-center w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4" />
                      Download {auralis.name} ({auralis.size})
                    </a>
                  </Magnetic>
                )}
                {auralis.repo && (
                  <a
                    href={auralis.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="Repo"
                    className="btn-ghost text-center w-full sm:w-auto"
                  >
                    <GithubIcon className="h-4 w-4" />
                    Source on GitHub
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* right: specs & checksums */}
            <div className="min-w-0 w-full lg:col-span-6">
              <dl className="grid grid-cols-2 gap-3 sm:gap-x-8 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:grid-cols-4">
                {[
                  ["Version", `v${auralis.version}`],
                  ["Updated", auralis.updated],
                  ["Min SDK", `Android ${auralis.minAndroid}`],
                  ["License", auralis.license],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-edge py-3 min-w-0">
                    <dt className="text-bone-500 truncate">{k}</dt>
                    <dd className="mt-1 tabnum text-bone-100 truncate">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Desktop Build table */}
              <div className="mt-8 hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-y border-edge">
                      {["Architecture", "Size", "SHA-256 Checksum", ""].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="py-2.5 pr-4 font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-bone-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auralis.builds.map((b) => (
                      <tr key={b.arch} className="spot border-b border-edge">
                        <td className="py-3.5 pr-4 font-mono text-[12px] text-bone-100">{b.arch}</td>
                        <td className="py-3.5 pr-4 font-mono text-[12px] tabnum text-bone-300">{b.size}</td>
                        <td className="py-3.5 pr-4">
                          <ShaCell sha={b.sha || ""} />
                        </td>
                        <td className="py-3.5 text-right">
                          {b.url ? (
                            <a
                              href={b.url}
                              download="Auralis-v1.0.0-universal.apk"
                              data-cursor="Get APK"
                              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-bone-300 transition-colors hover:text-bone-50"
                            >
                              <Download className="h-3.5 w-3.5" />
                              apk
                            </a>
                          ) : (
                            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-bone-500">
                              pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Build Card (optimized for phone resolutions) */}
              <div className="mt-6 block sm:hidden border border-edge bg-ink-950/60 p-4 font-mono">
                <div className="flex items-center justify-between border-b border-edge/60 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-bone-500">Architecture</span>
                    <p className="mt-0.5 text-[12px] font-medium text-bone-100 uppercase">{auralis.builds[0]?.arch || "universal"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-bone-500">Size</span>
                    <p className="mt-0.5 text-[12px] tabnum text-bone-200">{auralis.builds[0]?.size || auralis.size}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] uppercase tracking-wider text-bone-500">SHA-256 Checksum</span>
                  <div className="mt-1.5 flex items-center justify-between gap-2 border border-edge bg-ink-900/90 px-3 py-2 text-[11px] text-bone-300">
                    <span className="truncate font-mono text-[10px]">
                      {auralis.builds[0]?.sha ? `${auralis.builds[0].sha.slice(0, 10)}…${auralis.builds[0].sha.slice(-6)}` : "—"}
                    </span>
                    {auralis.builds[0]?.sha && <ShaCell sha={auralis.builds[0].sha} />}
                  </div>
                </div>

                {auralis.builds[0]?.url && (
                  <a
                    href={auralis.builds[0].url}
                    download="Auralis-v1.0.0-universal.apk"
                    className="mt-3.5 flex w-full items-center justify-center gap-2 border border-edge-hi bg-ink-850 py-2.5 text-[11px] uppercase tracking-wider text-bone-100 transition-colors hover:border-bone-200 hover:text-bone-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download APK ({auralis.builds[0]?.size || auralis.size})
                  </a>
                )}
              </div>

              <div className="mt-6 border-t border-edge pt-4">
                <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-bone-500 break-words">
                  Android Permissions: {auralis.permissions.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

