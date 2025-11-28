"use client"

import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/templates"
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Privacy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {currentYear} cropdot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

