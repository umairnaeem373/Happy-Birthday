"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface WishesSectionProps {
  className?: string;
}

export function WishesSection({ className }: WishesSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const prefersReducedMotion = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const setCardRef = (index: number) => (el: HTMLElement | null) => {
    cardRefs.current[index] = el;
  };

  useGSAP(() => {
    if (prefersReducedMotion) {
      cardRefs.current.forEach((card) => card && gsap.set(card, { opacity: 1, y: 0 }));
      return;
    }

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; }}
      id="wishes"
      className={cn("py-16 md:py-24 px-6", className)}
      aria-labelledby="wishes-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="wishes-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Birthday Wishes for {siteConfig.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A few heartfelt thoughts for your special day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {siteConfig.wishes.map((wish, index) => (
            <article
              key={wish.id}
              ref={setCardRef(index)}
              className="group"
              role="listitem"
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      #{wish.id}
                    </Badge>
                    <span className="text-2xl" aria-hidden="true">
                      {["💭", "💖", "✨", "🌟", "💫"][index % 5]}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {wish.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed">{wish.content}</p>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}