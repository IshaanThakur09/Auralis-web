import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/* Tiny class composer */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* useInView — IntersectionObserver, fires once                        */
/* ------------------------------------------------------------------ */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.16, rootMargin: "0px 0px -36px 0px" }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.unobserve(entry.target);
        }
      });
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* Reveal — scroll-reveal wrapper with stagger delay                   */
/* ------------------------------------------------------------------ */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  style,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      className={cx("rv", inView && "rv-in", className)}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* MaskLines — staggered line-mask reveal for display headlines        */
/* ------------------------------------------------------------------ */
export function MaskLines({
  lines,
  className,
  baseDelay = 0,
  step = 100,
}: {
  lines: ReactNode[];
  className?: string;
  baseDelay?: number;
  step?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.25 });
  return (
    <span ref={ref} className={cx(inView && "rv-in", "block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span style={{ transitionDelay: `${baseDelay + i * step}ms` }}>{line}</span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* useCountUp — eased number counter once visible                      */
/* ------------------------------------------------------------------ */
export function useCountUp(target: number, start: boolean, duration = 1800, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      setValue(target * (p === 1 ? 1 : eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value.toFixed(decimals);
}

/* ------------------------------------------------------------------ */
/* WaveBars — ambient equalizer strip (chartreuse)                     */
/* played: 0..1 — bars before the ratio glow, the rest stay dim        */
/* ------------------------------------------------------------------ */
export function WaveBars({
  count = 64,
  className,
  played = null,
  paused = false,
}: {
  count?: number;
  className?: string;
  played?: number | null;
  paused?: boolean;
}) {
  return (
    <div className={cx("flex h-full items-end gap-[3px]", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const h = 18 + Math.abs(Math.sin(i * 1.71) * 62) + Math.abs(Math.sin(i * 0.53) * 20);
        const isPlayed = played === null || i / count <= played;
        return (
          <span
            key={i}
            className={cx(
              "eq-bar w-[3px] flex-1 rounded-full transition-colors duration-300",
              isPlayed
                ? "bg-gradient-to-t from-lime-700 via-lime-500 to-lime-300"
                : "bg-night-600"
            )}
            style={{
              height: `${Math.min(h, 100)}%`,
              animationPlayState: paused ? "paused" : "running",
              ["--eq-dur" as string]: `${0.75 + ((i * 37) % 10) * 0.11}s`,
              ["--eq-delay" as string]: `${-((i * 13) % 17) * 0.09}s`,
            }}
          />
        );
      })}
    </div>
  );
}
