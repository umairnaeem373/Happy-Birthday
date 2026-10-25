"use client"

import * as React from "react"
import { gsap } from "gsap"

export type ConfettiBurst = {
  /** Viewport x coordinate the burst originates from. Defaults to a curtain across the top. */
  x?: number
  y?: number
  count?: number
}

type Listener = (burst: ConfettiBurst) => void

const listeners = new Set<Listener>()

/** Fire a confetti celebration. Safe to call from any client component. */
export function fireConfetti(burst: ConfettiBurst = {}) {
  listeners.forEach((listener) => listener(burst))
}

const CONFETTI_COLORS = [
  "#F472B6",
  "#FBBF24",
  "#A78BFA",
  "#FB7185",
  "#FDE68A",
  "#67E8F9",
  "#F9A8D4",
  "#FDBA74",
]

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

function createPiece(color: string) {
  const el = document.createElement("span")
  const isDot = Math.random() < 0.25
  const width = isDot ? 6 + Math.random() * 5 : 6 + Math.random() * 6
  const height = isDot ? width : 10 + Math.random() * 8

  el.style.cssText = [
    "position:absolute",
    "left:0",
    "top:0",
    `width:${width}px`,
    `height:${height}px`,
    `background:${color}`,
    `border-radius:${isDot ? "9999px" : Math.random() < 0.5 ? "2px" : "9999px 2px 9999px 2px"}`,
    "pointer-events:none",
    "will-change:transform,opacity",
  ].join(";")

  return el
}

export function ConfettiLayer() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const timelines: gsap.core.Timeline[] = []

    const celebrate = ({ x, y, count }: ConfettiBurst) => {
      if (prefersReducedMotion()) return

      const isBurst = typeof x === "number" && typeof y === "number"
      const amount = count ?? (isBurst ? 70 : 45)
      const originX = x ?? 0
      const originY = y ?? 0

      for (let i = 0; i < amount; i++) {
        const piece = createPiece(CONFETTI_COLORS[i % CONFETTI_COLORS.length])
        container.appendChild(piece)

        const timeline = gsap.timeline({
          onComplete: () => {
            piece.remove()
            timelines.splice(timelines.indexOf(timeline), 1)
          },
        })
        timelines.push(timeline)

        const spin = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720)

        if (isBurst) {
          const angle = Math.random() * Math.PI * 2
          const distance = 90 + Math.random() * 340
          const targetX = originX + Math.cos(angle) * distance
          const targetY = originY + Math.sin(angle) * distance - 60
          const sway = (Math.random() - 0.5) * 120

          gsap.set(piece, { x: originX, y: originY, rotation: Math.random() * 180 })
          timeline
            .to(piece, {
              x: targetX,
              y: targetY,
              rotation: spin,
              duration: 0.55 + Math.random() * 0.3,
              ease: "power3.out",
            })
            .to(
              piece,
              {
                y: `+=${window.innerHeight * 0.65 + Math.random() * 200}`,
                x: `+=${sway}`,
                opacity: 0,
                duration: 1 + Math.random() * 0.6,
                ease: "power1.in",
              },
              "-=0.05"
            )
        } else {
          const startX = Math.random() * window.innerWidth
          const startY = -30 - Math.random() * 220
          const sway = (Math.random() - 0.5) * 160

          gsap.set(piece, { x: startX, y: startY, rotation: Math.random() * 180 })
          timeline.to(piece, {
            x: `+=${sway}`,
            y: window.innerHeight + 60,
            rotation: spin,
            opacity: 0.15,
            duration: 2.6 + Math.random() * 1.8,
            ease: "none",
          })
        }
      }
    }

    listeners.add(celebrate)
    return () => {
      listeners.delete(celebrate)
      timelines.forEach((timeline) => timeline.kill())
      container.replaceChildren()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    />
  )
}
