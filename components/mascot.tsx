"use client";

import * as React from "react";
import { Mascot as PageMascot } from "page-mascot";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export type MascotPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "hero" | "hero-center";

interface MascotProps {
  position?: MascotPosition;
  className?: string;
  size?: number;
}

const positionStyles: Record<MascotPosition, string> = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  hero: "absolute bottom-8 right-8 md:bottom-12 md:right-12",
  "hero-center":
    "absolute bottom-0 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-[8%] lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2",
};

export function Mascot({
  position = "bottom-right",
  className,
  size,
}: MascotProps) {
  const baseStyles = "fixed z-40 pointer-events-none select-none transition-all duration-300";
  const positionClass = positionStyles[position];
  const isHeroPosition = position === "hero" || position === "hero-center";

  return (
    <div
      className={cn(baseStyles, positionClass, className)}
      style={isHeroPosition ? { pointerEvents: "auto" } : {}}
      role="img"
      aria-label={siteConfig.mascot.label}
    >
      <div className={`pointer-events-auto ${isHeroPosition && "-mb-30"} lg:mt-100`} style={{ pointerEvents: "auto" }}>
        <PageMascot
          directions={siteConfig.mascot.directions}
          reactions={siteConfig.mascot.reactions}
          size={size ?? siteConfig.mascot.size}
          label={siteConfig.mascot.label}
        />
      </div>
    </div>
  );
}

export function MascotProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}