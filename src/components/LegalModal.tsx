import { useEffect } from "react";
import { PRIVACY_DATE, TERMS_DATE, PRIVACY_SECTIONS, TERMS_SECTIONS, type LegalSection } from "../data/legal";
import { X, ShieldCheck, FileText } from "lucide-react";

interface LegalModalProps {
  activeDoc: "privacy" | "terms" | null;
  onClose: () => void;
  onSelectDoc: (doc: "privacy" | "terms") => void;
}

export default function LegalModal({ activeDoc, onClose, onSelectDoc }: LegalModalProps) {
  useEffect(() => {
    if (!activeDoc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeDoc, onClose]);

  if (!activeDoc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-ink-950/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col border border-edge-hi bg-ink-900 shadow-2xl shadow-black/80">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-edge px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Auralis" className="h-6 w-6 object-contain" />
            <span className="font-display text-base font-semibold tracking-tight text-bone-50">
              Auralis
              <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.2em] text-bone-400">
                Official Legal Text
              </span>
            </span>
          </div>

          {/* Doc switcher tabs */}
          <div className="hidden sm:flex items-center gap-1 border border-edge bg-ink-950/80 p-1 font-mono text-[11px] uppercase tracking-[0.14em]">
            <button
              type="button"
              onClick={() => onSelectDoc("privacy")}
              className={`flex items-center gap-1.5 px-3 py-1 transition-colors ${
                activeDoc === "privacy"
                  ? "bg-ink-800 text-bone-50 font-semibold border border-edge-hi"
                  : "text-bone-400 hover:text-bone-100"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onSelectDoc("terms")}
              className={`flex items-center gap-1.5 px-3 py-1 transition-colors ${
                activeDoc === "terms"
                  ? "bg-ink-800 text-bone-50 font-semibold border border-edge-hi"
                  : "text-bone-400 hover:text-bone-100"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Terms of Service
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="group flex items-center gap-2 border border-edge bg-ink-950/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-400 transition-colors hover:border-edge-hi hover:text-bone-50"
          >
            <span>Close</span>
            <kbd className="hidden sm:inline-block border border-edge bg-ink-900 px-1 py-0.2 text-[9px] text-bone-400 group-hover:text-bone-100">
              ESC
            </kbd>
            <X className="h-3.5 w-3.5 text-bone-300 group-hover:text-bone-50" />
          </button>
        </div>

        {/* Mobile tabs row */}
        <div className="flex border-b border-edge bg-ink-950/40 p-2 sm:hidden font-mono text-[10px] uppercase tracking-[0.14em]">
          <button
            type="button"
            onClick={() => onSelectDoc("privacy")}
            className={`flex-1 py-1.5 text-center transition-colors ${
              activeDoc === "privacy"
                ? "bg-ink-800 text-bone-50 font-semibold border border-edge"
                : "text-bone-400"
            }`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onSelectDoc("terms")}
            className={`flex-1 py-1.5 text-center transition-colors ${
              activeDoc === "terms"
                ? "bg-ink-800 text-bone-50 font-semibold border border-edge"
                : "text-bone-400"
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* Document Header */}
        <div className="border-b border-edge bg-ink-950/40 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-500">
            <span className="flex items-center gap-1.5 text-bone-300">
              <span className="h-1.5 w-1.5 rounded-full bg-bone-200" />
              {activeDoc === "privacy" ? PRIVACY_DATE : TERMS_DATE}
            </span>
            <span>·</span>
            <span>GPL-3.0 Copyleft</span>
            <span>·</span>
            <span>No Analytics SDK</span>
          </div>
          <h2
            id="legal-modal-title"
            className="mt-3 font-display text-3xl font-semibold uppercase leading-tight tracking-[-0.03em] text-bone-50 sm:text-4xl"
          >
            {activeDoc === "privacy" ? "Privacy Policy" : "Terms of Service"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone-300">
            {activeDoc === "privacy"
              ? "What data Auralis handles, where it goes, and how to delete it."
              : "The terms for using Auralis and this website."}
          </p>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 font-body text-bone-200">
          <LegalDocBody sections={activeDoc === "privacy" ? PRIVACY_SECTIONS : TERMS_SECTIONS} />
        </div>

        {/* Footer controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-edge bg-ink-950/60 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => onSelectDoc(activeDoc === "privacy" ? "terms" : "privacy")}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-400 transition-colors hover:text-bone-50"
          >
            Switch to {activeDoc === "privacy" ? "Terms of Service →" : "Privacy Policy →"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-edge bg-bone-50 px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-950 transition-colors hover:bg-bone-100"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
}

/** Renders a legal document from the shared text in src/data/legal.ts. */
function LegalDocBody({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="space-y-8 text-sm leading-relaxed">
      {sections.map((section, i) => (
        <section key={section.heading} className={i === 0 ? "space-y-3" : "space-y-3 border-t border-edge pt-6"}>
          <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-bone-50">
            {section.heading}
          </h3>
          {section.parts.map((part, j) =>
            typeof part === "string" ? (
              // Static, first-party text from src/data/legal.ts (not user input).
              <p key={j} className="text-bone-300" dangerouslySetInnerHTML={{ __html: part }} />
            ) : (
              <ul key={j} className="list-disc space-y-2 pl-5 text-bone-200">
                {part.ul.map((item, k) => (
                  <li key={k} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )
          )}
        </section>
      ))}
    </div>
  );
}
