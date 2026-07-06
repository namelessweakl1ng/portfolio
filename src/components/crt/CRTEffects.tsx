"use client";

import StaticNoise from "./StaticNoise";
import CurvedScanlines from "./CurvedScanlines";

/**
 * CRTEffects.tsx
 * ----------------------------------------------------------------------------
 * Stacked overlay layers that sell the analog illusion. All pointer-events
 * disabled. Rendered ON TOP of the screen content but UNDER the cursor.
 *
 * Layers (bottom → top):
 *   aperture grille   — vertical phosphor stripes
 *   bloom             — center phosphor glow
 *   scanlines         — repeating horizontal lines (drift)
 *   static noise      — canvas TV static + tracking
 *   flicker           — subtle brightness variation
 *   vignette          — darkened corners (curved glass cue)
 *   edge blur         — soft inset shadow
 *   reflection        — faint top glass sheen
 *   dust              — a few specks
 *   sweep             — slow rolling brightness bar (CRT redraw)
 * ----------------------------------------------------------------------------
 */

export default function CRTEffects({ active = true }: { active?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
      {/* Aperture grille — vertical RGB phosphor */}
      <div className="absolute inset-0 crt-aperture" />

      {/* Center phosphor bloom */}
      <div className="absolute inset-0 crt-bloom" />

      {/* Scanlines — bowed to follow the curved glass */}
      <CurvedScanlines spacing={3} bow={4} />
      {/* Faint straight scanline shimmer for extra raster texture */}
      <div className="absolute inset-0 crt-scanlines opacity-40" />

      {/* Static + tracking noise (canvas) */}
      {active && <StaticNoise intensity={0.045} />}

      {/* Brightness flicker */}
      <div className="absolute inset-0 crt-flicker" />

      {/* Vignette */}
      <div className="absolute inset-0 crt-vignette" />

      {/* Edge blur / inset shadow */}
      <div className="absolute inset-0 crt-edge-blur" />

      {/* Top glass reflection */}
      <div className="absolute inset-0 crt-reflection" />

      {/* Dust particles */}
      <DustLayer />

      {/* Slow rolling refresh sweep */}
      <div
        className="absolute left-0 right-0 h-[14vh] opacity-[0.04]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,255,102,0) 0%, rgba(0,255,102,0.9) 50%, rgba(0,255,102,0) 100%)",
          animation: "crt-refresh-sweep 9s linear infinite",
        }}
      />
    </div>
  );
}

/** A handful of slow-drifting dust specks on the glass. */
function DustLayer() {
  const specks = [
    { left: "12%", top: "22%", size: 2, delay: "0s", dur: "11s" },
    { left: "78%", top: "18%", size: 1, delay: "2s", dur: "14s" },
    { left: "33%", top: "70%", size: 1.5, delay: "1s", dur: "16s" },
    { left: "64%", top: "55%", size: 1, delay: "3s", dur: "12s" },
    { left: "88%", top: "80%", size: 2, delay: "4s", dur: "18s" },
    { left: "8%", top: "60%", size: 1, delay: "1.5s", dur: "13s" },
    { left: "50%", top: "12%", size: 1, delay: "2.5s", dur: "15s" },
  ];
  return (
    <div className="absolute inset-0">
      {specks.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: "rgba(125,255,179,0.5)",
            boxShadow: "0 0 3px rgba(125,255,179,0.6)",
            animation: `flicker-soft ${s.dur} ${s.delay} infinite, tracking-jitter ${s.dur} ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
