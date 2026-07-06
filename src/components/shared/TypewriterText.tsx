"use client";

import { useEffect, useRef, useState } from "react";

/**
 * TypewriterText.tsx
 * ----------------------------------------------------------------------------
 * Reveals text one character at a time. Optional blinking cursor while typing
 * and after. Calls `onDone` when complete. Designed to feel like an old
 * dot-matrix / phosphor terminal printing.
 * ----------------------------------------------------------------------------
 */

type Props = {
  text: string;
  speed?: number; // ms per char
  startDelay?: number;
  className?: string;
  showCursor?: boolean; // cursor while + after typing
  cursorAfter?: boolean; // keep cursor after done
  onDone?: () => void;
  onChar?: () => void;
  tag?: "div" | "span" | "p" | "h1" | "h2" | "li";
  /** if true, re-runs when `text` changes */
  repeatKey?: string | number;
};

export default function TypewriterText({
  text,
  speed = 38,
  startDelay = 0,
  className = "",
  showCursor = true,
  cursorAfter = false,
  onDone,
  onChar,
  tag = "div",
  repeatKey,
}: Props) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  const i = useRef(0);
  const doneCb = useRef(onDone);
  const charCb = useRef(onChar);
  doneCb.current = onDone;
  charCb.current = onChar;

  useEffect(() => {
    setOut("");
    setDone(false);
    i.current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const startT = setTimeout(function tick() {
      if (i.current <= text.length) {
        setOut(text.slice(0, i.current));
        if (i.current > 0 && charCb.current) charCb.current();
        i.current += 1;
        timer = setTimeout(tick, speed + (Math.random() * 30 - 10));
      } else {
        setDone(true);
        doneCb.current?.();
      }
    }, startDelay);
    return () => {
      clearTimeout(startT);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay, repeatKey]);

  const Tag = tag as keyof JSX.IntrinsicElements;
  return (
    <Tag className={className}>
      {out}
      {showCursor && (!done || cursorAfter) && <span className="cursor-block ml-[1px]" />}
    </Tag>
  );
}
