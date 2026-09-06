import { useState, useEffect } from "react";
import Rail from "./components/Rail";
import Hero from "./components/Hero";
import Features from "./components/Features";
import DownloadHub from "./components/DownloadHub";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import LegalModal from "./components/LegalModal";
import { AmbientSpotlight, PointerEngine } from "./lib/pointer";

export default function App() {
  const [legalDoc, setLegalDoc] = useState<"privacy" | "terms" | null>(null);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#privacy") {
        setLegalDoc("privacy");
      } else if (hash === "#terms") {
        setLegalDoc("terms");
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const handleOpenLegal = (doc: "privacy" | "terms") => {
    setLegalDoc(doc);
    window.location.hash = doc;
  };

  const handleCloseLegal = () => {
    setLegalDoc(null);
    if (window.location.hash === "#privacy" || window.location.hash === "#terms") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-ink-950 text-bone-50">
      <a
        href="#main"
        className="sr-only z-[100] bg-bone-50 px-5 py-2.5 font-display text-sm font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <div className="noise-veil" aria-hidden="true" />

      <PointerEngine />
      <AmbientSpotlight />

      <Rail onOpenLegal={handleOpenLegal} />

      <main id="main" className="relative pt-14 lg:ml-[220px] lg:pt-0">
        <Hero />
        <Features />
        <DownloadHub />
        <Faq />
        <Footer onOpenLegal={handleOpenLegal} />
      </main>

      <LegalModal
        activeDoc={legalDoc}
        onClose={handleCloseLegal}
        onSelectDoc={(doc) => {
          setLegalDoc(doc);
          window.location.hash = doc;
        }}
      />
    </div>
  );
}
