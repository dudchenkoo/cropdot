"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

// Function to calculate relative luminance
function getLuminance(hex: string): number {
  const rgb = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!rgb) return 0

  const r = parseInt(rgb[1], 16) / 255
  const g = parseInt(rgb[2], 16) / 255
  const b = parseInt(rgb[3], 16) / 255

  const [rLinear, gLinear, bLinear] = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

// Function to calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Get computed color value by creating a temporary element
function getComputedColor(cssVar: string, isBackground = false): string {
  if (typeof window === "undefined") return "#000000"
  
  // Create a temporary element to get the computed color
  const tempEl = document.createElement("div")
  if (isBackground) {
    tempEl.style.backgroundColor = `var(${cssVar})`
  } else {
    tempEl.style.color = `var(${cssVar})`
  }
  tempEl.style.position = "absolute"
  tempEl.style.visibility = "hidden"
  tempEl.style.width = "1px"
  tempEl.style.height = "1px"
  document.body.appendChild(tempEl)
  
  const computedStyle = getComputedStyle(tempEl)
  const computedColor = isBackground ? computedStyle.backgroundColor : computedStyle.color
  document.body.removeChild(tempEl)
  
  // Parse rgb/rgba string to hex
  const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`
  }
  
  // Fallback: try to get the CSS variable value directly
  const rootStyle = getComputedStyle(document.documentElement)
  const varValue = rootStyle.getPropertyValue(cssVar).trim()
  console.warn(`Could not parse color for ${cssVar}, got: ${computedColor}, var value: ${varValue}`)
  
  return "#000000"
}

interface ContrastTest {
  name: string
  foreground: string
  background: string
  foregroundVar: string
  backgroundVar: string
  foregroundRaw: string
  backgroundRaw: string
  ratio: number
  passesAA: boolean
  passesAAA: boolean
  passesAALarge: boolean
  passesAAALarge: boolean
}

export default function ContrastTestPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [tests, setTests] = useState<ContrastTest[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const colorPairs = [
      { name: "Foreground on Background", fg: "--foreground", bg: "--background" },
      { name: "Card Foreground on Card", fg: "--card-foreground", bg: "--card" },
      { name: "Primary Foreground on Primary", fg: "--primary-foreground", bg: "--primary" },
      { name: "Secondary Foreground on Secondary", fg: "--secondary-foreground", bg: "--secondary" },
      { name: "Muted Foreground on Muted", fg: "--muted-foreground", bg: "--muted" },
      { name: "Accent Foreground on Accent", fg: "--accent-foreground", bg: "--accent" },
      { name: "Destructive Foreground on Destructive", fg: "--destructive-foreground", bg: "--destructive" },
      { name: "Foreground on Secondary", fg: "--foreground", bg: "--secondary" },
      { name: "Foreground on Muted", fg: "--foreground", bg: "--muted" },
      { name: "Muted Foreground on Background", fg: "--muted-foreground", bg: "--background" },
      { name: "Foreground on Border", fg: "--foreground", bg: "--border" },
      { name: "Primary on Background", fg: "--primary", bg: "--background" },
    ]

    const computedTests = colorPairs.map((pair) => {
      const fgColor = getComputedColor(pair.fg, false)
      const bgColor = getComputedColor(pair.bg, true)
      
      // Get raw CSS variable values for debugging
      const rootStyle = getComputedStyle(document.documentElement)
      const fgRaw = rootStyle.getPropertyValue(pair.fg).trim()
      const bgRaw = rootStyle.getPropertyValue(pair.bg).trim()
      
      const ratio = getContrastRatio(fgColor, bgColor)

      return {
        name: pair.name,
        foreground: fgColor,
        background: bgColor,
        foregroundVar: pair.fg,
        backgroundVar: pair.bg,
        foregroundRaw: fgRaw,
        backgroundRaw: bgRaw,
        ratio: ratio,
        passesAA: ratio >= 4.5, // WCAG AA for normal text
        passesAAA: ratio >= 7, // WCAG AAA for normal text
        passesAALarge: ratio >= 3, // WCAG AA for large text
        passesAAALarge: ratio >= 4.5, // WCAG AAA for large text
      }
    })

    setTests(computedTests)
  }, [mounted, theme])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Contrast Test</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setTheme("light")}
              variant={theme === "light" ? "default" : "outline"}
            >
              Light Theme
            </Button>
            <Button
              onClick={() => setTheme("dark")}
              variant={theme === "dark" ? "default" : "outline"}
            >
              Dark Theme
            </Button>
          </div>
        </div>

        <div className="mb-4 p-4 rounded-lg bg-card border border-border">
          <h2 className="text-xl font-semibold mb-2 text-card-foreground">
            WCAG Contrast Requirements
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• AA Normal Text: 4.5:1 minimum</li>
            <li>• AAA Normal Text: 7:1 minimum</li>
            <li>• AA Large Text: 3:1 minimum</li>
            <li>• AAA Large Text: 4.5:1 minimum</li>
          </ul>
        </div>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border"
              style={{ backgroundColor: test.background }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2" style={{ color: test.foreground }}>
                  {test.name}
                </h3>
                <div className="text-sm space-y-1" style={{ color: test.foreground }}>
                  <p className="font-mono text-xs opacity-75">
                    {test.foregroundVar}: {test.foregroundRaw} → {test.foreground}
                  </p>
                  <p className="font-mono text-xs opacity-75">
                    {test.backgroundVar}: {test.backgroundRaw} → {test.background}
                  </p>
                  <p className="font-mono font-semibold mt-2">
                    Contrast Ratio: {test.ratio.toFixed(2)}:1
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <div
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    test.passesAA
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-red-500/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {test.passesAA ? "✓" : "✗"} AA Normal
                </div>
                <div
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    test.passesAAA
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-red-500/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {test.passesAAA ? "✓" : "✗"} AAA Normal
                </div>
                <div
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    test.passesAALarge
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-red-500/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {test.passesAALarge ? "✓" : "✗"} AA Large
                </div>
                <div
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    test.passesAAALarge
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-red-500/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {test.passesAAALarge ? "✓" : "✗"} AAA Large
                </div>
              </div>

              {/* Sample text */}
              <div className="mt-4 space-y-2">
                <p className="text-sm" style={{ color: test.foreground }}>
                  Sample normal text: The quick brown fox jumps over the lazy dog.
                </p>
                <p className="text-lg font-semibold" style={{ color: test.foreground }}>
                  Sample large text: The quick brown fox jumps over the lazy dog.
                </p>
                {test.ratio < 3 && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                    ⚠️ Very low contrast! This combination may be hard to read.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-lg bg-card border border-border">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">AA Normal Pass</p>
              <p className="text-2xl font-bold text-foreground">
                {tests.filter((t) => t.passesAA).length} / {tests.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AAA Normal Pass</p>
              <p className="text-2xl font-bold text-foreground">
                {tests.filter((t) => t.passesAAA).length} / {tests.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AA Large Pass</p>
              <p className="text-2xl font-bold text-foreground">
                {tests.filter((t) => t.passesAALarge).length} / {tests.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AAA Large Pass</p>
              <p className="text-2xl font-bold text-foreground">
                {tests.filter((t) => t.passesAAALarge).length} / {tests.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

