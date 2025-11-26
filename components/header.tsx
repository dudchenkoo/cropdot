"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  subtitle?: string
  topic?: string
  platform?: string
  onBack?: () => void
  onLogoClick?: () => void
}

const platformColors: Record<string, string> = {
  linkedin: "#0077B5",
  instagram: "#E4405F",
  telegram: "#0088cc",
  threads: "#000000",
}

export function Header({ subtitle, topic, platform, onBack, onLogoClick }: HeaderProps) {
  const pathname = usePathname()
  const platformColor = platform ? platformColors[platform.toLowerCase()] : undefined
  const displayTopic = topic || subtitle

  return (
    <header className="border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onLogoClick ? (
            <button
              onClick={onLogoClick}
              className="text-lg font-semibold bg-clip-text text-transparent cursor-pointer"
              style={{
                fontFamily: "var(--font-inter-tight), sans-serif",
                backgroundImage: "linear-gradient(to bottom, #888888, #444444)",
              }}
            >
              cropdot
            </button>
          ) : (
            <Link
              href="/"
              className="text-lg font-semibold bg-clip-text text-transparent"
              style={{
                fontFamily: "var(--font-inter-tight), sans-serif",
                backgroundImage: "linear-gradient(to bottom, #888888, #444444)",
              }}
            >
              cropdot
            </Link>
          )}
          {displayTopic && (
            <>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{displayTopic}</span>
              {platform && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wide"
                  style={{
                    backgroundColor: platformColor ? `${platformColor}20` : "rgba(255, 255, 255, 0.1)",
                    color: platformColor || "#ffffff",
                    border: platformColor ? `1px solid ${platformColor}40` : "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {platform}
                </span>
              )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {onBack && (
              <button
                onClick={onBack}
                className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            )}
            <Link
              href="/templates"
              className={`text-sm transition-colors cursor-pointer ${
                pathname === "/templates" ? "text-white/90" : "text-white/50 hover:text-white"
              }`}
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className={`text-sm transition-colors cursor-pointer ${
                pathname === "/pricing" ? "text-white/90" : "text-white/50 hover:text-white"
              }`}
            >
              Pricing
            </Link>
          </nav>
          <button className="text-sm px-4 py-1.5 rounded-full bg-[#e8e4df] text-[#1a1a1a] font-medium hover:bg-white transition-colors cursor-pointer">
            Sign in
          </button>
        </div>
      </div>
    </header>
  )
}
