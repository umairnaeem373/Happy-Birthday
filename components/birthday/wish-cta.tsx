"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PartyPopper } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { fireConfetti } from "./confetti"

gsap.registerPlugin(ScrollTrigger)

export function WishCta() {
  const rootRef = React.useRef<HTMLElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [wishes, setWishes] = React.useState(0)

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
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const makeWish = () => {
    const button = buttonRef.current
    setWishes((count) => count + 1)

    if (button) {
      const rect = button.getBoundingClientRect()
      fireConfetti({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        count: 90,
      })

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          button,
          { scale: 0.94 },
          { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" }
        )
      }
    }
  }

  return (
    <section ref={rootRef} className="px-6 pb-24 sm:pb-32">
      <div className="mx-auto max-w-2xl">
        <Card className="relative overflow-hidden px-6 py-10 text-center sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-amber-400 to-violet-500"
          />
          <div
            aria-hidden="true"
            className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative gap-5">
            <CardHeader className="flex flex-col items-center gap-5">
              <Badge data-reveal variant="secondary" className="h-6 gap-1.5 px-2.5">
                <PartyPopper aria-hidden="true" />
                The best part
              </Badge>
              <h2
                data-reveal
                className="font-display text-3xl font-bold text-foreground sm:text-4xl"
              >
                Close your eyes. Make it big.
              </h2>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-5">
              <p data-reveal className="max-w-md text-muted-foreground">
                One deep breath, one impossible wish, and a little bit of sparkle to
                carry it up to the stars.
              </p>
              <Button
                ref={buttonRef}
                size="lg"
                onClick={makeWish}
                className="mt-1 bg-primary px-7 shadow-lg shadow-primary/25"
              >
                <PartyPopper aria-hidden="true" />
                {wishes === 0 ? "Light the spark" : "Wish again"}
              </Button>
              <p
                data-reveal
                aria-live="polite"
                className="min-h-7 font-script text-xl text-primary"
              >
                {wishes > 0
                  ? `Wish ${wishes} is on its way to the stars`
                  : "Your wish is waiting"}
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  )
}
