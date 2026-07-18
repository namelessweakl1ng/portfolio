"use client";

import { create } from "zustand";
import type { ChannelId } from "@/config/siteConfig";

export type BootPhase =
  | "off"
  | "powerline" // tiny white line
  | "static" // noise burst
  | "memory" // memory check
  | "diag" // diagnostics
  | "online" // SYSTEM ONLINE
  | "prompt" // SO, WHAT DO YOU FEEL? + TAP SCREEN OR PRESS ENTER
  | "ready"; // experience begins

type CRTState = {
  bootPhase: BootPhase;
  channel: ChannelId;
  transitioning: boolean;
  glitchMessage: string | null;
  rootMode: boolean; // fake root terminal open
  soundOn: boolean;
  reduceMotion: boolean;

  setBootPhase: (p: BootPhase) => void;
  goChannel: (c: ChannelId) => void;
  nextChannel: () => void;
  prevChannel: () => void;
  setTransitioning: (b: boolean) => void;
  flashGlitch: (msg: string) => void;
  setRootMode: (b: boolean) => void;
  toggleSound: () => void;
  setReduceMotion: (b: boolean) => void;
};

import siteConfig from "@/config/siteConfig";

const order: ChannelId[] = siteConfig.channels.map((c) => c.id) as ChannelId[];

export const useCRTStore = create<CRTState>((set, get) => ({
  bootPhase: "off",
  channel: "hero",
  transitioning: false,
  glitchMessage: null,
  rootMode: false,
  soundOn: true,
  reduceMotion: false,

  setBootPhase: (p) => set({ bootPhase: p }),
  goChannel: (c) => {
    const { channel, transitioning } = get();
    if (c === channel || transitioning) return;
    set({ channel: c, transitioning: true });
    window.setTimeout(() => set({ transitioning: false }), 760);
  },
  nextChannel: () => {
    const i = order.indexOf(get().channel);
    get().goChannel(order[(i + 1) % order.length]);
  },
  prevChannel: () => {
    const i = order.indexOf(get().channel);
    get().goChannel(order[(i - 1 + order.length) % order.length]);
  },
  setTransitioning: (b) => set({ transitioning: b }),
  flashGlitch: (msg) => {
    set({ glitchMessage: msg });
    window.setTimeout(() => set({ glitchMessage: null }), 2600);
  },
  setRootMode: (b) => set({ rootMode: b }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  setReduceMotion: (b) => set({ reduceMotion: b }),
}));
