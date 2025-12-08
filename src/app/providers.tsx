'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { initPostHog } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()

    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
    })

    let frameId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}