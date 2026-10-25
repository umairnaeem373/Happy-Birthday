"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ArrowDown, Cake, Heart, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fireConfetti } from "./confetti"

gsap.registerPlugin(ScrollTrigger, SplitText)

const STARS = [
  { top: "14%", left: "9%", size: 7, delay: "0s", duration: "3.2s" },
  { top: "22%", left: "24%", size: 4, delay: "0.8s", duration: "2.6s" },
  { top: "9%", left: "38%", size: 5, delay: "1.4s", duration: "3.8s" },
  { top: "18%", left: "62%", size: 8, delay: "0.4s", duration: "3s" },
  { top: "11%", left: "78%", size: 4, delay: "1.9s", duration: "2.4s" },
  { top: "27%", left: "88%", size: 6, delay: "0.6s", duration: "3.6s" },
  { top: "38%", left: "15%", size: 5, delay: "2.2s", duration: "2.8s" },
  { top: "46%", left: "72%", size: 4, delay: "1.1s", duration: "3.4s" },
  { top: "55%", left: "6%", size: 6, delay: "1.7s", duration: "3s" },
  { top: "63%", left: "92%", size: 5, delay: "0.2s", duration: "4s" },
  { top: "71%", left: "30%", size: 4, delay: "2.5s", duration: "2.6s" },
  { top: "78%", left: "66%", size: 7, delay: "1.3s", duration: "3.2s" },
  { top: "84%", left: "12%", size: 4, delay: "0.9s", duration: "2.9s" },
  { top: "34%", left: "48%", size: 4, delay: "2.8s", duration: "3.5s" },
  { top: "67%", left: "48%", size: 5, delay: "0.5s", duration: "3.1s" },
  { top: "44%", left: "34%", size: 6, delay: "2s", duration: "2.7s" },
]

export function Hero() {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scriptSplit = new SplitText("[data-hero-script]", { type: "chars" })
        const nameSplit = new SplitText("[data-hero-name]", { type: "chars" })

        const intro = gsap.timeline({ defaults: { ease: "expo.out" } })
        intro
          .from("[data-hero-badge]", {
            y: -18,
            scale: 0.7,
            duration: 0.55,
          })
          .from(
            scriptSplit.chars,
            { y: 24, opacity: 0, duration: 0.7, stagger: 0.025 },
            "-=0.25"
          )
          .from(
            nameSplit.chars,
            { y: 60, opacity: 0, rotateX: -60, duration: 0.75, stagger: 0.05 },
            "-=0.45"
          )
          .from("[data-hero-line]", { scaleX: 0, duration: 0.6 }, "-=0.35")
          .from("[data-hero-sub]", { y: 18, duration: 0.5 }, "-=0.3")
          .from(
            "[data-hero-action]",
            { y: 16, duration: 0.45, stagger: 0.09 },
            "-=0.25"
          )
          .from("[data-hero-cue]", { duration: 0.5 }, "-=0.15")

        gsap.to("[data-hero-cue]", {
          y: 10,
          duration: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })

        gsap.to("[data-float]", {
          y: "+=14",
          x: "+=8",
          rotation: 12,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.45, from: "random" },
        })

        const bg = root.querySelector("[data-hero-bg]")
        if (bg) {
          gsap.fromTo(
            bg,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
              },
            }
          )
        }

        return () => {
          scriptSplit.revert()
          nameSplit.revert()
        }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const scrollToWish = () => {
    document
      .getElementById("wish")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      })
  }

  const celebrate = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    fireConfetti({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      count: 80,
    })
  }

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-[#1A0B2E] px-6 py-20 text-center sm:py-24"
    >
      <div
        data-hero-bg
        className="absolute inset-x-0 top-[-8%] -z-10 h-[116%] will-change-transform"
        // style={{
        //   backgroundImage:
        //     "linear-gradient(165deg, #1A0B2E 0%, #3D1152 38%, #7A1F5C 68%, #C43E6E 100%)",
        // }}
      >
        <div
          aria-hidden="true"
          className="absolute top-[12%] left-[10%] h-72 w-72 rounded-full bg-[#FB7185]/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute top-[45%] right-[8%] h-80 w-80 rounded-full bg-[#C084FC]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[8%] left-[35%] h-64 w-64 rounded-full bg-[#FDE68A]/20 blur-3xl"
        />
        {STARS.map((star, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="animate-twinkle absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
              opacity: 0.6,
            }}
          />
        ))}
        <span
          data-float
          aria-hidden="true"
          className="absolute top-[30%] left-[20%] text-2xl text-[#FDE68A]/70"
        >
          <Heart />
        </span>
        <span
          data-float
          aria-hidden="true"
          className="absolute top-[60%] right-[18%] text-3xl text-[#F9A8D4]/70"
        >
          <Heart />
        </span>
        <span
          data-float
          aria-hidden="true"
          className="absolute bottom-[22%] left-[14%] text-xl text-white/50"
        >
          <Heart />
        </span>
      </div>

      <div className="flex w-full max-w-3xl flex-col items-center gap-5">
        <Badge
          data-hero-badge
          className="h-7 gap-1.5 border border-white/25 bg-white/10 px-3 text-white backdrop-blur-sm"
        >
          <Cake aria-hidden="true" />
          31st October
        </Badge>

        <p
          data-hero-script
          className="font-script text-[clamp(2.5rem,8vw,5rem)] leading-none text-[#FDE68A]"
        >
          Happy Birthday
        </p>

        <div style={{ perspective: 800 }}>
          <h1
            data-hero-name
            className="font-display text-[clamp(4rem,17vw,10rem)] leading-[0.95] font-black text-white italic"
          >
            Rubi
          </h1>
        </div>

        <div
          data-hero-line
          aria-hidden="true"
          className="h-px w-40 bg-gradient-to-r from-transparent via-[#FDE68A] to-transparent"
        />

        <p data-hero-sub className="max-w-xl text-base text-white/85 sm:text-lg">
          The world got a little brighter on this day. Wishing you a year filled with
          loud laughter, soft moments, and every single thing your heart has been
          quietly hoping for.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            data-hero-action
            size="lg"
            onClick={celebrate}
            className="bg-[#FDE68A] px-6 text-[#3B0764] shadow-lg shadow-amber-500/25 hover:bg-[#FCD34D]"
          >
            <Sparkles aria-hidden="true" />
            Make a wish
          </Button>
          <Button
            data-hero-action
            variant="outline"
            size="lg"
            onClick={scrollToWish}
            className="border-white/30 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            Read your wish
          </Button>
        </div>

        <div
          data-mascot-anchor
          aria-hidden="true"
          className="motion-reduce:hidden"
        />
      </div>

      <div
        data-hero-cue
        aria-hidden="true"
        className="absolute bottom-6 left-6 text-white/70"
      >
        <ArrowDown className="size-5" />
      </div>
    </section>
  )
}
