"use client";

import { useEffect } from "react";
import CRTMonitor from "@/components/crt/CRTMonitor";
import BootSequence from "@/components/crt/BootSequence";
import ScreenTransition from "@/components/crt/ScreenTransition";
import NavControls from "@/components/crt/NavControls";
import CustomCursor from "@/components/crt/CustomCursor";
import EasterEggs from "@/components/crt/EasterEggs";
import { useCRTStore } from "@/hooks/useCRTStore";

import HeroScreen from "@/components/screens/HeroScreen";
import AboutScreen from "@/components/screens/AboutScreen";
import SkillsScreen from "@/components/screens/SkillsScreen";
import ProjectsScreen from "@/components/screens/ProjectsScreen";
import TimelineScreen from "@/components/screens/TimelineScreen";
import ContactScreen from "@/components/screens/ContactScreen";
import type { ChannelId } from "@/config/siteConfig";

const SCREENS: Record<ChannelId, () => JSX.Element> = {
  hero: HeroScreen,
  about: AboutScreen,
  skills: SkillsScreen,
  projects: ProjectsScreen,
  timeline: TimelineScreen,
  contact: ContactScreen,
};

export default function Home() {
  const bootPhase = useCRTStore((s) => s.bootPhase);
  const channel = useCRTStore((s) => s.channel);
  const setReduceMotion = useCRTStore((s) => s.setReduceMotion);

  // Respect reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setReduceMotion]);

  const ready = bootPhase === "ready";
  const ActiveScreen = SCREENS[channel];

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-black">
      <CRTMonitor powered={bootPhase !== "off"}>
        {/* Boot sequence OR the live experience */}
        {!ready ? (
          <BootSequence />
        ) : (
          // Reserve bottom space for the nav dock so content never sits
          // underneath it on any screen size. Mobile nav wraps to 2 rows
          // (~110px); desktop is a single row (~60px).
          <div
            key={channel}
            className="absolute inset-0 bottom-[110px] sm:bottom-[64px]"
          >
            <ActiveScreen />
          </div>
        )}

        {/* Channel-switch glitch overlay */}
        {ready && <ScreenTransition />}

        {/* Bottom channel dock */}
        {ready && <NavControls />}
      </CRTMonitor>

      {/* Hidden interactions (Konami, root shell, glitch messages) */}
      <EasterEggs />

      {/* Phosphor cursor — always on top */}
      <CustomCursor />
    </main>
  );
}
