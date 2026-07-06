"use client";

import { ReactNode } from "react";

/**
 * GlitchText.tsx
 * ----------------------------------------------------------------------------
 * Renders text with an RGB-split glitch shadow via the .glitch-text CSS class.
 * Pass `text` (also used as the data-text attribute) — children ignored.
 * ----------------------------------------------------------------------------
 */

type Props = {
  text: string;
  className?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3";
  children?: ReactNode;
};

export default function GlitchText({ text, className = "", as = "span" }: Props) {
  const Tag = as as keyof JSX.IntrinsicElements;
  return (
    <Tag className={`glitch-text ${className}`} data-text={text}>
      {text}
    </Tag>
  );
}
