import { cn } from "../utils/cn";
import { Reveal } from "../lib/motion";

type Kind = "release" | "patch" | "security";

type Entry = {
  date: string;
  app: string;
  version: string;
  kind: Kind;
  note: string;
};

const LOG: Entry[] = [
  {
    date: "2026-09-02",
    app: "Auralis",
    version: "1.0.0",
    kind: "release",
    note: "First public release — YouTube Music streaming, synced lyrics via LRCLIB, Listen Together multi-room, bit-perfect 32-bit float audio pipeline, and zero telemetry.",
  },
];

const KIND_LABEL: Record<Kind, string> = {
  release: "feature",
  patch: "patch",
  security: "security",
};

export default function Builds() {
  return (
    <section id="builds" className="relative scroll-mt-24 border-t border-edge px-5 py-24 sm:px-10 sm:py-32">
      {/* header */}
      <div className="grid gap-6 border-b border-edge pb-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone-500">04 — Builds</p>
          <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-bone-50 sm:text-6xl">
            Release ledger
          </h2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-5">
          <p className="max-w-sm text-[15px] leading-relaxed text-bone-300 lg:ml-auto lg:text-right">
            Official release log for Auralis. Every tag is cryptographically signed, verified, and reproducible on GitHub.
          </p>
        </Reveal>
      </div>

      {/* log */}
      <ul className="mt-8 border-t border-edge">
        {LOG.map((e, i) => (
          <Reveal as="li" key={`${e.version}-${e.date}`} delay={i * 50} className="spot border-b border-edge py-7">
            <div className="grid gap-3 sm:grid-cols-12 sm:items-baseline">
              <span className="font-mono text-[11px] tabnum text-bone-500 sm:col-span-2">
                {e.date}
              </span>
              <div className="flex items-baseline gap-3 sm:col-span-3">
                <span className="font-display text-lg font-semibold tracking-tight text-bone-50">
                  {e.app}
                </span>
                <span className="font-mono text-[11px] tabnum text-bone-300">
                  v{e.version}
                </span>
                <span
                  className={cn(
                    "border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                    e.kind === "security"
                      ? "border-bone-50 text-bone-50"
                      : e.kind === "release"
                      ? "border-bone-300 text-bone-200"
                      : "border-edge text-bone-500"
                  )}
                >
                  {KIND_LABEL[e.kind]}
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-bone-300 sm:col-span-7">
                {e.note}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
