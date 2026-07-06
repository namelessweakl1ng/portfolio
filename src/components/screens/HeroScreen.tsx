"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import siteConfig from "@/config/siteConfig";
import TypewriterText from "@/components/shared/TypewriterText";
import { useCRTStore } from "@/hooks/useCRTStore";
import { useSound } from "@/hooks/useSound";

/**
 * HeroScreen.tsx — CH 01
 * Minimal. Large centered text. Lines type one at a time. The name is the
 * focal point; everything else is quieter. A subtle prompt to advance
 * appears once the sequence finishes.
 */
export default function HeroScreen() {
  const lines = siteConfig.hero.lines;
  const [idx, setIdx] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const { play } = useSound();
  const nextChannel = useCRTStore((s) => s.nextChannel);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 py-16 text-center">
      {/* channel header */}
      <motion.div
        className="mb-6 font-mono-crt text-[10px] tracking-[0.4em] text-[var(--crt-soft)] opacity-60 sm:text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
      >
        {siteConfig.handle} · CH 01 / 06
      </motion.div>

      <div className="flex w-full max-w-3xl flex-col items-center gap-1.5 sm:gap-2">
        {lines.slice(0, idx + 1).map((line, i) => {
          const isName = line === siteConfig.name;
          const isTitleLike = [
            "ETHICAL HACKER",
            "PROGRAMMER",
            "SECURITY RESEARCHER",
          ].includes(line);
          const isAction = line.startsWith("BUILDING") || line.startsWith("BREAKING") || line.startsWith("UNDERSTANDING");
          return (
            <div key={i} className="w-full">
              <TypewriterText
                text={line}
                speed={isName ? 90 : 55}
                showCursor={i === idx}
                cursorAfter={false}
                onChar={() => {
                  if (Math.random() < 0.5) play("keyClick");
                }}
                onDone={() => {
                  play("beep");
                  if (i < lines.length - 1) setIdx(i + 1);
                  else setAllDone(true);
                }}
                className={
                  isName
                    ? "font-pixel text-5xl text-[var(--crt-green)] text-glow sm:text-7xl"
                    : isTitleLike
                    ? "font-pixel text-2xl text-[var(--crt-soft)] text-glow-soft sm:text-3xl"
                    : isAction
                    ? "font-mono-crt text-base tracking-[0.3em] text-[var(--crt-green)] text-glow sm:text-lg"
                    : "font-mono-crt text-lg tracking-[0.3em] text-[var(--crt-soft)] sm:text-xl"
                }
              />
            </div>
          );
        })}
      </div>

      {/* subtitle + advance prompt */}
      {allDone && (
        <motion.div
          className="mt-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="max-w-md font-mono-crt text-xs tracking-[0.2em] text-[var(--crt-soft)] opacity-70 sm:text-sm">
            {siteConfig.hero.subtitle}
          </p>
          <button
            data-crt-nav
            onClick={() => {
              play("channelSwitch");
              nextChannel();
            }}
            className="font-mono-crt text-[10px] tracking-[0.4em] text-[var(--crt-green)] text-glow"
            style={{ animation: "flicker-soft 3s infinite" }}
          >
            ▸ CONTINUE · CH 02
          </button>
        </motion.div>
      )}
    </div>
  );
}
