"use client";

/**
 * ContactScreen.tsx — CH 06
 * ----------------------------------------------------------------------------
 * OPEN SECURE CHANNEL. Comms-terminal aesthetic: a brief handshake sequence
 * types out, then the connection list reveals. EMAIL/GITHUB/LINKEDIN rows open
 * externally; the CALENDAR row opens the isolated GoogleCalendarBooking modal.
 * Faint [ENCRYPTED] watermark behind everything.
 * ----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import siteConfig, { type Social } from "@/config/siteConfig";
import TypewriterText from "@/components/shared/TypewriterText";
import GoogleCalendarBooking from "@/components/screens/GoogleCalendarBooking";
import { useSound } from "@/hooks/useSound";

type Phase = "establishing" | "handshake" | "ready";

export default function ContactScreen() {
  const [phase, setPhase] = useState<Phase>("establishing");
  const [bookingOpen, setBookingOpen] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- defensive reset on (re)mount, matches HeroScreen pattern
    setPhase("establishing");
    setBookingOpen(false);
  }, []);

  const handleConnectionClick = (c: Social) => {
    play("relayClick");
    if (c.kind === "CALENDAR") {
      setBookingOpen(true);
      return;
    }
    if (c.href) {
      window.open(c.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative h-full w-full overflow-y-auto px-6 py-16 sm:px-12">
      <div className="relative mx-auto w-full max-w-3xl">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--crt-green)] border-opacity-40 pb-2"
        >
          <div className="flex flex-wrap items-baseline gap-3 font-mono-crt text-xs tracking-[0.35em] text-[var(--crt-green)] text-glow sm:text-sm">
            <span>{siteConfig.contact.header}</span>
            <span className="text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60 sm:text-xs">
              CH 06 / 06
            </span>
          </div>
          <span
            className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-green)] text-glow sm:text-xs"
            style={{ animation: "cursor-blink 1.4s steps(1) infinite" }}
          >
            ● CHANNEL OPEN
          </span>
        </motion.div>

        {/* handshake sequence */}
        <div className="mb-6 space-y-1.5 font-mono-crt text-xs text-[var(--crt-green)] text-glow sm:text-sm">
          {phase === "establishing" && (
            <TypewriterText
              text="ESTABLISHING SECURE CHANNEL..."
              speed={26}
              showCursor
              onChar={() => {
                if (Math.random() < 0.3) play("keyClick");
              }}
              onDone={() => {
                play("beep");
                setPhase("handshake");
              }}
            />
          )}
          {phase === "handshake" && (
            <>
              <div className="opacity-70">ESTABLISHING SECURE CHANNEL...</div>
              <TypewriterText
                text="HANDSHAKE COMPLETE."
                speed={32}
                showCursor
                onDone={() => {
                  play("beep");
                  window.setTimeout(() => setPhase("ready"), 360);
                }}
              />
            </>
          )}
          {phase === "ready" && (
            <>
              <div className="opacity-70">ESTABLISHING SECURE CHANNEL...</div>
              <div className="opacity-70">HANDSHAKE COMPLETE.</div>
            </>
          )}
        </div>

        {/* connection list */}
        {phase === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* subheader */}
            <div className="mb-3 flex items-center gap-3 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-70 sm:text-xs">
              <span>{"// " + siteConfig.contact.subheader}</span>
              <span className="h-px flex-1 bg-[var(--crt-green)] opacity-30" />
            </div>

            <div
              className="border border-[var(--crt-green)] border-opacity-40"
              role="list"
            >
              {siteConfig.contact.connections.map((c, i) => (
                <ConnectionRow
                  key={c.label}
                  index={i + 1}
                  connection={c}
                  onClick={() => handleConnectionClick(c)}
                />
              ))}
            </div>

            {/* status line */}
            <div className="mt-5 flex items-center gap-2 border border-[var(--crt-green)] border-opacity-30 px-3 py-1.5 font-mono-crt text-[10px] tracking-[0.25em] text-[var(--crt-soft)] opacity-80 sm:text-xs">
              <span
                className="text-[var(--crt-green)] text-glow"
                style={{ animation: "cursor-blink 1.2s steps(1) infinite" }}
              >
                ●
              </span>
              <span>{siteConfig.contact.statusLine}</span>
            </div>

            {/* footer */}
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <div className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-70 sm:text-xs">
                {"> END OF TRANSMISSION · TERMINAL_07"}
              </div>
              <div
                className="font-mono-crt text-[10px] tracking-[0.35em] text-[var(--crt-green)] text-glow sm:text-xs"
                style={{ animation: "flicker-soft 3.5s infinite" }}
              >
                ▸ PRESS R FOR ROOT SHELL
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Isolated scheduling modal — all booking logic lives inside it */}
      <GoogleCalendarBooking open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Connection row — terminal selectable line                                  */
/* -------------------------------------------------------------------------- */

function ConnectionRow({
  index,
  connection,
  onClick,
}: {
  index: number;
  connection: Social;
  onClick: () => void;
}) {
  const num = String(index).padStart(2, "0");
  return (
    <button
      data-crt-nav
      onClick={onClick}
      role="listitem"
      aria-label={`${connection.label}: ${connection.value}`}
      className="group flex min-h-[48px] w-full items-center gap-2 border-b border-[var(--crt-green)] border-opacity-20 px-3 py-3 text-left font-mono-crt text-xs transition-colors last:border-b-0 hover:bg-[var(--crt-green)] hover:bg-opacity-[0.06] sm:gap-3 sm:py-2 sm:text-sm"
    >
      <span className="text-[var(--crt-soft)] opacity-70">[{num}]</span>
      <span className="text-[var(--crt-green)] text-glow">▸</span>
      <span className="w-32 shrink-0 tracking-[0.2em] text-[var(--crt-soft)] group-hover:text-glow-soft sm:w-36">
        {connection.label}
      </span>
      <span className="flex-1 truncate text-[var(--crt-green)] text-glow">
        {connection.value}
      </span>
      {/* hover cursor */}
      <span className="text-[var(--crt-green)] text-glow opacity-0 transition-opacity group-hover:opacity-100">
        ▌
      </span>
    </button>
  );
}
