"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

interface HeroProps {
  onSurpriseClick: () => void;
}

export function Hero({ onSurpriseClick }: HeroProps) {
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const ctaRef = React.useRef<HTMLButtonElement>(null);
  const floatingRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [isClient, setIsClient] = React.useState(false);

  const setFloatingRef = (index: number) => (el: HTMLDivElement | null) => {
    floatingRefs.current[index] = el;
  };

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional for SSR hydration mismatch prevention
    setIsClient(true);
  }, []);

  useGSAP(() => {
    if (!isClient) return;
    
    if (prefersReducedMotion) {
      gsap.set([headlineRef.current, subtitleRef.current, ctaRef.current], { opacity: 1, y: 0 });
      floatingRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1 }));
      return;
    }

    const ctx = gsap.context(() => {
      // Ensure refs are ready
      if (!headlineRef.current || !subtitleRef.current || !ctaRef.current) return;

      gsap.set(ctaRef.current, { opacity: 1, y: 0, scale: 1 });

      const headlineSplit = SplitText.create(headlineRef.current, {
        type: "words,chars",
        wordsClass: "word",
        charsClass: "char",
      });

      const tl = gsap.timeline({ defaults: { ease: "back.out(1.2)" } });

      tl.from(headlineSplit.chars, {
        opacity: 0,
        y: 80,
        rotationX: -90,
        duration: 0.8,
        stagger: 0.03,
        ease: "back.out(1.5)",
      })
        .from(
          subtitleRef.current,
          { opacity: 0, y: 30, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );

      floatingRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0, rotation: -45 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            delay: 0.8 + i * 0.15,
            ease: "elastic.out(1, 0.5)",
          }
        );

        gsap.to(el, {
          y: gsap.utils.random(-20, 20),
          x: gsap.utils.random(-15, 15),
          rotation: gsap.utils.random(-10, 10),
          duration: gsap.utils.random(3, 6),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      return () => {
        headlineSplit.revert();
      };
    }, headlineRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isClient]);

  const floatingElements = [
    { className: "text-4xl", style: { top: "10%", left: "5%" }, content: "🎈" },
    { className: "text-3xl", style: { top: "20%", right: "8%" }, content: "✨" },
    { className: "text-5xl", style: { bottom: "15%", left: "3%" }, content: "🎂" },
    { className: "text-3xl", style: { bottom: "25%", right: "5%" }, content: "💖" },
    { className: "text-2xl", style: { top: "50%", left: "2%" }, content: "🌟" },
    { className: "text-4xl", style: { top: "30%", right: "15%" }, content: "🎁" },
  ];

  return (
    <section
      id="hero"
      className="relative mx-auto bg-fuchsia-200 min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,pink_0%,transparent_70%)] from-primary/10 to-transparent parallax-bg" />

      {floatingElements.map((el, i) => (
        <div
          key={i}
          ref={setFloatingRef(i)}
          className={cn("absolute pointer-events-none select-none", el.className)}
          style={el.style as React.CSSProperties}
          aria-hidden="true"
        >
          {el.content}
        </div>
      ))}

      <div className="relative z-10 max-w-4xl w-full text-center">
        <h1
          ref={headlineRef}
          id="hero-heading"
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight"
        >
          {siteConfig.hero.headline}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {siteConfig.hero.subtitle}
        </p>

        <div className="relative z-50 mt-4">
          <Button
            ref={ctaRef}
            size="lg"
            className="gap-3 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={onSurpriseClick}
            aria-label={siteConfig.hero.ctaText}
          >
            {siteConfig.hero.ctaText}
            <span aria-hidden="true">✨</span>
          </Button>
        </div>
      </div>
    </section>
  );
}