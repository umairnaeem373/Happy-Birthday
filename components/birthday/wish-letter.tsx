"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Heart, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

gsap.registerPlugin(ScrollTrigger)

export function WishLetter() {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-reveal]", {
          y: 16,
          duration: 0.5,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="wish"
      ref={rootRef}
      className="relative overflow-hidden px-6 py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl">
        <Card className="px-6 py-10 shadow-sm sm:px-12 sm:py-14">
          <CardHeader className="flex flex-col items-center gap-5 text-center">
            <Badge data-reveal variant="secondary" className="h-6 gap-1.5 px-2.5">
              <Heart aria-hidden="true" />
              A wish just for you
            </Badge>
            <h2
              data-reveal
              className="font-display text-3xl font-bold text-foreground sm:text-4xl"
            >
              Today, the world celebrates you
            </h2>
          </CardHeader>

          <CardContent className="mt-6 flex flex-col items-center gap-5 text-center">
            <p
              data-reveal
              className="text-base leading-relaxed text-foreground sm:text-lg"
            >
              Rubi, you have a way of making heavy days feel lighter and ordinary
              moments feel like memories. The kindest heart, the loudest laugh, and a
              glow that no dull afternoon can put out.
            </p>
            <p data-reveal className="text-base leading-relaxed text-muted-foreground">
              On this 31st of October, I hope the day treats you exactly the way you
              treat everyone around you: gently, generously, and with a little extra
              sparkle. Here&apos;s to another year of you being unapologetically
              wonderful.
            </p>
            <div
              data-reveal
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <Sparkles className="size-5" />
            </div>
            <p data-reveal className="font-script text-2xl text-primary sm:text-3xl">
              With love, always
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
