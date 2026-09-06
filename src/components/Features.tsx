import { useState, useEffect } from "react";
import { Mic2, Users, Activity, Code2, Disc, Play } from "lucide-react";
import { Reveal } from "../lib/motion";

const LYRIC_SNIPPETS = [
  "Lost in the echoes of the city lights",
  "Riding the frequency through the night",
  "Neon pulses rushing in our veins",
  "Synchronized sound takes away the pain",
];

export default function Features() {
  const [activeLyric, setActiveLyric] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLyric((prev) => (prev + 1) % LYRIC_SNIPPETS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="features" className="relative scroll-mt-0 border-t border-edge px-5 pt-8 pb-20 sm:px-10 sm:pt-10 sm:pb-28">
      {/* Section Header */}
      <div className="grid gap-6 border-b border-edge pb-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone-500">
            02 — Capabilities
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-bone-50 sm:text-6xl">
            Engineered for
            <br />
            pure listening
          </h2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-5">
          <p className="max-w-md text-[15px] leading-relaxed text-bone-300 lg:ml-auto lg:text-right">
            Every feature meticulously crafted for fluid music discovery, zero telemetry, and real-time community synchronization.
          </p>
        </Reveal>
      </div>

      {/* 6 Capabilities Grid */}
      <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. Synchronized Lyrics */}
        <Reveal delay={0} className="spot flex flex-col justify-between border border-edge p-6 sm:p-8">
          <div>
            <div className="flex h-10 w-10 items-center justify-center border border-edge-hi text-bone-100">
              <Mic2 className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-bone-50">
              Synchronized Lyrics
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-300">
              Real-time, line-by-line timed lyrics that follow every vocal cadence so you can sing along with glowing clarity. Cached automatically for offline playback.
            </p>
          </div>
          {/* Visual Demo */}
          <div className="mt-8 border border-edge bg-ink-900/60 p-4 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-bone-500">
              <span className="h-1.5 w-1.5 rounded-full bg-bone-300 anim-blink" />
              <span>LIVE LRCLIB SYNC</span>
            </div>
            <div className="mt-3 space-y-1.5 overflow-hidden">
              {LYRIC_SNIPPETS.map((line, idx) => (
                <p
                  key={line}
                  className={`transition-all duration-500 ${
                    idx === activeLyric
                      ? "text-bone-50 font-medium translate-x-1"
                      : "text-bone-500 text-[10px]"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 2. Listen Together Rooms */}
        <Reveal delay={80} className="spot flex flex-col justify-between border border-edge p-6 sm:p-8">
          <div>
            <div className="flex h-10 w-10 items-center justify-center border border-edge-hi text-bone-100">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-bone-50">
              Listen Together Rooms
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-300">
              Drop into virtual listening rooms with friends. Stream identical audio timestamps in sample-accurate synchronization using a simple 6-character room code.
            </p>
          </div>
          {/* Visual Demo */}
          <div className="mt-8 border border-edge bg-ink-900/60 p-4 font-mono text-[11px]">
            <div className="flex items-center justify-between text-bone-400">
              <span>ROOM: #AUR-96</span>
              <span className="text-bone-300 font-medium">3 SYNCED</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="border border-edge-hi bg-ink-850 px-2.5 py-1 text-[10px] text-bone-100">
                HOST
              </span>
              <span className="border border-edge bg-ink-950 px-2 py-1 text-[10px] text-bone-400">
                GUEST 01
              </span>
              <span className="border border-edge bg-ink-950 px-2 py-1 text-[10px] text-bone-400">
                GUEST 02
              </span>
            </div>
          </div>
        </Reveal>

        {/* 3. Procedural Visualizer */}
        <Reveal delay={160} className="spot flex flex-col justify-between border border-edge p-6 sm:p-8">
          <div>
            <div className="flex h-10 w-10 items-center justify-center border border-edge-hi text-bone-100">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-bone-50">
              Procedural Visualizer
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-300">
              Dynamic frequency engine that translates acoustic energy into real-time fluid animations directly synchronized with the underlying audio stream.
            </p>
          </div>
          {/* Visual Demo */}
          <div className="mt-8 border border-edge bg-ink-900/60 p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-bone-500">
              <span>SPECTRUM FFT</span>
              <span className="tabnum text-bone-300">60 FPS</span>
            </div>
            <div className="mt-3 flex h-9 items-end justify-between gap-1">
              {[45, 80, 60, 95, 30, 70, 85, 40, 90, 65, 50, 75, 35, 85, 55].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-bone-200/80 transition-all duration-200 hover:bg-bone-50"
                  style={{
                    height: `${h}%`,
                    animation: `pulse 1.2s ease-in-out infinite alternate ${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* 4. 100% Open Source & Zero Telemetry */}
        <Reveal delay={240} className="spot flex flex-col justify-between border border-edge p-6 sm:p-8">
          <div>
            <div className="flex h-10 w-10 items-center justify-center border border-edge-hi text-bone-100">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-bone-50">
              100% Open Source
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-300">
              Zero advertisements, zero analytics tracking, and no paid paywalls. Licensed under GPL-3.0 copyleft for full developer auditability.
            </p>
          </div>
          {/* Visual Demo */}
          <div className="mt-8 border border-edge bg-ink-900/60 p-4 font-mono text-[11px] leading-relaxed text-bone-300">
            <p className="text-bone-500">// auralis-core/privacy.ts</p>
            <p className="text-bone-200">
              export const privacy = &#123;
            </p>
            <p className="pl-4 text-bone-400">telemetry: <span className="text-bone-100">false</span>,</p>
            <p className="pl-4 text-bone-400">adTracking: <span className="text-bone-100">false</span>,</p>
            <p className="pl-4 text-bone-400">license: <span className="text-bone-100">'GPL-3.0'</span></p>
            <p className="text-bone-200">&#125;;</p>
          </div>
        </Reveal>

        {/* 5. Lossless Audio Engine */}
        <Reveal delay={320} className="spot flex flex-col justify-between border border-edge p-6 sm:p-8">
          <div>
            <div className="flex h-10 w-10 items-center justify-center border border-edge-hi text-bone-100">
              <Disc className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-bone-50">
              Lossless Audio Engine
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-300">
              Pristine high-fidelity audio playback pipeline delivering studio-master precision straight to your DAC or headphones with 32-bit float processing.
            </p>
          </div>
          {/* Visual Demo */}
          <div className="mt-8 border border-edge bg-ink-900/60 p-4 font-mono text-[11px]">
            <div className="flex items-center justify-between text-bone-400">
              <span>OUTPUT PIPELINE</span>
              <span className="text-bone-100 font-medium">BIT-PERFECT</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
              <span className="border border-edge-hi bg-ink-850 px-2 py-1 text-bone-200">
                24-bit / 96 kHz
              </span>
              <span className="border border-edge-hi bg-ink-850 px-2 py-1 text-bone-200">
                USB Exclusive Mode
              </span>
              <span className="border border-edge-hi bg-ink-850 px-2 py-1 text-bone-200">
                Gapless Playback
              </span>
            </div>
          </div>
        </Reveal>

        {/* 6. YouTube Music Integration */}
        <Reveal delay={400} className="spot flex flex-col justify-between border border-edge p-6 sm:p-8">
          <div>
            <div className="flex h-10 w-10 items-center justify-center border border-edge-hi text-bone-100">
              <Play className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-bone-50">
              YouTube Music Integration
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-300">
              Stream virtually any track from YouTube Music with pure background audio, fast loading, public playlist imports, and full metadata support.
            </p>
          </div>
          {/* Visual Demo */}
          <div className="mt-8 border border-edge bg-ink-900/60 p-4 font-mono text-[11px]">
            <div className="flex items-center justify-between text-bone-400">
              <span>BACKGROUND ENGINE</span>
              <span className="text-bone-100 font-medium">ACTIVE</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
              <span className="border border-edge-hi bg-ink-850 px-2 py-1 text-bone-200">
                Lock Screen Controls
              </span>
              <span className="border border-edge-hi bg-ink-850 px-2 py-1 text-bone-200">
                System Media Card
              </span>
              <span className="border border-edge-hi bg-ink-850 px-2 py-1 text-bone-200">
                Spotify Import
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
