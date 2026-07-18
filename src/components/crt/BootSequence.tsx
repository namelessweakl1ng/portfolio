"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCRTStore } from "@/hooks/useCRTStore";
import { useSound } from "@/hooks/useSound";
import siteConfig from "@/config/siteConfig";
import TypewriterText from "@/components/shared/TypewriterText";

/**
 * BootSequence.tsx
 * ----------------------------------------------------------------------------
 * Powers on the recovered monitor. The first user gesture (click/keypress)
 * unlocks audio + starts the chain. Phases:
 *
 *   off       → black screen, faint "CLICK TO POWER ON"
 *   powerline → tiny white horizontal line expands vertically
 *   static    → TV static burst
 *   memory    → memory check lines (typed)
 *   diag      → diagnostics + beeps
 *   online    → SYSTEM ONLINE / RESEARCH TERMINAL 07 / STATUS: ONLINE
 *   prompt    → "SO, WHAT DO YOU FEEL?" + blinking cursor, then tap/click or press Enter
 *   ready     → handed off to the main experience
 * ----------------------------------------------------------------------------
 */

type Line = { text: string; delay: number };

export default function BootSequence() {
  const { bootPhase, setBootPhase } = useCRTStore();
  const { play } = useSound();
  const startedRef = useRef(false);
  const [staticOn, setStaticOn] = useState(false);

  // Begin the chain on first user gesture
  const begin = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    play("powerOn");
    setBootPhase("powerline");
    setTimeout(() => play("relayClick"), 60);
    setTimeout(() => {
      setStaticOn(true);
      setBootPhase("static");
      play("staticBurst");
    }, 520);
    setTimeout(() => {
      setStaticOn(false);
      setBootPhase("memory");
    }, 1500);
  }, [play, setBootPhase]);

  const completePrompt = useCallback(() => {
    play("relayClick");
    play("beep");
    setBootPhase("ready");
  }, [play, setBootPhase]);

  // Keyboard: any key begins; Enter/Space complete the final prompt.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (bootPhase === "off") {
        begin();
        return;
      }
      if (bootPhase === "prompt" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        completePrompt();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bootPhase, begin, completePrompt]);

  // Phase auto-advance chains
  useEffect(() => {
    if (bootPhase === "powerline") {
      const t = setTimeout(() => setBootPhase("static"), 480);
      return () => clearTimeout(t);
    }
    if (bootPhase === "static") {
      const t = setTimeout(() => setBootPhase("memory"), 980);
      return () => clearTimeout(t);
    }
    if (bootPhase === "online") {
      const t = setTimeout(() => setBootPhase("prompt"), 2200);
      return () => clearTimeout(t);
    }
  }, [bootPhase, setBootPhase]);

  // After memory typed → diag
  const memoryDone = () => {
    setBootPhase("diag");
  };
  const diagDone = () => {
    // emit beeps
    const n = siteConfig.boot.beeps;
    for (let i = 0; i < n; i++) {
      setTimeout(() => play("beep"), i * 220);
    }
    setTimeout(() => setBootPhase("online"), 700);
  };

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black"
      onClick={
        bootPhase === "off" ? begin : bootPhase === "prompt" ? completePrompt : undefined
      }
      role="button"
      tabIndex={0}
      aria-label={bootPhase === "prompt" ? "Enter the portfolio" : "Power on the monitor"}
    >
      <AnimatePresence mode="wait">
        {/* OFF — invitation to power on */}
        {bootPhase === "off" && (
          <motion.div
            key="off"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="font-pixel text-2xl tracking-[0.3em] text-[var(--crt-green)] text-glow sm:text-4xl"
            >
              PRESS ANY KEY
            </motion.div>
            <motion.div
              animate={{ opacity: [0.45, 0.85, 0.45] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="mt-3 font-mono-crt text-[10px] tracking-[0.5em] text-[var(--crt-soft)] sm:text-xs"
            >
              TO POWER ON
            </motion.div>
            <div className="mt-5 font-mono-crt text-[9px] tracking-[0.35em] text-[var(--crt-soft)] opacity-50">
              UNIT COLD-STARTED · {siteConfig.boot.recovered}
            </div>
          </motion.div>
        )}

        {/* POWER LINE — the CRT collapse-to-full-frame */}
        {bootPhase === "powerline" && (
          <motion.div
            key="powerline"
            className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-white"
            initial={{ scaleX: 0.001, opacity: 1 }}
            animate={{ scaleX: 1, scaleY: [1, 1, 4000], opacity: [1, 1, 0] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ originX: 0.5, originY: 0.5, boxShadow: "0 0 20px #fff" }}
          />
        )}

        {/* STATIC — brief noise burst */}
        {bootPhase === "static" && <StaticBurst />}

        {/* MEMORY CHECK */}
        {bootPhase === "memory" && (
          <BootPanel key="memory">
            <BootHeader />
            <TypewriterSequence
              lines={siteConfig.boot.memoryLines.map((t, i) => ({ text: t, delay: i * 0 }))}
              speed={14}
              onAllDone={memoryDone}
            />
          </BootPanel>
        )}

        {/* DIAGNOSTICS */}
        {bootPhase === "diag" && (
          <BootPanel key="diag">
            <BootHeader />
            <div className="space-y-0.5">
              {siteConfig.boot.memoryLines.map((l) => (
                <div key={l} className="text-[var(--crt-soft)] opacity-80">
                  {l}
                </div>
              ))}
            </div>
            <div className="my-3 h-px w-full bg-[var(--crt-green)] opacity-30" />
            <TypewriterSequence
              lines={siteConfig.boot.diagLines.map((t) => ({ text: t, delay: 0 }))}
              speed={10}
              onAllDone={diagDone}
            />
          </BootPanel>
        )}

        {/* SYSTEM ONLINE */}
        {bootPhase === "online" && (
          <BootPanel key="online">
            <BootHeader />
            <div className="space-y-0.5">
              {siteConfig.boot.memoryLines.map((l) => (
                <div key={l} className="text-[var(--crt-soft)] opacity-70">
                  {l}
                </div>
              ))}
              {siteConfig.boot.diagLines.map((l) => (
                <div key={l} className="text-[var(--crt-soft)] opacity-70">
                  {l}
                </div>
              ))}
            </div>
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="font-pixel text-4xl text-[var(--crt-green)] text-glow sm:text-6xl">
                SYSTEM ONLINE
              </div>
              <div className="mt-3 font-mono-crt text-sm tracking-[0.3em] text-[var(--crt-soft)] text-glow-soft sm:text-base">
                {siteConfig.boot.terminalId}
              </div>
              <div className="mt-1 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60">
                {siteConfig.boot.facility}
              </div>
              <div className="mt-6 inline-flex items-center gap-3 font-mono-crt text-sm text-[var(--crt-green)]">
                <span className="opacity-60">STATUS</span>
                <span className="text-glow">ONLINE</span>
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: "var(--crt-green)", boxShadow: "0 0 8px var(--crt-green)" }}
                />
              </div>
            </motion.div>
          </BootPanel>
        )}

        {/* PROMPT — the existential question */}
        {bootPhase === "prompt" && (
          <BootPanel key="prompt" showHeader>
            <motion.div
              className="flex min-h-[50vh] flex-col items-center justify-center text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <TypewriterText
                text={siteConfig.boot.promptQuestion}
                speed={70}
                startDelay={300}
                className="font-pixel text-3xl text-[var(--crt-green)] text-glow sm:text-5xl"
                cursorAfter
              />
              <motion.div
                className="mt-12 font-mono-crt text-xs tracking-[0.2em] text-[var(--crt-soft)] text-glow-soft sm:text-sm sm:tracking-[0.5em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: 2.2 }}
              >
                {siteConfig.boot.promptEnter} ▸
              </motion.div>
              <motion.div
                className="mt-3 font-mono-crt text-[9px] tracking-[0.3em] text-[var(--crt-soft)] opacity-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2.4 }}
              >
                [ TAP SCREEN / ENTER ]
              </motion.div>
            </motion.div>
          </BootPanel>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- helpers ---------- */

function StaticBurst() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.9, 0.6, 0.2, 0] }}
      transition={{ duration: 0.95, times: [0, 0.1, 0.3, 0.6, 1] }}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
        backgroundSize: "240px 240px",
        mixBlendMode: "screen",
      }}
    />
  );
}

function BootPanel({ children, showHeader = false }: { children: React.ReactNode; showHeader?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-2xl px-6 py-8 sm:px-10"
    >
      {showHeader && <BootHeader />}
      {children}
    </motion.div>
  );
}

function BootHeader() {
  return (
    <div className="mb-5 flex items-center justify-between border-b border-[var(--crt-green)] border-opacity-30 pb-2 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-70 sm:text-xs">
      <span>{siteConfig.boot.terminalId}</span>
      <span>BOOT · {siteConfig.boot.recovered}</span>
    </div>
  );
}

/** Types a list of lines sequentially. */
function TypewriterSequence({
  lines,
  speed,
  onAllDone,
}: {
  lines: Line[];
  speed: number;
  onAllDone?: () => void;
}) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="space-y-0.5">
      {lines.slice(0, idx + 1).map((l, i) => (
        <div key={i}>
          <TypewriterText
            text={l.text}
            speed={speed}
            showCursor={i === idx}
            cursorAfter={false}
            onDone={() => {
              if (i === idx && i < lines.length - 1) setIdx(i + 1);
              else if (i === lines.length - 1) onAllDone?.();
            }}
            className="font-mono-crt text-sm text-[var(--crt-green)] text-glow sm:text-base"
          />
        </div>
      ))}
    </div>
  );
}
