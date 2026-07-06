"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import siteConfig from "@/config/siteConfig";
import TypewriterText from "@/components/shared/TypewriterText";
import { useSound } from "@/hooks/useSound";

/**
 * AboutScreen.tsx — CH 02
 * Looks like a diagnostic report. SUBJECT IDENTIFIED header, a key/value
 * field table, then a short bio typed line by line. Reads like the machine
 * is describing the person it found.
 */
export default function AboutScreen() {
  const fields = siteConfig.about.fields;
  const bio = siteConfig.about.bio;
  const [bioIdx, setBioIdx] = useState(0);
  const { play } = useSound();

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-16 sm:px-12">
      <div className="mx-auto w-full max-w-3xl">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 flex items-center justify-between border-b border-[var(--crt-green)] border-opacity-40 pb-2"
        >
          <span className="font-mono-crt text-xs tracking-[0.35em] text-[var(--crt-green)] text-glow sm:text-sm">
            {siteConfig.about.subjectLabel}
          </span>
          <span className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60">
            DOSSIER · AUTO-COMPILED
          </span>
        </motion.div>

        {/* field table */}
        <div className="mb-8 mt-4 space-y-1.5">
          {fields.map((f, i) => (
            <motion.div
              key={f.k}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="grid grid-cols-[120px_1fr] gap-3 font-mono-crt text-xs sm:grid-cols-[160px_1fr] sm:text-sm"
            >
              <span className="text-[var(--crt-soft)] opacity-70">{f.k}</span>
              <span className="text-[var(--crt-green)] text-glow">{f.v}</span>
            </motion.div>
          ))}
        </div>

        {/* divider */}
        <div className="mb-6 flex items-center gap-3 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60">
          <span>{"//"} NARRATIVE_LOG</span>
          <span className="h-px flex-1 bg-[var(--crt-green)] opacity-30" />
        </div>

        {/* bio typed */}
        <div className="space-y-2">
          {bio.slice(0, bioIdx + 1).map((line, i) => (
            <div key={i}>
              <TypewriterText
                text={line}
                speed={26}
                showCursor={i === bioIdx}
                onChar={() => {
                  if (Math.random() < 0.4) play("keyClick");
                }}
                onDone={() => {
                  if (i < bio.length - 1) setBioIdx(i + 1);
                }}
                className="font-mono-crt text-sm leading-relaxed text-[var(--crt-green)] text-glow sm:text-base"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
