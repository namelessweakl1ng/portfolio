"use client";

/**
 * SkillsScreen.tsx — CH 03
 * ----------------------------------------------------------------------------
 * A fake memory scan. Types "SCANNING MEMORY BANKS...", then fills each
 * skill's ScanBar sequentially (staggered via the `delay` prop). When the
 * last bar completes, prints a summary line and a prompt to advance to the
 * next channel. Left margin carries faint hex memory addresses to sell the
 * "memory scan" feel.
 * ----------------------------------------------------------------------------
 */

import { useState } from "react";
import { motion } from "framer-motion";
import siteConfig from "@/config/siteConfig";
import TypewriterText from "@/components/shared/TypewriterText";
import ScanBar from "@/components/shared/ScanBar";
import { useCRTStore } from "@/hooks/useCRTStore";
import { useSound } from "@/hooks/useSound";

export default function SkillsScreen() {
  const skills = siteConfig.skills.skills;
  const [scanStarted, setScanStarted] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const { play } = useSound();
  const nextChannel = useCRTStore((s) => s.nextChannel);

  const allDone = doneCount >= skills.length;

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-16 sm:px-12">
      <div className="mx-auto w-full max-w-3xl">
        {/* header — same border style as AboutScreen */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between border-b border-[var(--crt-green)] border-opacity-40 pb-2"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-mono-crt text-xs tracking-[0.35em] text-[var(--crt-green)] text-glow sm:text-sm">
              {siteConfig.skills.header}
            </span>
            <span className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60">
              {siteConfig.handle} · CH 03 / 06
            </span>
          </div>
          <span
            className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-80 sm:text-xs"
            style={{ animation: "flicker-soft 3s infinite" }}
          >
            ● {allDone ? "LIVE" : siteConfig.skills.scanningLabel}
          </span>
        </motion.div>

        {/* scan intro line + faint memory metadata */}
        <div className="mb-6 mt-4 flex flex-col gap-2">
          <TypewriterText
            text="SCANNING MEMORY BANKS..."
            speed={20}
            showCursor={false}
            onChar={() => {
              if (Math.random() < 0.4) play("keyClick");
            }}
            onDone={() => {
              play("beep");
              setScanStarted(true);
            }}
            className="font-mono-crt text-xs tracking-[0.2em] text-[var(--crt-soft)] text-glow-soft sm:text-sm"
          />
          <span className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-40">
            BLOCK 0x00 .. 0xFF · ADDR /dev/mem · MODE RO
          </span>
        </div>

        {/* scan bars with faint left hex address rail */}
        <div className="space-y-3">
          {scanStarted &&
            skills.map((skill, i) => (
              <div key={skill.name} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="hidden w-10 shrink-0 font-mono-crt text-[9px] leading-6 tracking-[0.1em] text-[var(--crt-soft)] opacity-40 sm:block"
                >
                  0x{(i * 0x10).toString(16).padStart(2, "0").toUpperCase()}
                </span>
                <div className="flex-1">
                  <ScanBar
                    label={skill.name}
                    level={skill.level}
                    width={22}
                    delay={i * 350}
                    onDone={() => {
                      play("relayClick");
                      setDoneCount((c) => c + 1);
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* summary + continue */}
        {allDone && (
          <motion.div
            className="mt-8 flex flex-col items-start gap-4 border-t border-[var(--crt-green)] border-opacity-40 pt-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono-crt text-xs tracking-[0.3em] text-[var(--crt-green)] text-glow sm:text-sm">
              {`> SCAN COMPLETE · ${skills.length} MODULES INDEXED`}
            </span>
            <button
              data-crt-nav
              onClick={() => {
                play("channelSwitch");
                nextChannel();
              }}
              className="font-mono-crt text-[10px] tracking-[0.4em] text-[var(--crt-green)] text-glow sm:text-xs"
              style={{ animation: "flicker-soft 3s infinite" }}
            >
              ▸ CONTINUE · CH 04
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
