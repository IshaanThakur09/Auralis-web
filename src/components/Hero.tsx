import { useState, useEffect } from "react";
import { Download, ArrowUpRight, ArrowDown, Volume2, Sparkles, Disc } from "lucide-react";
import { MaskLines, Reveal } from "../lib/motion";
import { Magnetic, useParallax } from "../lib/pointer";
import GithubIcon from "./GithubIcon";
import { ORG_URL } from "../utils/constants";
import { useApkMetadata } from "../lib/useApkMetadata";

const LYRIC_LINES = [
  "Lost in the echoes of the city lights",
  "Riding the frequency through the night",
  "Neon pulses rushing in our veins",
  "Synchronized sound takes away the pain",
];

export default function Hero() {
  const glyphRef = useParallax<HTMLDivElement>(30);
  const { meta } = useApkMetadata();
  const [activeLyric, setActiveLyric] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const downloadUrl = meta?.downloadUrl || "/downloads/Auralis-v1.0.0-universal.apk";
  const apkSize = meta?.fileSizeFormatted || "8.18 MB";

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveLyric((prev) => (prev + 1) % LYRIC_LINES.length);
    }, 2700);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <section id="index" className="relative scroll-mt-0 overflow-hidden">
      {/* drifting watermark emblem */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div ref={glyphRef} className="absolute -right-24 top-4 hidden lg:block select-none pointer-events-none">
          <img
            src="/auralis-watermark.png"
            alt=""
            className="h-[36rem] w-[36rem] object-contain opacity-15 transition-opacity duration-700"
          />
        </div>
      </div>

      <div className="relative px-5 pb-16 pt-24 sm:px-10 lg:pt-32">
        {/* meta row */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-500">
            <span className="flex items-center gap-2 text-bone-300">
              <span className="h-1.5 w-1.5 bg-bone-100 anim-blink" />
              Latest Version · 2026
            </span>
            <span>Open Source Music Client</span>
            <span className="hidden sm:inline">Android · Universal APK</span>
            <span className="hidden md:inline">GPL-3.0 · Zero Telemetry</span>
          </div>
        </Reveal>

        {/* authoritative masthead */}
        <h1 className="mt-10 font-display text-[clamp(2.8rem,9.5vw,8.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.045em] text-bone-50">
          <MaskLines
            baseDelay={100}
            lines={[<>Pure Sound.</>, <>Open Source.</>, <>Your Music, Nocturnal.</>]}
          />
        </h1>

        {/* sub row */}
        <div className="mt-12 grid gap-10 border-t border-edge pt-8 lg:grid-cols-12">
          <Reveal delay={300} className="lg:col-span-6">
            <p className="max-w-lg text-[17px] leading-relaxed text-bone-200">
              A high-fidelity, lightweight music streaming app engineered with synchronized real-time
              lyrics, collaborative listening rooms, and YouTube Music integration. Free forever with
              zero telemetry.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.26}>
                <a
                  href="#download"
                  data-cursor="Download"
                  className="btn-solid"
                >
                  <Download className="h-4 w-4" />
                  Download APK ({apkSize})
                </a>
              </Magnetic>

              <Magnetic strength={0.18}>
                <a
                  href={ORG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Source"
                  className="btn-ghost"
                >
                  <GithubIcon className="h-4 w-4" />
                  View Source
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </Magnetic>

              <a
                href="#features"
                data-cursor="Features"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-400 transition-colors hover:text-bone-50 px-2 py-2"
              >
                Capabilities
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Spec Ledger */}
            <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-edge pt-6 font-mono text-[11px] uppercase tracking-[0.14em] sm:grid-cols-4">
              {[
                ["Engine", "Jetpack Compose"],
                ["Audio Out", "24-bit / 96kHz"],
                ["License", "GPL-3.0 Copyleft"],
                ["Telemetry", "Zero / None"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-bone-500">{k}</dt>
                  <dd className="mt-1 text-bone-200">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Interactive Live Now Playing Preview Card */}
          <Reveal delay={400} className="lg:col-span-5 lg:col-start-8">
            <div className="spot relative border border-edge bg-ink-900/80 p-6 sm:p-7">
              {/* header */}
              <div className="flex items-center justify-between border-b border-edge pb-4">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
                  <Disc className={`h-3.5 w-3.5 text-bone-200 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
                  Lossless Audio
                </span>
                <span className="flex items-center gap-1.5 border border-edge-hi bg-ink-950 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-bone-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-bone-100 anim-blink" />
                  LIVE FLAC
                </span>
              </div>

              {/* Track Details */}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-bone-50">
                    Midnight Frequency
                  </h3>
                  <p className="font-mono text-[11px] text-bone-400">
                    Auralis Spatial Audio · 24-bit/96kHz
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-9 w-9 items-center justify-center border border-edge-hi bg-ink-850 text-bone-100 transition-colors hover:border-bone-200 hover:text-bone-50"
                  aria-label={isPlaying ? "Pause preview" : "Play preview"}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>

              {/* Synced Lyrics Box */}
              <div className="mt-5 border border-edge bg-ink-950/90 p-4">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-bone-500">
                  <span>Synced Lyrics (LRCLIB)</span>
                  <span className="text-bone-300">01:41 / 03:50</span>
                </div>
                <div className="mt-3 space-y-2 font-mono text-[11px]">
                  {LYRIC_LINES.map((line, idx) => (
                    <p
                      key={line}
                      className={`transition-all duration-500 ${
                        idx === activeLyric
                          ? "font-medium text-bone-50 translate-x-1"
                          : "text-bone-500 text-[10px]"
                      }`}
                    >
                      {idx === activeLyric && <span className="mr-2 text-bone-300">▸</span>}
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Seekbar Frequency Pillars */}
              <div className="mt-5">
                <div className="flex h-6 items-end justify-between gap-1">
                  {[30, 65, 45, 85, 95, 55, 40, 75, 88, 60, 92, 48, 70, 82, 35, 90, 68, 50, 78, 62].map((h, i) => (
                    <div
                      key={i}
                      className={`w-full transition-all duration-300 ${
                        i < 9 ? "bg-bone-100" : "bg-bone-500/40"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-wider text-bone-500">
                  <span>Native Audio Pipeline</span>
                  <span>32-bit Float</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
