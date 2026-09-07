import { useState, useEffect } from "react";
import { Download, ArrowUpRight, ArrowDown, Play, Pause, SkipBack, SkipForward, Heart, Users, Disc } from "lucide-react";
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
  const [isLiked, setIsLiked] = useState(false);

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
        <div ref={glyphRef} className="absolute -right-28 -top-4 hidden lg:block select-none pointer-events-none">
          <img
            src="/auralis-watermark.png"
            alt=""
            className="h-[45rem] w-[45rem] object-contain opacity-15 anim-spin-smooth transition-opacity duration-700"
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
                  className="btn-solid text-center w-full sm:w-auto"
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
                  className="btn-ghost text-center w-full sm:w-auto"
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
            <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 border-t border-edge pt-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:grid-cols-4">
              {[
                ["Engine", "Jetpack Compose"],
                ["Audio Engine", "32-Bit Float"],
                ["License", "GPL-3.0 Copyleft"],
                ["Telemetry", "Zero / None"],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-bone-500 truncate">{k}</dt>
                  <dd className="mt-1 text-bone-200 truncate">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Interactive Live Now Playing Preview Card (Auralis In-App Aesthetic) */}
          <Reveal delay={400} className="min-w-0 w-full lg:col-span-5 lg:col-start-8">
            <div className="spot relative border border-edge bg-ink-900/90 p-5 sm:p-7 min-w-0 max-w-full overflow-hidden shadow-2xl shadow-black/60">
              {/* Header: Quality tag & streaming source */}
              <div className="flex items-center justify-between border-b border-edge pb-3.5">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
                  <Disc className={`h-3.5 w-3.5 text-bone-200 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "5s" }} />
                  Auralis Engine
                </span>
                <span className="flex items-center gap-1.5 border border-edge-hi bg-ink-950 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-bone-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-bone-100 anim-blink" />
                  OPUS 256 KBPS · 32-BIT
                </span>
              </div>

              {/* Track Details & Album Art */}
              <div className="mt-5 flex items-center gap-4">
                {/* Vinyl / Cover Artwork */}
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center border border-edge-hi bg-gradient-to-br from-ink-800 via-ink-850 to-ink-950 shadow-inner">
                  <Disc className={`h-7 w-7 text-bone-300 transition-transform duration-700 ${isPlaying ? "scale-105" : "scale-95 opacity-70"}`} />
                  <div className="absolute inset-0 bg-radial from-transparent to-black/40" />
                </div>

                {/* Title & Artist */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold tracking-tight text-bone-50 truncate">
                      Midnight Frequency
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`shrink-0 p-1 transition-colors ${
                        isLiked ? "text-bone-50" : "text-bone-500 hover:text-bone-300"
                      }`}
                      aria-label={isLiked ? "Unlike track" : "Like track"}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-bone-400 truncate">
                    Tame Impala · Auralis Session
                  </p>
                </div>
              </div>

              {/* Real-time Synced Lyrics Box (Kinetic Display) */}
              <div className="mt-5 border border-edge bg-ink-950/90 p-4">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-bone-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-bone-300 anim-blink" />
                    SYNCED LYRICS (LRCLIB)
                  </span>
                  <span className="text-bone-300 tabnum">01:42 / 03:58</span>
                </div>
                <div className="mt-3 space-y-2 font-mono text-[11px]">
                  {LYRIC_LINES.map((line, idx) => {
                    const isCurrent = idx === activeLyric;
                    return (
                      <p
                        key={line}
                        className={`transition-all duration-500 ${
                          isCurrent
                            ? "font-medium text-bone-50 translate-x-1.5 text-[12px]"
                            : "text-bone-500 text-[10px] opacity-60"
                        }`}
                      >
                        {isCurrent && <span className="mr-2 text-bone-200">▸</span>}
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Scrub Progress Bar */}
              <div className="mt-4">
                <div className="relative h-1.5 w-full overflow-hidden bg-ink-800">
                  <div
                    className="h-full bg-bone-100 transition-all duration-300"
                    style={{ width: isPlaying ? "44%" : "44%" }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-wider text-bone-500">
                  <span>01:42</span>
                  <span>Gapless · 32-Bit Float</span>
                  <span>03:58</span>
                </div>
              </div>

              {/* Transport Controls */}
              <div className="mt-4 flex items-center justify-between border-t border-edge/80 pt-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveLyric((prev) => (prev - 1 + LYRIC_LINES.length) % LYRIC_LINES.length)}
                    className="flex h-8 w-8 items-center justify-center text-bone-400 transition-colors hover:text-bone-50"
                    aria-label="Previous line"
                  >
                    <SkipBack className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-9 w-9 items-center justify-center border border-edge-hi bg-ink-850 text-bone-50 transition-colors hover:bg-ink-800 hover:border-bone-200"
                    aria-label={isPlaying ? "Pause track" : "Play track"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveLyric((prev) => (prev + 1) % LYRIC_LINES.length)}
                    className="flex h-8 w-8 items-center justify-center text-bone-400 transition-colors hover:text-bone-50"
                    aria-label="Next line"
                  >
                    <SkipForward className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Listen Together Status Pill */}
                <div className="flex items-center gap-2 border border-edge bg-ink-950 px-2.5 py-1 font-mono text-[10px] text-bone-400">
                  <Users className="h-3 w-3 text-bone-300" />
                  <span className="text-bone-300 font-medium">#AUR-96</span>
                  <span className="text-bone-500">·</span>
                  <span className="text-bone-400">3 SYNCED</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

