import { useEffect, useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

function isFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ */
/* PointerEngine                                                       */
/*  - publishes --mx / --my (viewport px) + --mxp / --myp (0..1)        */
/*  - publishes --sx / --sy on the hovered .tile-hover / .spot element  */
/* ------------------------------------------------------------------ */
export function PointerEngine() {
  useEffect(() => {
    if (!isFinePointer()) return;

    const root = document.documentElement;
    let raf = 0;
    let last: { x: number; y: number } | null = null;
    let hovered: HTMLElement | null = null;

    const apply = () => {
      raf = 0;
      if (!last) return;
      const { x, y } = last;

      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
      root.style.setProperty("--mxp", (x / window.innerWidth).toFixed(4));
      root.style.setProperty("--myp", (y / window.innerHeight).toFixed(4));
    };

    const onMove = (e: MouseEvent) => {
      last = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);

      // per-card spotlight coordinates
      const target = e.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>(".tile-hover, .spot") ?? null;

      if (card !== hovered) {
        hovered?.classList.remove("spot-on");
        hovered = card;
        hovered?.classList.add("spot-on");
      }
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--sx", `${e.clientX - r.left}px`);
        card.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }
    };

    const onLeave = () => {
      hovered?.classList.remove("spot-on");
      hovered = null;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      onLeave();
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* Cursor — ring that lags behind a precise dot                        */
/* ------------------------------------------------------------------ */
export function Cursor() {
  return null;
}

/* ------------------------------------------------------------------ */
/* AmbientSpotlight — faint light that trails the pointer              */
/* ------------------------------------------------------------------ */
export function AmbientSpotlight() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(isFinePointer() && !prefersReducedMotion()), []);
  if (!on) return null;
  return <div className="ambient-spot" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Magnetic — element drifts toward the cursor within a radius         */
/* ------------------------------------------------------------------ */
export function Magnetic({
  children,
  className,
  strength = 0.32,
  radius = 90,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    if (!child) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const loop = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      child.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < r.width / 2 + radius) {
        tx = dx * strength;
        ty = dy * strength;
      } else {
        tx = 0;
        ty = 0;
      }
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onLeave);
      if (raf) cancelAnimationFrame(raf);
      if (child) child.style.transform = "";
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={className ? `inline-flex ${className}` : "inline-flex"}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* useTilt — 3D tilt toward the cursor for a single element            */
/* ------------------------------------------------------------------ */
export function useTilt<T extends HTMLElement>(max = 8, scale = 1) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `perspective(1100px) rotateY(${cx.toFixed(2)}deg) rotateX(${(-cy).toFixed(
        2
      )}deg) scale(${active ? scale : 1})`;
      if (Math.abs(tx - cx) > 0.02 || Math.abs(ty - cy) > 0.02) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const near =
        e.clientX > r.left - 120 &&
        e.clientX < r.right + 120 &&
        e.clientY > r.top - 120 &&
        e.clientY < r.bottom + 120;
      active = near;
      tx = near ? px * max * 2 : 0;
      ty = near ? py * max * 2 : 0;
      kick();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [max, scale]);

  return ref;
}

/* ------------------------------------------------------------------ */
/* useParallax — translate an element against pointer movement         */
/* ------------------------------------------------------------------ */
export function useParallax<T extends HTMLElement>(depth = 18) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * depth;
      ty = (e.clientY / window.innerHeight - 0.5) * depth;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [depth]);

  return ref;
}
