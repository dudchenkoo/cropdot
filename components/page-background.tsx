import type React from "react"
interface PageBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function PageBackground({ children, className = "" }: PageBackgroundProps) {
  return (
    <div
      className={`min-h-screen bg-[#0a0a0a] text-white ${className}`}
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {children}
    </div>
  )
}
