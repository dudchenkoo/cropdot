"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface PageBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function PageBackground({ children, className = "" }: PageBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dark theme dot pattern
  const dotColor = `rgba(255, 255, 255, 0.08)`

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${className}`}
      style={{
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {children}
    </div>
  )
}
