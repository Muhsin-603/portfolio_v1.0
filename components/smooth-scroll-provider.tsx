"use client"

import { ReactLenis } from "lenis/react"
import type { ReactNode } from "react"

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  )
}
