"use client";

/**
 * BarrelDistortion.tsx
 * ----------------------------------------------------------------------------
 * Real-time CRT warp via an SVG <filter>. In this headless Chromium,
 * feImage (raster displacement maps) silently no-ops, but feDisplacementMap
 * fed by feTurbulence DOES work. So we use a low-frequency turbulence field
 * as the displacement source: it produces a gentle, slow organic warp across
 * the whole screen — text is no longer perfectly straight, reinforcing the
 * "looking through curved analog glass" illusion.
 *
 * Combined with the bowed CurvedScanlines overlay (geometric barrel cue) and
 * the strong vignette + center bloom, the screen reads as genuinely curved.
 *
 * Applied to the CRT content layer via CSS `filter: url(#crt-barrel)`.
 * ----------------------------------------------------------------------------
 */

type Props = {
  /** Cosmetic parity (the warp is procedural). */
  strength?: number;
  /** feDisplacementMap scale in destination pixels. */
  scale?: number;
};

export default function BarrelDistortion({ scale = 26 }: Props) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter id="crt-barrel" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.012"
            numOctaves="2"
            seed="7"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
