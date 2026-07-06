"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor.tsx
 * ----------------------------------------------------------------------------
 * Replaces the native cursor with a glowing phosphor block. Hides the native
 * cursor globally. Grows + brightens over interactive elements (a, button,
 * [data-crt-nav]). On touch devices it stays hidden (no pointer).
 *
 * Also emits a tiny screen distortion pulse on hover via a data attribute on
 * the root (consumed by the monitor if desired).
 * ----------------------------------------------------------------------------
 */

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    // Don't fight touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.style.cursor = "none";
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) setVisible(true);
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest(
        'a, button, [data-crt-nav], [role="button"], input, textarea, [data-crt-interactive]'
      );
      setHovering(interactive);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const loop = () => {
      // ease toward target for a tiny bit of phosphor lag
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.style.cursor = "";
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [visible]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms",
        willChange: "transform",
      }}
    >
      <div
        style={{
          width: hovering ? 18 : 10,
          height: hovering ? 18 : 14,
          transform: `translate(-2px, -2px) scale(${down ? 0.85 : 1})`,
          background: hovering
            ? "rgba(0,255,102,0.12)"
            : "var(--crt-green)",
          border: hovering ? "1px solid var(--crt-green)" : "none",
          boxShadow: "0 0 8px var(--crt-green), 0 0 18px rgba(0,255,102,0.4)",
          transition: "width 120ms, height 120ms, background 120ms, transform 90ms",
        }}
      />
    </div>
  );
}
