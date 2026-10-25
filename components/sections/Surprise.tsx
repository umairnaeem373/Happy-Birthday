"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Gift } from "lucide-react";
import confetti from "canvas-confetti";
import BirthdayCake from "@/components/birthday/birthday-cake";
import { getRandomCakeColors, type CakeColors } from "@/utils/cakePalette";

interface SurpriseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FLOAT_EMOJIS = ["✨", "💖", "⭐", "😍"];

function FloatingDecorations() {
  const positions = [
    { left: "5%", top: "5%" },
    { left: "95%", top: "5%" },
    { left: "5%", top: "95%" },
    { left: "95%", top: "95%" },
    { left: "50%", top: "10%" },
    { left: "50%", top: "90%" },
    { left: "10%", top: "50%" },
    { left: "90%", top: "50%" },
    { left: "20%", top: "20%" },
    { left: "80%", top: "20%" },
    { left: "20%", top: "80%" },
    { left: "80%", top: "80%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-float"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: `${(i * 0.3) % 2}s`,
            animationDuration: `${3 + (i % 3)}s`,
            opacity: 0.6,
            transform: `translate(-50%, -50%)`,
          }}
        >
          {FLOAT_EMOJIS[i % FLOAT_EMOJIS.length]}
        </div>
      ))}
    </div>
  );
}

// The dialog content only mounts on the client once it opens, so choosing a
// random palette here is safe from hydration mismatches and gives a fresh
// cake every time the surprise is revealed.
function SurpriseCake() {
  const [cakeColors] = React.useState<CakeColors>(() => getRandomCakeColors());

  return (
    <div className="relative mt-2">
      <BirthdayCake cakeColors={cakeColors} />
    </div>
  );
}

export function SurpriseDialog({
  isOpen,
  onOpenChange,
}: SurpriseDialogProps) {
  const [contentElement, setContentElement] =
    React.useState<HTMLDivElement | null>(null);
  const contentRef = React.useCallback((element: HTMLDivElement | null) => {
    setContentElement(element);
  }, []);
  const prefersReducedMotion = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useEffect(() => {
    if (!isOpen || !contentElement || prefersReducedMotion) return;

    const rect = contentElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const originY = Math.min(0.9, Math.max(0.1, rect.bottom / viewportHeight));

    const balloon = confetti.shapeFromText({ text: "🎈", scalar: 2.5 });
    const sharedOptions = {
      colors: ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#2196f3", "#00bcd4", "#4caf50", "#ffeb3b", "#ff9800"],
      disableForReducedMotion: true,
      zIndex: 60,
    };

    confetti({
      ...sharedOptions,
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: {
        x: Math.max(0.08, rect.left / viewportWidth),
        y: originY,
      },
    });
    confetti({
      ...sharedOptions,
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: {
        x: Math.min(0.92, rect.right / viewportWidth),
        y: originY,
      },
    });
    confetti({
      ...sharedOptions,
      particleCount: 60,
      angle: 90,
      spread: 90,
      origin: {
        x: (rect.left + rect.width / 2) / viewportWidth,
        y: originY,
      },
    });

    confetti({
      ...sharedOptions,
      particleCount: 12,
      angle: 90,
      spread: 36,
      startVelocity: 32,
      gravity: 0.35,
      drift: -0.15,
      ticks: 280,
      scalar: 2.5,
      shapes: [balloon],
      origin: { x: 0.12, y: 1 },
    });
    confetti({
      ...sharedOptions,
      particleCount: 12,
      angle: 90,
      spread: 36,
      startVelocity: 32,
      gravity: 0.35,
      drift: 0.15,
      ticks: 280,
      scalar: 2.5,
      shapes: [balloon],
      origin: { x: 0.88, y: 1 },
    });

    return () => {
      confetti.reset();
    };
  }, [contentElement, isOpen, prefersReducedMotion]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>

      <DialogContent
        ref={contentRef}
        className={cn(
          "max-w-lg max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto overscroll-contain",
          "bg-gradient-to-br from-background via-primary/5 to-secondary/5"
        )}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,transparent_70%)] from-primary/20 to-transparent pointer-events-none" />
          <FloatingDecorations />

          <DialogHeader className="relative flex justify-center items-center text-center mb-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-1">
              <Gift className="h-7 w-7 text-foreground" />
            </div>
            <DialogTitle className="text-xl md:text-2xl font-bold text-foreground">
              {siteConfig.surprise.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              A little something special for you
            </DialogDescription>
          </DialogHeader>

          <div className="relative space-y-2">
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <span className="text-sm font-medium">Made with ❤️ for you</span></div>
          </div>

          <SurpriseCake />
        </div>
      </DialogContent>
    </Dialog>
  );
}