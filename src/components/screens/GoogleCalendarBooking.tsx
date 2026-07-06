"use client";

/**
 * GoogleCalendarBooking.tsx — ISOLATED scheduling component
 * ============================================================================
 * PER USER HARD REQUIREMENT: ALL scheduling logic lives in THIS ONE FILE.
 * No other component knows about booking URLs, iframes, or fallback logic.
 *
 * ----------------------------------------------------------------------------
 * HOW TO REPLACE THE BOOKING URL
 * ----------------------------------------------------------------------------
 * Edit `siteConfig.googleCalendarBookingUrl` in:
 *   src/config/siteConfig.ts
 * Paste your public Google Appointment Schedule URL, e.g.:
 *   "https://calendar.google.com/calendar/appointments/<YOUR_ID>?gv=true"
 * This component will pick it up automatically. No code changes needed here.
 *
 * ----------------------------------------------------------------------------
 * WHAT GOOGLE DOES SERVER-SIDE (we do NOT implement this)
 * ----------------------------------------------------------------------------
 * When a visitor books a slot through the embedded Google Appointment page,
 * Google automatically:
 *   - Creates a Google Calendar event on YOUR calendar
 *   - Generates a Google Meet link attached to that event
 *   - Sends confirmation emails to both parties
 * We only embed the page; we never touch scheduling data ourselves.
 * ============================================================================
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import siteConfig from "@/config/siteConfig";
import { useSound } from "@/hooks/useSound";

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Heuristic: detect the placeholder URL shipped in siteConfig. */
function isPlaceholder(url: string): boolean {
  // The shipped default repeats "k2k2k2k" — clearly not a real booking ID.
  // Also treat empty / non-google-appointments URLs as placeholders.
  if (!url) return true;
  if (url.includes("k2k2k2k")) return true;
  if (!url.includes("calendar.google.com/calendar/appointments/")) return true;
  return false;
}

/** Build the embeddable URL. Google appointment pages accept `?embed=true`. */
function buildEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("embed")) u.searchParams.set("embed", "true");
    return u.toString();
  } catch {
    // Fallback to naive append if URL parsing fails.
    return url.includes("?") ? `${url}&embed=true` : `${url}?embed=true`;
  }
}

export default function GoogleCalendarBooking({ open, onClose }: Props) {
  const { play } = useSound();
  const bookingUrl = siteConfig.googleCalendarBookingUrl;
  const placeholder = isPlaceholder(bookingUrl);

  const [useFallback, setUseFallback] = useState<boolean>(placeholder);
  const [loaded, setLoaded] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state every time the modal opens; arm a 4s load timeout that
  // flips us into the fallback panel if the iframe never fires `onLoad`.
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset embed state on each open
    setLoaded(false);
    setUseFallback(placeholder);
    if (placeholder) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // If the iframe hasn't loaded in 4s, the host is probably blocking us.
      setUseFallback(true);
    }, 4000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [open, placeholder]);

  // Lock body scroll while the modal is mounted.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        play("relayClick");
        onClose();
      }
    },
    [onClose, play],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  const openExternal = useCallback(() => {
    play("relayClick");
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  }, [bookingUrl, play]);

  const embedUrl = buildEmbedUrl(bookingUrl);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Google Appointment Schedule"
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

          {/* sub-window */}
          <motion.div
            className="relative w-full max-w-3xl border border-[var(--crt-green)] border-opacity-60 bg-black shadow-[0_0_40px_rgba(0,255,102,0.25)]"
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* scanline overlay */}
            <div className="crt-scanlines pointer-events-none absolute inset-0 z-10" />

            {/* header bar */}
            <div className="flex items-center justify-between border-b border-[var(--crt-green)] border-opacity-50 px-4 py-2">
              <span className="font-mono-crt text-xs tracking-[0.3em] text-[var(--crt-green)] text-glow sm:text-sm">
                GOOGLE APPOINTMENT SCHEDULE
              </span>
              <button
                data-crt-nav
                onClick={() => {
                  play("relayClick");
                  onClose();
                }}
                aria-label="Close booking modal"
                className="font-mono-crt text-xs tracking-[0.25em] text-[var(--crt-soft)] hover:text-[var(--crt-green)] hover:text-glow"
              >
                [ ESC ]
              </button>
            </div>

            {/* body */}
            <div className="relative max-h-[78vh] overflow-y-auto">
              {useFallback ? (
                <FallbackPanel
                  placeholder={placeholder}
                  loaded={loaded}
                  onOpenExternal={openExternal}
                  onRetry={() => {
                    setUseFallback(false);
                    setLoaded(false);
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(
                      () => setUseFallback(true),
                      4000,
                    );
                  }}
                />
              ) : (
                <div className="relative">
                  {!loaded && <LoadingStrip />}
                  <iframe
                    ref={iframeRef}
                    key={embedUrl}
                    src={embedUrl}
                    title="Google Appointment Schedule"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    onLoad={() => {
                      setLoaded(true);
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                      }
                    }}
                    onError={() => setUseFallback(true)}
                    className="min-h-[600px] w-full bg-black"
                    style={{ border: "0", colorScheme: "dark" }}
                    allow="clipboard-write; camera; microphone"
                  />
                </div>
              )}
            </div>

            {/* footer hint */}
            <div className="border-t border-[var(--crt-green)] border-opacity-40 px-4 py-1.5 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-70">
              {
                "// SLOT CONFIRMATIONS CREATE A GOOGLE CALENDAR EVENT + MEET LINK"
              }
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */

function LoadingStrip() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black">
      <div className="font-mono-crt text-xs tracking-[0.3em] text-[var(--crt-green)] text-glow">
        ESTABLISHING APPOINTMENT LINK...
      </div>
      <div className="flex gap-1 font-mono-crt text-[var(--crt-green)]">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="inline-block"
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
          >
            █
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function FallbackPanel({
  placeholder,
  loaded,
  onOpenExternal,
  onRetry,
}: {
  placeholder: boolean;
  loaded: boolean;
  onOpenExternal: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="font-pixel text-2xl text-[var(--crt-green)] text-glow sm:text-3xl">
        {placeholder
          ? "// BOOKING LINK"
          : loaded
            ? "// EMBED REJECTED"
            : "// EMBED TIMEOUT"}
      </div>

      <p className="max-w-md font-mono-crt text-xs leading-relaxed tracking-[0.15em] text-[var(--crt-soft)] opacity-80 sm:text-sm">
        {placeholder
          ? "OPEN IT DIRECTLY IN A NEW TAB."
          : "THE BOOKING PAGE CANNOT BE EMBEDDED IN AN IFRAME ON THIS HOST."}
      </p>

      <button
        data-crt-nav
        onClick={onOpenExternal}
        className="border border-[var(--crt-green)] border-opacity-60 px-6 py-3 font-mono-crt text-xs tracking-[0.3em] text-[var(--crt-green)] text-glow transition-colors hover:bg-[var(--crt-green)] hover:bg-opacity-10 sm:text-sm"
      >
        ▸ OPEN BOOKING PAGE
      </button>

      {!placeholder && (
        <button
          data-crt-nav
          onClick={onRetry}
          className="font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-soft)] opacity-60 hover:text-[var(--crt-green)] hover:opacity-100"
        >
          {"// RETRY EMBED"}
        </button>
      )}
    </div>
  );
}
