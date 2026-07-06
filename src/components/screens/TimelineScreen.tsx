"use client";

/**
 * TimelineScreen.tsx — CH 05
 * ----------------------------------------------------------------------------
 * Looks like a system boot log. A `tail -f /var/log/life.log` command is
 * echoed first, then each timeline entry types in ONE AT A TIME on a left
 * log rail with ◆ nodes. Each entry has two typed lines: the event line
 * `[YEAR] ▸ EVENT` and a quieter indented detail line. A `step` counter
 * advances through (event, detail) pairs — same sequential pattern as
 * HeroScreen. After the last detail, prints an end-of-log footer + continue.
 * ----------------------------------------------------------------------------
 */

import { useState } from "react";
import { motion } from "framer-motion";
import siteConfig from "@/config/siteConfig";
import TypewriterText from "@/components/shared/TypewriterText";
import { useCRTStore } from "@/hooks/useCRTStore";
import { useSound } from "@/hooks/useSound";

export default function TimelineScreen() {
  const entries = siteConfig.timeline.entries;
  const [booted, setBooted] = useState(false);
  // step walks 0..2N: even = entry[floor(step/2)] event line,
  // odd = entry[floor(step/2)] detail line.
  const [step, setStep] = useState(0);
  const { play } = useSound();
  const nextChannel = useCRTStore((s) => s.nextChannel);

  const allDone = step >= entries.length * 2;
  const activeIdx = Math.floor(step / 2);
  const advance = () => setStep((s) => s + 1);

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
              {siteConfig.timeline.header}
            </span>
            <span className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60">
              {siteConfig.handle} · CH 05 / 06
            </span>
          </div>
          <span className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60 sm:text-xs">
            UPTIME LOG · /var/log/boot
          </span>
        </motion.div>

        {/* tail -f command echo — typed once, quick, before entries begin */}
        <div className="mb-6 mt-4">
          <TypewriterText
            text="$ tail -f /var/log/life.log"
            speed={18}
            showCursor={false}
            onChar={() => {
              if (Math.random() < 0.4) play("keyClick");
            }}
            onDone={() => {
              play("beep");
              setBooted(true);
            }}
            className="font-mono-crt text-xs tracking-[0.15em] text-[var(--crt-soft)] text-glow-soft sm:text-sm"
          />
        </div>

        {/* log rail with ◆ nodes */}
        {booted && (
          <div className="relative">
            {/* vertical log rail behind the nodes */}
            <span
              aria-hidden
              className="absolute left-[6px] top-3 bottom-3 w-px bg-[var(--crt-green)] opacity-30"
            />
            <div className="space-y-6">
              {entries.slice(0, activeIdx + 1).map((entry, i) => {
                const isActive = i === activeIdx;
                const showDetail =
                  i < activeIdx || (isActive && step % 2 === 1);
                const eventActive = isActive && step % 2 === 0;
                const detailActive = isActive && step % 2 === 1;
                return (
                  <div key={i} className="flex gap-4">
                    {/* ◆ node centered on the rail */}
                    <span
                      aria-hidden
                      className="relative z-10 mt-1 w-3 shrink-0 text-center font-mono-crt text-sm text-[var(--crt-green)] text-glow"
                    >
                      ◆
                    </span>
                    <div className="flex-1">
                      {/* event line */}
                      <TypewriterText
                        text={`[${entry.year}] ▸ ${entry.event}`}
                        speed={30}
                        showCursor={eventActive}
                        cursorAfter={false}
                        onChar={() => {
                          if (Math.random() < 0.4) play("keyClick");
                        }}
                        onDone={() => {
                          play("beep");
                          advance();
                        }}
                        className="font-mono-crt text-base text-[var(--crt-green)] text-glow sm:text-lg"
                      />
                      {/* detail line — typed right after the event line, indented to the event column */}
                      {showDetail && (
                        <TypewriterText
                          text={entry.detail}
                          speed={16}
                          startDelay={150}
                          showCursor={detailActive}
                          cursorAfter={false}
                          onChar={() => {
                            if (Math.random() < 0.3) play("keyClick");
                          }}
                          onDone={() => {
                            advance();
                          }}
                          className="mt-1 block pl-[68px] font-mono-crt text-xs text-[var(--crt-soft)] opacity-80 sm:pl-[76px] sm:text-sm"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* footer + continue */}
        {allDone && (
          <motion.div
            className="mt-8 flex flex-col items-start gap-4 border-t border-[var(--crt-green)] border-opacity-40 pt-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono-crt text-xs tracking-[0.3em] text-[var(--crt-green)] text-glow sm:text-sm">
              {`> END OF LOG · ${entries.length} ENTRIES`}
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
              ▸ CONTINUE · CH 06
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
