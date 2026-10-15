"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Sparkles, Gift } from "lucide-react";

interface SurpriseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FLOAT_EMOJIS = ["✨", "💖", "⭐" , "😍"];

function FloatingDecorations() {
  const [decorations] = React.useState<Array<{
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
    emoji: string;
  }>>(() =>
    [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${3 + Math.random() * 3}s`,
      emoji: FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)],
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {decorations.map((deco, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-float"
          style={{
            left: deco.left,
            top: deco.top,
            animationDelay: deco.animationDelay,
            animationDuration: deco.animationDuration,
            opacity: 0.6,
          }}
        >
          {deco.emoji}
        </div>
      ))}
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
    let active = true;

    void import("canvas-confetti").then(({ default: confetti }) => {
      if (!active) return;

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
    });

    return () => {
      active = false;
      void import("canvas-confetti").then(({ default: confetti }) => {
        confetti.reset();
      });
    };
  }, [contentElement, isOpen, prefersReducedMotion]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>

      <DialogContent
        ref={contentRef}
        className={cn(
          "max-w-lg overflow-hidden",
          "bg-gradient-to-br from-background via-primary/5 to-secondary/5"
        )}
      >
        <div className="relative p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,transparent_70%)] from-primary/20 to-transparent pointer-events-none" />
          <FloatingDecorations />

          <DialogHeader className="relative flex justify-center items-center text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4">
              <Gift className="h-10 w-10 text-foreground" />
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
              {siteConfig.surprise.title}
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground mt-2">
              A little something special for you
            </DialogDescription>
          </DialogHeader>

          <div className="relative space-y-4">
            <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent" />
              <p className="relative text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                {siteConfig.surprise.message}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <span className="text-sm font-medium">Made with love for you</span></div>
          </div>

          <div className="mt-6 border border-transparent text-center">
            <DialogClose
              render={
                <Button
                  size="lg"
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Sparkles className="h-4 w-4" />
                  Close Surprise
                </Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}