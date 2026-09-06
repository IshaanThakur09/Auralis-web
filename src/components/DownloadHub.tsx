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
      className="group/sha inline-flex max-w-full items-center gap-2 font-mono text-[11px] text-bone-400 transition-colors hover:text-bone-50"
      title={sha}
    >
      <span className="truncate">{sha.slice(0, 16)}…{sha.slice(-6)}</span>
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
    <section id="download" className="relative scroll-mt-0 border-t border-edge px-5 pt-8 pb-20 sm:px-10 sm:pt-10 sm:pb-28">
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
      <div className="pt-10">
        <Reveal className="border border-edge bg-ink-900/50 p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* left: summary + highlights */}
            <div className="lg:col-span-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[12px] text-bone-500">01</span>
                <div>
                  <h3 className="font-display text-3xl font-semibold text-bone-50 sm:text-4xl">
                    {auralis.name}
                  </h3>
                  <p className="mt-1 font-mono text-[12px] text-bone-400">{auralis.tagline}</p>
                </div>
              </div>

              <p className="mt-6 text-[15px] leading-relaxed text-bone-200">
                {auralis.summary}
              </p>

              <ul className="mt-6 space-y-2 font-mono text-[12px] text-bone-300">
                {auralis.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <span className="mt-2 h-px w-3 shrink-0 bg-bone-500" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {auralis.builds[0]?.url && (
                  <Magnetic strength={0.2}>
                    <a
                      href={auralis.builds[0].url}
                      download="Auralis-v1.0.0-universal.apk"
                      data-cursor={auralis.size}
                      className="btn-solid"
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
                    className="btn-ghost"
                  >
                    <GithubIcon className="h-4 w-4" />
                    Source on GitHub
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* right: specs & checksums */}
            <div className="lg:col-span-6">
              <dl className="grid grid-cols-2 gap-x-8 font-mono text-[11px] uppercase tracking-[0.14em] sm:grid-cols-4">
                {[
                  ["Version", `v${auralis.version}`],
                  ["Updated", auralis.updated],
                  ["Min SDK", `Android ${auralis.minAndroid}`],
                  ["License", auralis.license],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-edge py-3">
                    <dt className="text-bone-500">{k}</dt>
                    <dd className="mt-1 tabnum text-bone-100">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Build table */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[360px] border-collapse text-left">
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
                          <ShaCell sha={b.sha} />
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

              <div className="mt-6 border-t border-edge pt-4">
                <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-bone-500">
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
