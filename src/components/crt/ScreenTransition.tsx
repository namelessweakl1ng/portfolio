"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCRTStore } from "@/hooks/useCRTStore";

/**
 * ScreenTransition.tsx
 * ----------------------------------------------------------------------------
 * Fullscreen overlay played during channel switches. Mimics changing channels
 * on an old TV: a black bar rolls vertically, static bursts, brightness
 * flashes, and the screen briefly compresses. ~760ms total.
 * ----------------------------------------------------------------------------
 */
export default function ScreenTransition() {
  const transitioning = useCRTStore((s) => s.transitioning);

  return (
    <AnimatePresence>
      {transitioning && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[60] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* rolling black sync bar */}
          <motion.div
            className="absolute left-0 right-0 h-[35%] bg-black"
            initial={{ y: "-45%" }}
            animate={{ y: "120%" }}
            transition={{ duration: 0.5, ease: "linear" }}
            style={{ boxShadow: "0 0 30px 8px rgba(0,0,0,0.9)" }}
          />
          {/* static burst */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              backgroundSize: "200px 200px",
              mixBlendMode: "screen",
            }}
          />
          {/* brightness flash */}
          <motion.div
            className="absolute inset-0 bg-[var(--crt-green)]"
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ mixBlendMode: "screen" }}
          />
          {/* horizontal hold jitter lines */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(0,255,102,0.25) 0px, rgba(0,255,102,0.25) 1px, transparent 1px, transparent 6px)",
              animation: "vhold-roll 0.5s linear",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
