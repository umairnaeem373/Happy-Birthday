"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface MemoriesSectionProps {
  className?: string;
}

const MEMORY_EMOJI = ["📸", "🎞️", "🖼️", "📷", "💫"] as const;

// Bento spans: a tall tile, a wide tile, two small tiles and another wide tile
// interlock into an asymmetric grid (not a plain half/half split).
const MEMORY_SPANS = [
  "col-span-1 row-span-2",
  "col-span-2",
  "col-span-1",
  "col-span-1",
  "col-span-2",
] as const;

function MemoryCard({
  memory,
  index,
  className,
}: {
  memory: (typeof siteConfig.memories)[number];
  index: number;
  className?: string;
}) {
  return (
    <article
      data-memory-card
      className={cn(
        "group relative flex min-h-0 overflow-hidden rounded-2xl bg-muted shadow-lg",
        className,
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-secondary/10 to-primary/5 transition-transform duration-500 group-hover:scale-105" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-6 pb-16 text-center sm:p-8 sm:pb-18">
        <div
          className={cn(
            "mb-3",
            index === 0 ? "text-6xl sm:text-7xl" : "text-4xl sm:text-5xl",
          )}
          aria-hidden="true"
        >
          {MEMORY_EMOJI[index % MEMORY_EMOJI.length]}
        </div>
        <p className="max-w-full truncate text-sm font-medium text-muted-foreground sm:text-base">
          {memory.image
            .replace("/photos/", "")
            .replace(/\.(jpg|jpeg|png|webp)/i, "")}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-white/75 to-transparent px-5 pb-4 pt-10">
        <p className="text-center text-sm font-medium text-muted-foreground sm:text-base">
          {memory.caption}
        </p>
      </div>
    </article>
  );
}

export function MemoriesSection({ className }: MemoriesSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const prefersReducedMotion = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!section) return;

      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const cards = section.querySelectorAll("[data-memory-card]");
      if (!prefersReducedMotion && cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // On small screens the bento grid is wider than the viewport. Instead of
      // a slider, pin the section and pan the grid to the right as the user
      // scrolls, stopping once the last tile is in view — after which the page
      // scrolls normally again.
      const mm = gsap.matchMedia();
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        if (!track || !viewport) return;

        const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        if (getDistance() <= 1) return;

        viewport.style.overflowX = "clip";

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          viewport.style.overflowX = "";
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    [prefersReducedMotion]
  );

  return (
    <section
      ref={sectionRef}
      id="memories"
      className={cn(
        "relative py-12 md:py-24",
        // On small screens the section is pinned while the grid pans, so fill
        // the viewport and center the content to avoid clipping.
        "max-lg:flex max-lg:min-h-dvh max-lg:flex-col max-lg:justify-center",
        className,
      )}
      aria-labelledby="memories-heading"
    >
      <div ref={headerRef} className="mx-auto mb-8 max-w-6xl px-6 md:mb-12">
        <div className="text-center">
          <h2
            id="memories-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Memories Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Some of our favorite moments captured in time
          </p>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="w-full overflow-x-auto overscroll-x-contain lg:overflow-x-visible"
      >
        <div
          ref={trackRef}
          className={cn(
            "grid grid-cols-4 auto-rows-[180px] gap-4 px-6",
            "w-[900px] max-w-none",
            "sm:auto-rows-[200px] xl:auto-rows-[220px]",
            "lg:mx-auto lg:w-auto lg:max-w-6xl lg:gap-5 lg:px-6 xl:gap-5",
          )}
        >
          {siteConfig.memories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              index={index}
              className={MEMORY_SPANS[index] ?? "col-span-1"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
