"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const footerRef = React.useRef<HTMLElement>(null);
  const prefersReducedMotion = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current!,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <footer
      ref={(el) => { footerRef.current = el; }}
      id="footer"
      className={cn("py-12 px-6 border-t border-border/50 bg-background/50 backdrop-blur-sm", className)}
      role="contentinfo"
    >
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <p className="text-lg font-medium">{siteConfig.footer.credit}</p>
        </div>
      </div>
    </footer>
  );
}