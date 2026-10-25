"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Mascot } from "page-mascot"

gsap.registerPlugin(ScrollTrigger)

export function BirthdayMascot() {
  const wrapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const anchor = document.querySelector<HTMLElement>("[data-mascot-anchor]")
    const figure = wrap?.querySelector<HTMLElement>("[data-mascot-figure]")

    if (!wrap || !anchor || !figure) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const hero = anchor.closest("section")
    if (!hero) return

    const heroScale = () => {
      const value = Number.parseFloat(
        getComputedStyle(wrap).getPropertyValue("--mascot-scale")
      )
      return Number.isFinite(value) && value > 0 ? value : 2
    }

    const cornerScale = () => {
      const width = window.innerWidth
      if (width < 640) return 0.68
      if (width < 1024) return 0.9
      return 1
    }

    const ctx = gsap.context(() => {
      gsap.set(figure, { scale: heroScale(), transformOrigin: "100% 100%" })

      const heroOffsets = (): { x: number; y: number } => {
        gsap.set(wrap, { x: 0, y: 0 })
        gsap.set(figure, { scale: heroScale() })
        const target = figure.getBoundingClientRect()
        const box = anchor.getBoundingClientRect()

        return {
          x:
            box.left +
            box.width / 2 +
            window.scrollX -
            (target.left + target.width / 2),
          y:
            box.top +
            box.height / 2 +
            window.scrollY -
            (target.top + target.height / 2),
        }
      }

      const travel = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom 35%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      })

      travel
        .fromTo(
          wrap,
          { x: () => heroOffsets().x, y: () => heroOffsets().y },
          { x: 0, y: 0, ease: "none", duration: 1 },
          0
        )
        .fromTo(
          figure,
          { scale: () => heroScale(), transformOrigin: "100% 100%" },
          {
            scale: () => cornerScale(),
            transformOrigin: "100% 100%",
            ease: "none",
            duration: 1,
          },
          0
        )
        .fromTo(
          "[data-mascot-bubble]",
          { opacity: 1 },
          { opacity: 0, ease: "none", duration: 0.22 },
          0
        )
    }, wrap)

    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {})

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="mascot-scale fixed right-3 bottom-3 z-40 will-change-transform sm:right-5 sm:bottom-5"
    >
      <span
        data-mascot-bubble
        aria-hidden="true"
        className="mascot-bubble absolute -translate-x-1/2 rotate-[-4deg] rounded-full border border-border bg-card px-3 py-1 text-xs font-medium whitespace-nowrap text-card-foreground shadow-sm"
      >
        Hmm...
      </span>
      <div data-mascot-figure className="mascot-figure">
        <div className="animate-bob">
          <Mascot
            directions="/mascots/hijabi-directions.webp"
            reactions="/mascots/hijabi-reactions.webp"
            label="Rubi's birthday mascot"
            size={140}
          />
        </div>
      </div>
    </div>
  )
}
