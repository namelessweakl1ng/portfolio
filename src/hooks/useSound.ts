"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCRTStore } from "./useCRTStore";

/**
 * useSound.ts
 * ----------------------------------------------------------------------------
 * Procedural CRT sound effects via Web Audio API. NO audio asset files.
 * Muted by default; toggled with the `M` key (handled in EasterEggs) and
 * persisted to localStorage. All sounds are cheap oscillator/noise bursts.
 *
 * Available effects: powerOn, beep, relayClick, keyClick, staticBurst,
 * tapeNoise, hum (looping), channelSwitch, glitch.
 * ----------------------------------------------------------------------------
 */

export type SoundName =
  | "powerOn"
  | "beep"
  | "relayClick"
  | "keyClick"
  | "staticBurst"
  | "tapeNoise"
  | "channelSwitch"
  | "glitch"
  | "denied";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const humRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const soundOn = useCRTStore((s) => s.soundOn);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const noiseBuffer = useCallback((ctx: AudioContext, dur: number) => {
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!soundOn) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const env = (gain: GainNode, peak: number, attack: number, dur: number) => {
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + dur);
      };

      switch (name) {
        case "powerOn": {
          // descending sweep + thump
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(1800, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);
          env(g, 0.18, 0.01, 0.6);
          osc.connect(g).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.7);
          break;
        }
        case "beep": {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(880, now);
          env(g, 0.07, 0.005, 0.09);
          osc.connect(g).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }
        case "denied": {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(160, now);
          env(g, 0.12, 0.005, 0.22);
          osc.connect(g).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.26);
          break;
        }
        case "relayClick": {
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffer(ctx, 0.04);
          const bp = ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = 2200;
          const g = ctx.createGain();
          env(g, 0.22, 0.001, 0.035);
          src.connect(bp).connect(g).connect(ctx.destination);
          src.start(now);
          src.stop(now + 0.06);
          break;
        }
        case "keyClick": {
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffer(ctx, 0.02);
          const hp = ctx.createBiquadFilter();
          hp.type = "highpass";
          hp.frequency.value = 1800;
          const g = ctx.createGain();
          env(g, 0.06, 0.001, 0.018);
          src.connect(hp).connect(g).connect(ctx.destination);
          src.start(now);
          src.stop(now + 0.03);
          break;
        }
        case "staticBurst": {
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffer(ctx, 0.4);
          const g = ctx.createGain();
          env(g, 0.1, 0.005, 0.38);
          src.connect(g).connect(ctx.destination);
          src.start(now);
          src.stop(now + 0.45);
          break;
        }
        case "tapeNoise": {
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffer(ctx, 0.6);
          const bp = ctx.createBiquadFilter();
          bp.type = "lowpass";
          bp.frequency.value = 700;
          const g = ctx.createGain();
          env(g, 0.05, 0.05, 0.5);
          src.connect(bp).connect(g).connect(ctx.destination);
          src.start(now);
          src.stop(now + 0.6);
          break;
        }
        case "channelSwitch": {
          // quick noise burst + downward blip
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffer(ctx, 0.18);
          const g = ctx.createGain();
          env(g, 0.14, 0.002, 0.16);
          src.connect(g).connect(ctx.destination);
          src.start(now);
          src.stop(now + 0.2);
          const osc = ctx.createOscillator();
          const g2 = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);
          env(g2, 0.06, 0.002, 0.15);
          osc.connect(g2).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        }
        case "glitch": {
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffer(ctx, 0.12);
          const bp = ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = 900;
          const g = ctx.createGain();
          env(g, 0.12, 0.001, 0.1);
          src.connect(bp).connect(g).connect(ctx.destination);
          src.start(now);
          src.stop(now + 0.13);
          break;
        }
      }
    },
    [soundOn, ensureCtx, noiseBuffer]
  );

  // Manage the low CRT hum loop
  useEffect(() => {
    if (!soundOn) {
      if (humRef.current) {
        humRef.current.gain.gain.cancelScheduledValues(0);
        humRef.current.gain.gain.setValueAtTime(0.0001, ensureCtx()?.currentTime ?? 0);
        try {
          humRef.current.osc.stop();
        } catch {
          /* noop */
        }
        humRef.current = null;
      }
      return;
    }
    const ctx = ensureCtx();
    if (!ctx || humRef.current) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 60; // mains hum
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 180;
    g.gain.value = 0.012;
    osc.connect(lp).connect(g).connect(ctx.destination);
    osc.start();
    humRef.current = { osc, gain: g };
    return () => {
      try {
        osc.stop();
      } catch {
        /* noop */
      }
      humRef.current = null;
    };
  }, [soundOn, ensureCtx]);

  return { play, enabled: soundOn };
}
