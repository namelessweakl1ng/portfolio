"use client";

import { useMemo } from "react";

/**
 * CurvedScanlines.tsx
 * ----------------------------------------------------------------------------
 * Horizontal scanlines that BOW (smile) instead of being ruler-straight. On a
 * real convex CRT, the raster lines curve with the glass; the brain reads
 * bowed horizontal lines as a curved screen even when text is otherwise flat.
 * This is the most reliable cross-browser curvature cue (pure SVG geometry).
 *
 * Lines near the vertical center bow the most (the glass bulges there); lines
 * near the top/bottom bow less and are compressed (edges of a barrel).
 * ----------------------------------------------------------------------------
 */

type Props = {
  /** Spacing between scanlines in px. */
  spacing?: number;
  /** Max bow in px at the vertical center. */
  bow?: number;
  className?: string;
};

export default function CurvedScanlines({
  spacing = 3,
  bow = 4,
  className = "",
}: Props) {
  const W = 1200; // viewBox width; SVG scales to container
  const H = 900; // viewBox height
  // Wider spacing on mobile → fewer paths → better performance.
  const effectiveSpacing = useMemo(
    () => (typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches ? spacing + 2 : spacing),
    [spacing]
  );
  const lines = useMemo(() => {
    const out: { d: string; o: number }[] = [];
    for (let y = 0; y <= H; y += effectiveSpacing) {
      const ny = y / H; // 0..1
      const centered = ny - 0.5; // -0.5..0.5
      // Bow peaks at vertical center, falls off toward top/bottom (barrel).
      const localBow = bow * (1 - 4 * centered * centered);
      // Slight horizontal compression near top/bottom edges (perspective cue)
      const edgeFade = 1 - Math.min(1, Math.abs(centered) * 1.4);
      const o = 0.20 + 0.14 * edgeFade; // opacity (kept light for readability)
      // smile: control point pulls the middle downward
      const d = `M0,${y} Q${W / 2},${y + localBow} ${W},${y}`;
      out.push({ d, o });
    }
    return out;
  }, [effectiveSpacing, bow]);

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ mixBlendMode: "multiply" }}
    >
      {lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          stroke="rgba(0,0,0,0.9)"
          strokeWidth={1}
          fill="none"
          opacity={l.o}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
