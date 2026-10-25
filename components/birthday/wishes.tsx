"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Heart, Sparkles, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

gsap.registerPlugin(ScrollTrigger)

const WISHES = [
  {
    icon: Sparkles,
    title: "A year of wonder",
    description:
      "May ordinary Tuesdays keep surprising you with extraordinary little joys.",
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Heart,
    title: "Love on every side",
    description:
      "May you be met with the very same warmth you so freely give to everyone else.",
    tint: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    icon: Star,
    title: "Dreams that chase you back",
    description:
      "May every big, brave thing you reach for lean in and meet you halfway.",
    tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
]

export function Wishes() {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-wishes-intro] > *", {
          y: 14,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from("[data-grid-item]", {
          scale: 0.92,
          y: 16,
          duration: 0.4,
          stagger: { each: 0.06, from: "start", grid: "auto" },
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: "[data-wishes-grid]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="px-6 pb-24 sm:pb-32">
      <div className="mx-auto max-w-5xl">
        <div
          data-wishes-intro
          className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <Badge variant="outline" className="h-6 gap-1.5 px-2.5">
            <Star aria-hidden="true" />
            Three wishes
          </Badge>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            For your year ahead
          </h2>
          <p className="text-muted-foreground">
            No candles to blow out, just three small wishes sent out into the universe
            on your behalf.
          </p>
        </div>

        <div
          data-wishes-grid
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {WISHES.map(({ icon: Icon, title, description, tint }) => (
            <Card
              key={title}
              data-grid-item
              className="transition-shadow duration-200 hover:shadow-md"
            >
              <CardHeader>
                <div
                  aria-hidden="true"
                  className={`mb-1 flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}
                >
                  <Icon className="size-5" />
                </div>
                <CardTitle className="font-display text-lg font-semibold">
                  {title}
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
