"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "@/components/sections/Hero";
import { CountdownSection } from "@/components/sections/Countdown";
import { WishesSection } from "@/components/sections/Wishes";
import { MemoriesSection } from "@/components/sections/Memories";
import { SurpriseDialog } from "@/components/sections/Surprise";
import { Footer } from "@/components/sections/Footer";
import { Mascot } from "@/components/mascot";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [surpriseOpen, setSurpriseOpen] = React.useState(false);
  const [isInHero, setIsInHero] = React.useState(true);
  const prefersReducedMotion = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useGSAP(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        onLeave: () => setIsInHero(false),
        onEnterBack: () => setIsInHero(true),
      });

      gsap.to("#hero .parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleSurpriseClick = React.useCallback(() => {
    setSurpriseOpen(true);
  }, []);

  const mascotPosition = isInHero ? "hero-center" : "bottom-right";
  const mascotSize = isInHero ? 400 : siteConfig.mascot.size;

  return (
    <>
      <Mascot
        position={mascotPosition as "bottom-right" | "hero-center"}
        className={isInHero ? "scale-[0.68] lg:scale-100" : undefined}
        size={mascotSize}
      />

      <main className="min-h-screen">
        <Hero onSurpriseClick={handleSurpriseClick} />
        <CountdownSection />
        <WishesSection />
        <MemoriesSection />
        <SurpriseDialog
          isOpen={surpriseOpen}
          onOpenChange={setSurpriseOpen}
        />
        <Footer />
      </main>

      <Toaster
        position="bottom-right"
        theme="system"
        className="z-50"
        toastOptions={{
          className: "bg-card border-border",
          duration: 4000,
        }}
      />
    </>
  );
}