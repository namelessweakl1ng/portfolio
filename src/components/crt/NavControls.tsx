"use client";

import { useEffect } from "react";
import { useCRTStore } from "@/hooks/useCRTStore";
import { useSound } from "@/hooks/useSound";
import siteConfig from "@/config/siteConfig";

/**
 * NavControls.tsx
 * ----------------------------------------------------------------------------
 * The "channel selector" dock. Bottom of the screen. Shows CH 01..06, current
 * highlighted. Click to switch channels. Keyboard: 1-6 jump, ←/→ cycle,
 * M toggles sound, R opens root terminal, ? shows help.
 *
 * Styled as part of the monitor chassis — not a modern nav bar.
 * ----------------------------------------------------------------------------
 */
export default function NavControls() {
  const { channel, goChannel, nextChannel, prevChannel, soundOn, toggleSound } =
    useCRTStore();
  const { play } = useSound();

  const go = (id: typeof channel) => {
    if (id === channel) return;
    play("channelSwitch");
    goChannel(id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // don't hijack typing in inputs / root terminal
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
        return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= siteConfig.channels.length) {
        const id = siteConfig.channels[n - 1].id;
        play("channelSwitch");
        goChannel(id as typeof channel);
        return;
      }
      if (e.key === "ArrowRight") {
        play("channelSwitch");
        nextChannel();
      } else if (e.key === "ArrowLeft") {
        play("channelSwitch");
        prevChannel();
      } else if (e.key.toLowerCase() === "m") {
        toggleSound();
        play("beep");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [channel, goChannel, nextChannel, prevChannel, play, toggleSound]);

  return (
    <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-50 border-t border-[var(--crt-green)] border-opacity-30 bg-black/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-[2px] sm:px-6 sm:pb-4">
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:flex-nowrap sm:justify-between sm:gap-3">
        {/* channel buttons */}
        {siteConfig.channels.map((c) => {
          const active = c.id === channel;
          return (
            <button
              key={c.id}
              data-crt-nav
              onClick={() => go(c.id as typeof channel)}
              className="flex min-h-[40px] items-center gap-1 border px-2.5 font-mono-crt text-[10px] tracking-[0.15em] transition-colors sm:min-h-0 sm:gap-1.5 sm:px-2 sm:py-1 sm:text-xs"
              style={{
                borderColor: active ? "var(--crt-green)" : "rgba(0,255,102,0.25)",
                color: active ? "var(--crt-green)" : "var(--crt-soft)",
                background: active ? "rgba(0,255,102,0.08)" : "transparent",
                textShadow: active ? "0 0 6px var(--crt-green)" : "none",
              }}
              aria-pressed={active}
              aria-label={`Channel ${c.no} ${c.label}`}
            >
              <span className="opacity-60">{c.no}</span>
              <span className={active ? "text-glow" : "opacity-70"}>{c.label}</span>
            </button>
          );
        })}

        {/* AUD toggle */}
        <button
          data-crt-nav
          onClick={() => {
            toggleSound();
            play("beep");
          }}
          className="flex min-h-[40px] items-center border px-2.5 font-mono-crt text-[10px] tracking-[0.15em] transition-colors sm:min-h-0 sm:px-2 sm:py-1 sm:text-xs"
          style={{
            borderColor: soundOn ? "var(--crt-green)" : "rgba(0,255,102,0.25)",
            color: soundOn ? "var(--crt-green)" : "var(--crt-soft)",
            textShadow: soundOn ? "0 0 6px var(--crt-green)" : "none",
          }}
          aria-label="Toggle sound"
        >
          {soundOn ? "AUD ON" : "AUD OFF"}
        </button>
      </div>

      {/* keyboard hint — desktop only */}
      <div className="mt-1.5 hidden text-center font-mono-crt text-[10px] tracking-[0.25em] text-[var(--crt-soft)] opacity-50 sm:block">
        ← → CYCLE · 1-6 JUMP · M AUDIO
      </div>
    </div>
  );
}
