"use client";

/**
 * ProjectsScreen.tsx — CH 04
 * ----------------------------------------------------------------------------
 * CLASSIFIED ARCHIVE. Dossiers rendered as clickable file-folder tabs. Clicking
 * one opens a CRT sub-window modal that feels like pulling a sealed document
 * out of a cabinet — brief RGB-split glitch + static slice on open, intercept
 * log typed sequentially. CLASSIFIED items are sealed: ACCESS DENIED, denied
 * sound, content redacted with ▒▒▒ blocks, hint "// TRY ROOT ACCESS".
 * ----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import siteConfig, { type Project } from "@/config/siteConfig";
import TypewriterText from "@/components/shared/TypewriterText";
import GlitchText from "@/components/shared/GlitchText";
import { useCRTStore } from "@/hooks/useCRTStore";
import { useSound } from "@/hooks/useSound";

export default function ProjectsScreen() {
  const items = siteConfig.projects.items;
  const [accessing, setAccessing] = useState(true);
  const [openItem, setOpenItem] = useState<Project | null>(null);
  const { play } = useSound();
  const nextChannel = useCRTStore((s) => s.nextChannel);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- defensive reset on (re)mount, matches HeroScreen pattern
    setAccessing(true);
    setOpenItem(null);
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-16 sm:px-12">
      <div className="mx-auto w-full max-w-3xl">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--crt-green)] border-opacity-40 pb-2"
        >
          <div className="flex flex-wrap items-baseline gap-3 font-mono-crt text-xs tracking-[0.35em] text-[var(--crt-green)] text-glow sm:text-sm">
            <span>{siteConfig.projects.header}</span>
            <span className="text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60 sm:text-xs">
              CH 04 / 06
            </span>
            <span className="hidden text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60 sm:inline sm:text-xs">
              · {siteConfig.handle}
            </span>
          </div>
          <span className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60 sm:text-xs">
            CLEARANCE: SELF-ISSUED
          </span>
        </motion.div>

        {/* ACCESSING ARCHIVE line */}
        {accessing && (
          <div className="mb-6">
            <TypewriterText
              text={siteConfig.projects.accessingLabel}
              speed={22}
              showCursor
              onDone={() => setAccessing(false)}
              onChar={() => {
                if (Math.random() < 0.3) play("keyClick");
              }}
              className="font-mono-crt text-sm text-[var(--crt-green)] text-glow sm:text-base"
            />
          </div>
        )}

        {/* dossier list */}
        {!accessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {items.map((item, i) => (
              <DossierRow
                key={item.id}
                item={item}
                delay={i * 0.08}
                onOpen={() => {
                  play("relayClick");
                  setOpenItem(item);
                }}
              />
            ))}

            {/* continue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="pt-8 text-center"
            >
              <button
                data-crt-nav
                onClick={() => {
                  play("channelSwitch");
                  nextChannel();
                }}
                className="font-mono-crt text-xs tracking-[0.4em] text-[var(--crt-green)] text-glow sm:text-sm"
                style={{ animation: "flicker-soft 3s infinite" }}
              >
                ▸ CONTINUE · CH 05
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Dossier modal */}
      <DossierModal item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dossier row — file folder tab                                              */
/* -------------------------------------------------------------------------- */

function DossierRow({
  item,
  delay,
  onOpen,
}: {
  item: Project;
  delay: number;
  onOpen: () => void;
}) {
  const isClassified = item.status === "CLASSIFIED";

  const statusClass =
    item.status === "COMPLETE" || item.status === "ACTIVE"
      ? "text-[var(--crt-green)] text-glow"
      : isClassified
      ? "text-[var(--crt-amber)] text-glow-amber"
      : "text-[var(--crt-soft)] text-glow-soft";

  const codenameClass = isClassified
    ? "text-[var(--crt-amber)] text-glow-amber"
    : "text-[var(--crt-green)] text-glow";

  const titleNode = isClassified ? (
    <GlitchText text={item.title} className="text-[var(--crt-amber)] text-glow-amber" />
  ) : (
    <span className="text-[var(--crt-green)] text-glow">{item.title}</span>
  );

  return (
    <motion.button
      data-crt-nav
      onClick={onOpen}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group block w-full text-left"
      aria-label={`Open dossier ${item.codename}`}
    >
      <div className="border border-[var(--crt-green)] border-opacity-40 transition-colors group-hover:border-opacity-90 group-hover:bg-[var(--crt-green)] group-hover:bg-opacity-[0.04]">
        {/* top border bar with corner flavor */}
        <div className="flex items-center justify-between border-b border-[var(--crt-green)] border-opacity-30 px-3 py-1 font-mono-crt text-[10px] tracking-[0.15em] sm:text-xs">
          <span className="text-[var(--crt-soft)] opacity-80">┌─ FILE {item.index}</span>
          <span className={statusClass}>STATUS: {item.status} ─┐</span>
        </div>

        {/* body */}
        <div className="space-y-1.5 px-3 py-2 font-mono-crt text-xs sm:text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span>
              <span className="text-[var(--crt-soft)] opacity-70">│ CODENAME:</span>{" "}
              <span className={codenameClass}>{item.codename}</span>
            </span>
            <span className="text-[10px] tracking-[0.15em] text-[var(--crt-soft)] opacity-70 sm:text-xs">
              [{item.classification}] │
            </span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span>
              <span className="text-[var(--crt-soft)] opacity-70">│</span> {titleNode}{" "}
              <span className="text-[var(--crt-soft)] opacity-70">· {item.year}</span>
            </span>
            <span className="text-[var(--crt-soft)] opacity-70">│</span>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex items-center justify-between border-t border-[var(--crt-green)] border-opacity-30 px-3 py-0.5 font-mono-crt text-[10px] text-[var(--crt-soft)] opacity-60 sm:text-xs">
          <span>└</span>
          <span>┘</span>
        </div>
      </div>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/* Dossier modal — CRT sub-window                                             */
/* -------------------------------------------------------------------------- */

function DossierModal({ item, onClose }: { item: Project | null; onClose: () => void }) {
  const { play } = useSound();
  const [glitching, setGlitching] = useState(false);
  const [interceptIdx, setInterceptIdx] = useState(0);

  const isClassified = item?.status === "CLASSIFIED";

  // Open: fire glitch + sound
  useEffect(() => {
    if (!item) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- trigger open-glitch animation when dossier opens
    setGlitching(true);
    setInterceptIdx(0);
    play("glitch");

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setGlitching(false), 280));
    if (item.status === "CLASSIFIED") {
      // small delay so the glitch and denied don't fully overlap
      timers.push(setTimeout(() => play("denied"), 120));
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [item]);

  // Body scroll lock
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  // Escape key
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        play("relayClick");
        onClose();
      }
    },
    [onClose, play]
  );

  useEffect(() => {
    if (!item) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [item, handleKey]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Dossier ${item.codename}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/85"
            onClick={() => {
              play("relayClick");
              onClose();
            }}
          />

          {/* fast-fading static slice during open glitch */}
          <AnimatePresence>
            {glitching && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-[160] mix-blend-screen"
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,255,102,0.20) 0px, rgba(0,255,102,0.20) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,229,255,0.10) 0px, rgba(0,229,255,0.10) 5px, transparent 5px, transparent 9px)",
                }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className={`relative w-full max-w-2xl border bg-black ${
              isClassified
                ? "border-[var(--crt-amber)] border-opacity-70 shadow-[0_0_40px_rgba(255,176,0,0.22)]"
                : "border-[var(--crt-green)] border-opacity-60 shadow-[0_0_40px_rgba(0,255,102,0.22)]"
            }`}
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              x: glitching ? [0, -4, 4, -2, 2, 0] : 0,
              filter: glitching
                ? "drop-shadow(-2px 0 var(--crt-cyan)) drop-shadow(2px 0 #ff2d55)"
                : "none",
            }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* scanline overlay */}
            <div className="crt-scanlines pointer-events-none absolute inset-0 z-10" />

            {/* header bar */}
            <div
              className={`relative flex items-center justify-between border-b px-4 py-2 ${
                isClassified
                  ? "border-[var(--crt-amber)] border-opacity-60"
                  : "border-[var(--crt-green)] border-opacity-50"
              }`}
            >
              <span
                className={`font-mono-crt text-xs tracking-[0.3em] sm:text-sm ${
                  isClassified
                    ? "text-[var(--crt-amber)] text-glow-amber"
                    : "text-[var(--crt-green)] text-glow"
                }`}
              >
                {isClassified ? "ACCESS DENIED" : `DOSSIER · ${item.codename}`}
              </span>
              <button
                data-crt-nav
                onClick={() => {
                  play("relayClick");
                  onClose();
                }}
                aria-label="Close dossier"
                className="font-mono-crt text-[10px] tracking-[0.25em] text-[var(--crt-soft)] transition-colors hover:text-[var(--crt-green)] hover:text-glow sm:text-xs"
              >
                ✕ CLOSE · [ESC]
              </button>
            </div>

            {/* body */}
            <div className="relative max-h-[72vh] overflow-y-auto px-5 py-6 font-mono-crt">
              {/* classification banner */}
              <div
                className={`mb-4 flex items-center justify-between border px-3 py-1 text-[10px] tracking-[0.3em] sm:text-xs ${
                  isClassified
                    ? "border-[var(--crt-amber)] border-opacity-50 text-[var(--crt-amber)] text-glow-amber"
                    : "border-[var(--crt-green)] border-opacity-40 text-[var(--crt-green)] text-glow"
                }`}
              >
                <span>{"// " + item.classification}</span>
                <span>{item.status}</span>
              </div>

              {/* codename */}
              <div className="mb-1 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-70">
                CODENAME
              </div>
              {isClassified ? (
                <GlitchText
                  text={item.codename}
                  as="h2"
                  className="font-pixel text-4xl text-[var(--crt-amber)] text-glow-amber sm:text-5xl"
                />
              ) : (
                <h2 className="font-pixel text-4xl text-[var(--crt-green)] text-glow sm:text-5xl">
                  {item.codename}
                </h2>
              )}

              {/* title + year */}
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                <span
                  className={`text-sm tracking-[0.15em] sm:text-base ${
                    isClassified
                      ? "text-[var(--crt-soft)] opacity-60"
                      : "text-[var(--crt-soft)] text-glow-soft"
                  }`}
                >
                  {isClassified ? redactText(item.title) : item.title}
                </span>
                <span className="text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60">
                  YEAR: {item.year}
                </span>
              </div>

              {/* description */}
              <div className="mt-5">
                <div className="mb-1 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-70">
                  {"// DESCRIPTION"}
                </div>
                <p
                  className={`text-sm leading-relaxed sm:text-base ${
                    isClassified
                      ? "text-[var(--crt-soft)] opacity-40"
                      : "text-[var(--crt-green)] text-glow"
                  }`}
                >
                  {isClassified ? redactBlock(item.description) : item.description}
                </p>
              </div>

              {/* technologies */}
              <div className="mt-5">
                <div className="mb-2 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-70">
                  {"// TECHNOLOGIES"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className={`border px-2 py-0.5 text-[10px] tracking-[0.2em] sm:text-xs ${
                        isClassified
                          ? "border-[var(--crt-amber)] border-opacity-40 text-[var(--crt-amber)] opacity-50"
                          : "border-[var(--crt-green)] border-opacity-50 text-[var(--crt-green)] text-glow"
                      }`}
                    >
                      {isClassified ? "▒▒▒▒▒" : tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* intercept log (sequenced typing) */}
              {item.intercept && item.intercept.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-70">
                    {"// INTERCEPT LOG"}
                  </div>
                  <div className="space-y-1">
                    {item.intercept.slice(0, interceptIdx + 1).map((line, i) => (
                      <div key={i}>
                        <TypewriterText
                          text={line}
                          speed={isClassified ? 55 : 22}
                          showCursor={i === interceptIdx}
                          onDone={() => {
                            if (i < (item.intercept?.length ?? 0) - 1) {
                              setInterceptIdx(i + 1);
                            }
                          }}
                          className={`text-xs sm:text-sm ${
                            isClassified
                              ? "text-[var(--crt-amber)] text-glow-amber opacity-80"
                              : "text-[var(--crt-green)] text-glow"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* classified hint */}
              {isClassified && (
                <div className="mt-6 border border-[var(--crt-amber)] border-opacity-40 px-3 py-2 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-amber)] text-glow-amber sm:text-xs">
                  {"// TRY ROOT ACCESS"}
                </div>
              )}

              {/* link */}
              {!isClassified && item.link && (
                <div className="mt-6">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-crt-nav
                    onClick={() => play("relayClick")}
                    className="inline-block border border-[var(--crt-green)] border-opacity-60 px-4 py-2 font-mono-crt text-xs tracking-[0.3em] text-[var(--crt-green)] text-glow transition-colors hover:bg-[var(--crt-green)] hover:bg-opacity-10 sm:text-sm"
                  >
                    LINK ▸
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Redaction helpers                                                          */
/* -------------------------------------------------------------------------- */

/** Replace visible characters in a short string with ▓ blocks (keeps spacing). */
function redactText(text: string): string {
  return text.replace(/[A-Za-z0-9]/g, "▓");
}

/** Build a ▒ redaction block roughly the length of the input + a REDACTED tag. */
function redactBlock(text: string): string {
  const target = Math.min(text.length, 80);
  const block = "▒".repeat(target);
  return `${block}  // CONTENTS REDACTED BY FACILITY PROTOCOL`;
}
