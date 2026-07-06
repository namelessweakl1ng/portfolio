"use client";

import { ReactNode } from "react";
import CRTEffects from "./CRTEffects";
import BarrelDistortion from "./BarrelDistortion";

/**
 * CRTMonitor.tsx
 * ----------------------------------------------------------------------------
 * The physical CRT television. The browser window IS the monitor.
 *
 * Structure:
 *   <bezel>            — plastic case around the screen
 *     <screen-frame>   — recessed glass bezel
 *       <screen>       — the curved phosphor surface
 *         <barrel-layer> — content with SVG barrel displacement filter
 *         <effects>     — scanlines / vignette / noise / ...
 *       </screen>
 *     </screen-frame>
 *     <brand-plate>    — "BLACKWOOD" + model + power LED
 *   </bezel>
 *
 * On mobile the bezel collapses to a thin frame so content dominates.
 * ----------------------------------------------------------------------------
 */

type Props = {
  children: ReactNode;
  /** When false, effects are dimmed (e.g. during power-off). */
  powered?: boolean;
  className?: string;
};

export default function CRTMonitor({ children, powered = true, className = "" }: Props) {
  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-black">
      <BarrelDistortion strength={0.34} scale={150} resolution={256} />

      {/* Outer bezel — the plastic case. Subtle, mostly invisible on desktop. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(140% 120% at 50% 0%, #0b0f0c 0%, #050706 55%, #000 100%)",
        }}
      />

      {/* Screen frame (recessed glass surround) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-0 sm:p-3 md:p-5 lg:p-8">
        <div
          className={`relative h-full w-full overflow-hidden ${className}`}
          style={{
            // CRT-like rounded corners — large radius sells the curve.
            borderRadius: "5% / 4%",
            boxShadow:
              "0 0 0 2px rgba(0,0,0,0.9), 0 0 0 6px rgba(20,28,22,0.9), 0 0 0 8px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(0,255,102,0.04)",
            background: "#000",
          }}
        >
          {/* The phosphor screen */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "5% / 4%",
              overflow: "hidden",
              // very subtle inner glass tint
              background:
                "radial-gradient(120% 120% at 50% 45%, rgba(0,30,12,0.5) 0%, rgba(0,0,0,0.9) 80%)",
            }}
          >
            {/* Content layer — always visible. The boot sequence handles its
                own power-on visuals; hiding content here would hide the
                "PRESS ANY KEY" invitation on the off screen. The `powered`
                prop only gates the effects layer (static noise) below. */}
            <div className="absolute inset-0">{children}</div>

            {/* Effects on top */}
            <CRTEffects active={powered} />

            {/* Screen-burn: faint ghost of an old UI in a corner */}
            <div
              className="pointer-events-none absolute inset-0 z-40 opacity-[0.05]"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, transparent 8%, rgba(0,255,102,0.4) 8.2%, rgba(0,255,102,0.4) 8.4%, transparent 8.6%)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>
      </div>

      {/* Brand plate + power LED */}
      <div className="pointer-events-none absolute bottom-1 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-3 sm:flex">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{
            background: powered ? "var(--crt-green)" : "#330",
            boxShadow: powered ? "0 0 6px var(--crt-green)" : "none",
            animation: powered ? "flicker-soft 4s infinite" : "none",
          }}
        />
        <span className="font-mono-crt text-[9px] tracking-[0.4em] text-[var(--crt-green)] opacity-50">
          BLACKWOOD · MODEL T-07 · 1983
        </span>
      </div>
    </div>
  );
}
