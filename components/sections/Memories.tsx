"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface MemoriesSectionProps {
  className?: string;
}

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
            index === 0 ? "text-6xl sm:text-7xl" : "text-5xl sm:text-6xl",
          )}
          aria-hidden="true"
        >
          {["📸", "🎞️", "🖼️", "📷"][index % 4]}
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
  const prefersReducedMotion = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      if (!prefersReducedMotion && sectionRef.current) {
        const items = sectionRef.current.querySelectorAll("[data-memory-card]");
        gsap.fromTo(
          items,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; }}
      id="memories"
      className={cn("py-16 md:py-24 px-6", className)}
      aria-labelledby="memories-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
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

        <Carousel
          className="relative lg:hidden"
          opts={{
            align: "center",
            loop: true,
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="overflow-visible">
            {siteConfig.memories.map((memory, index) => (
              <CarouselItem key={memory.id} className="relative">
                <MemoryCard
                  memory={memory}
                  index={index}
                  className="aspect-[4/3]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="absolute left-0 -translate-x-4 rounded-full bg-background/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-background md:-translate-x-8"
            aria-label="Previous memory"
          />
          <CarouselNext
            className="absolute right-0 translate-x-4 rounded-full bg-background/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-background md:translate-x-8"
            aria-label="Next memory"
          />
        </Carousel>

        <p className="mt-6 text-center text-sm text-muted-foreground lg:hidden">
          {siteConfig.memories.length} memories • Swipe or use arrows to explore
        </p>

        <div
          className="hidden auto-rows-[190px] grid-cols-4 gap-4 lg:grid xl:auto-rows-[220px] xl:gap-5"
        >
          {siteConfig.memories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              index={index}
              className={cn(
                index === 0
                  ? "col-span-2 row-span-2"
                  : index === 1
                    ? "col-span-2"
                    : "col-span-1",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}