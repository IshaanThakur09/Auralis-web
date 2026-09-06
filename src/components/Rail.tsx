import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "../utils/cn";
import GithubIcon from "./GithubIcon";
import { ORG_URL } from "../utils/constants";

const SECTIONS = [
  { id: "index", label: "Index" },
  { id: "features", label: "Capabilities" },
  { id: "download", label: "Download" },
  { id: "faq", label: "FAQ" },
];

export default function Rail({
  onOpenLegal,
}: {
  onOpenLegal?: (doc: "privacy" | "terms") => void;
}) {
  const [active, setActive] = useState("index");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 1. Initial check based on URL hash
    const hash = window.location.hash.replace("#", "");
    if (SECTIONS.some((s) => s.id === hash)) {
      setActive(hash);
    }

    let ticking = false;
    const updateActive = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // If scrolled near the bottom of the page, activate the last section (FAQ)
      if (windowHeight + scrollY >= docHeight - 90) {
        setActive(SECTIONS[SECTIONS.length - 1].id);
        return;
      }

      // Check which section is in view relative to the reading eye-line
      const threshold = Math.min(120, windowHeight * 0.2);
      let current = SECTIONS[0].id;

      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            current = s.id;
          }
        }
      }
      setActive(current);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", updateActive, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Run once on mount
    updateActive();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", updateActive);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ---------- desktop left rail ---------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col justify-between border-r border-edge bg-ink-950/80 px-7 py-8 backdrop-blur-sm lg:flex">
        <div>
          <a href="#index" className="group flex items-center gap-3" aria-label="Auralis home">
            <img
              src="/logo.png"
              alt="Auralis"
              className="h-7 w-7 object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <span className="font-display text-[16px] font-semibold leading-tight tracking-tight text-bone-50">
              Auralis
              <span className="block font-mono text-[9px] font-normal uppercase tracking-[0.22em] text-bone-400">
                Music, Nocturnal
              </span>
            </span>
          </a>

          <nav aria-label="Sections" className="mt-12">
            <ul className="space-y-1">
              {SECTIONS.map((s, i) => {
                const on = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setActive(s.id)}
                      aria-current={on ? "true" : undefined}
                      className={cn(
                        "group flex items-baseline gap-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300",
                        on ? "text-bone-50" : "text-bone-400 hover:text-bone-100"
                      )}
                    >
                      <span className={cn("tabnum transition-colors", on ? "text-bone-300" : "text-bone-500")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="relative">
                        {s.label}
                        <span
                          className={cn(
                            "absolute -bottom-1 left-0 h-px bg-bone-50 transition-all duration-500",
                            on ? "w-full" : "w-0 group-hover:w-full"
                          )}
                        />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="space-y-4 border-t border-edge pt-5">
          <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-400">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                onOpenLegal?.("privacy");
              }}
              className="text-left transition-colors hover:text-bone-50 cursor-pointer"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                onOpenLegal?.("terms");
              }}
              className="text-left transition-colors hover:text-bone-50 cursor-pointer"
            >
              Terms of Service
            </a>
          </div>

          <a
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Repo"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300 transition-colors hover:text-bone-50"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
            <ArrowUpRight className="h-3 w-3 text-bone-500" />
          </a>

          <p className="font-mono text-[9px] leading-relaxed tracking-[0.14em] text-bone-500">
            Universal APK · GPL-3.0
            <br />
            No store required
          </p>
        </div>
      </aside>

      {/* ---------- mobile top bar ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-edge bg-ink-950/90 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-5">
          <a href="#index" className="flex items-center gap-2.5" aria-label="Auralis home">
            <img src="/logo.png" alt="Auralis" className="h-6 w-6 object-contain" />
            <span className="font-display text-sm font-semibold tracking-tight">Auralis</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="rail-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center border border-edge-hi text-bone-100"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* mobile drawer */}
        <div
          id="rail-menu"
          className={cn(
            "border-b border-edge bg-ink-950 px-6 py-8 transition-all duration-300",
            open ? "block" : "hidden"
          )}
        >
          <ul className="space-y-3 font-mono text-xs uppercase tracking-[0.18em]">
            {SECTIONS.map((s, i) => {
              const on = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => {
                      setActive(s.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 transition-colors",
                      on ? "text-bone-50 font-medium" : "text-bone-300 hover:text-bone-50"
                    )}
                  >
                    <span className={cn("tabnum", on ? "text-bone-200" : "text-bone-500")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-3 border-t border-edge pt-5 font-mono text-[11px] uppercase tracking-wider text-bone-400">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                onOpenLegal?.("privacy");
              }}
              className="text-left hover:text-bone-50 cursor-pointer"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                onOpenLegal?.("terms");
              }}
              className="text-left hover:text-bone-50 cursor-pointer"
            >
              Terms of Service
            </a>
            <a
              href={ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-bone-200"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              Source on GitHub
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
