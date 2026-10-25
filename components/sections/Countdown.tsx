"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useCountdown } from "@/lib/countdown";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { BannerCountdown } from "../ruixen/banner-countdown";

interface CountdownSectionProps {
  className?: string;
}

function BirthdayTodayMessage() {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current!,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative isolate mx-auto flex w-full max-w-2xl flex-col items-center overflow-hidden rounded-3xl border border-primary/20 bg-card px-6 py-9 text-center shadow-xl shadow-primary/10 sm:px-10 sm:py-12"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_65%)] opacity-[0.12]"
        aria-hidden="true"
      />
      <span
        className="z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
      >
        <span aria-hidden="true">✨</span>
        Birthday celebration
        <span aria-hidden="true">✨</span>
      </span>
      <span
        className="z-10 mb-3 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-4xl shadow-inner shadow-primary/10 sm:size-20 sm:text-5xl"
        aria-hidden="true"
      >
        🎂
      </span>
      <span className="z-10 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        Today&apos;s the day!
      </span>
      <span className="z-10 mt-3 text-base text-muted-foreground sm:text-lg">
        Let the celebrating begin
      </span>
    </div>
  );
}

function CountdownDisplay() {
  const countdown = useCountdown();
  const birthdayMonth = getMonthName(siteConfig.birthday.month);
  const endDate = React.useMemo(() => {
    const year = new Date().getFullYear() + (countdown.hasPassed ? 1 : 0);
    return new Date(
      year,
      siteConfig.birthday.month - 1,
      siteConfig.birthday.day,
    );
  }, [countdown.hasPassed]);

  if (countdown.isBirthdayToday) {
    return (
      <>
        <BirthdayTodayMessage />
        <p className="mt-6 text-lg text-muted-foreground">
          Happy {siteConfig.birthday.day}{getOrdinalSuffix(siteConfig.birthday.day)} {birthdayMonth}!
        </p>
      </>
    );
  }

  return (
    <>
      <BannerCountdown
        title="Birthday Countdown"
        endDate={endDate}
        className="flex-col"
      />
      <p className="text-muted-foreground mt-4">
        {countdown.hasPassed
          ? `Counting down to next year's birthday on ${birthdayMonth} ${siteConfig.birthday.day}${getOrdinalSuffix(siteConfig.birthday.day)}`
          : `Birthday is on ${birthdayMonth} ${siteConfig.birthday.day}${getOrdinalSuffix(siteConfig.birthday.day)}`}
      </p>
    </>
  );
}

export function CountdownSection({ className }: CountdownSectionProps) {
  const [mounted, setMounted] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional for SSR hydration mismatch prevention
    setMounted(true);
  }, []);

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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="countdown"
      className={cn("py-16 md:py-24 px-6", className)}
      aria-labelledby="countdown-heading"
      suppressHydrationWarning
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          id="countdown-heading"
          className="text-3xl md:text-4xl font-bold text-foreground mb-6"
        >
          {siteConfig.name}&apos;s Birthday Countdown
        </h2>

        {mounted &&   <CountdownDisplay />}

        <style jsx>{`
          .digit-block {
            @apply w-14 h-20 md:w-18 md:h-24 bg-card border border-border rounded-xl flex items-center justify-center text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-mono;
            line-height: 1;
          }
          .digit-label {
            @apply text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider;
            white-space: nowrap;
          }
        `}</style>
      </div>
    </section>
  );
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString(undefined, {
    month: "long",
  });
}