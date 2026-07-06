"use client";

import { useEffect, useRef } from "react";

/**
 * StaticNoise.tsx
 * ----------------------------------------------------------------------------
 * Low-cost animated TV-static / VHS tracking noise rendered to a canvas.
 * Runs at ~18fps (not 60) to feel analog and stay cheap. Optional `intensity`
 * controls overall opacity; `tracking` adds periodic horizontal sync bars.
 * ----------------------------------------------------------------------------
 */

type Props = {
  intensity?: number; // 0..1 base opacity
  className?: string;
};

export default function StaticNoise({ intensity = 0.05, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Adaptive: lower fps + smaller buffer on mobile for battery/CPU.
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    let raf = 0;
    let last = 0;
    const fps = isMobile ? 10 : 18;
    const interval = 1000 / fps;

    // Small offscreen buffer we scale up — looks more like real static + cheap.
    const bufW = isMobile ? 120 : 160;
    const bufH = isMobile ? 68 : 90;
    const buf = document.createElement("canvas");
    buf.width = bufW;
    buf.height = bufH;
    const bctx = buf.getContext("2d");
    if (!bctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < interval) return;
      last = t;

      // 1) draw static into the small buffer
      const img = bctx.createImageData(bufW, bufH);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = Math.random() * 255;
        d[i] = d[i + 1] = d[i + 2] = n;
        d[i + 3] = 255;
      }
      bctx.putImageData(img, 0, 0);

      // 2) scale to main canvas with smoothing off for crisp grain
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = intensity;
      ctx.drawImage(buf, 0, 0, canvas.width, canvas.height);

      // 3) occasional horizontal tracking bar (VHS)
      if (Math.random() < 0.06) {
        const y = Math.random() * canvas.height;
        const h = 6 + Math.random() * 26;
        ctx.globalAlpha = intensity * 6;
        ctx.fillStyle = "rgba(0,255,102,0.5)";
        ctx.fillRect(0, y, canvas.width, h);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
}
