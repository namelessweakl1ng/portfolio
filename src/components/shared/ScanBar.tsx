"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * ScanBar.tsx
 * ----------------------------------------------------------------------------
 * Fake "memory scan" progress bar. Renders █ blocks filling to `level`% with
 * an animated leading edge and a brief "SCANNING…" label. Used by the skills
 * screen. The fill looks like a phosphor bar, not a modern progress widget.
 * ----------------------------------------------------------------------------
 */

type Props = {
  label: string;
  level: number; // 0..100
  width?: number; // total blocks
  delay?: number; // ms before starting
  onDone?: () => void;
};

export default function ScanBar({ label, level, width = 22, delay = 0, onDone }: Props) {
  const [shown, setShown] = useState(0);
  const target = Math.round((level / 100) * width);

  useEffect(() => {
    const t = setTimeout(() => {
      let n = 0;
      const iv = setInterval(() => {
        n += 1;
        setShown(n);
        if (n >= target) {
          clearInterval(iv);
          onDone?.();
        }
      }, 28);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);

  const blocks = Array.from({ length: width });
  const pct = String(level).padStart(3, " ");

  return (
    <div className="flex items-center gap-3 font-mono-crt text-[var(--crt-green)]">
      <span className="w-[200px] shrink-0 text-glow text-sm sm:text-base">{label}</span>
      <span className="relative flex-1 tracking-[0.15em]">
        {blocks.map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i < shown ? 1 : 0.08 }}
            transition={{ duration: 0.1 }}
            className="text-glow"
          >
            █
          </motion.span>
        ))}
        {/* leading scan edge */}
        {shown < width && shown > 0 && (
          <span
            className="absolute top-1/2 -translate-y-1/2 text-[var(--crt-soft)] text-glow-soft"
            style={{ left: `calc(${(shown / width) * 100}% )`, transform: "translate(-50%,-50%)" }}
          >
            ▌
          </span>
        )}
      </span>
      <span className="w-[3.5ch] shrink-0 text-right text-sm text-[var(--crt-soft)] text-glow-soft">
        {pct}%
      </span>
    </div>
  );
}
