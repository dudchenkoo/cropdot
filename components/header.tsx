"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Coins, User, Moon, Sun, CreditCard, MessageCircle, LogOut, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useCoins } from "@/hooks/use-coins"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAvatarUrl, getUserEmail } from "@/lib/avatar"
import { signOut, useSession } from "next-auth/react"

interface HeaderProps {
  subtitle?: string
  topic?: string
  onBack?: () => void
  onLogoClick?: () => void
  status?: string | null
}

export function Header({ subtitle, topic, onBack, onLogoClick, status }: HeaderProps) {
  const pathname = usePathname()
  const displayTopic = topic || subtitle
  const { coins } = useCoins()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const avatarUrl = getAvatarUrl(session)
  const userEmail = getUserEmail(session)

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem("cropdot-coins")
      window.localStorage.removeItem("carousel-generator-saves")
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Error during sign out", error)
    }
  }

  return (
    <header className="border-b border-border px-6 py-4 bg-background">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onLogoClick ? (
            <button
              onClick={onLogoClick}
              className="text-lg font-semibold text-foreground cursor-pointer"
              style={{
                fontFamily: "var(--font-inter-tight), sans-serif",
              }}
            >
              cropdot
            </button>
          ) : (
            <Link
              href="/"
              className="text-lg font-semibold bg-clip-text text-transparent cursor-pointer"
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
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">{displayTopic}</span>
            </>
          )}
          {status && (
            <>
              {displayTopic && <div className="h-4 w-px bg-border" />}
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <Check className="w-3 h-3" />
                {status}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-6">
            <Link
              href="/templates"
              className={`text-sm transition-colors cursor-pointer ${
                pathname === "/templates" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className={`text-sm transition-colors cursor-pointer ${
                pathname === "/pricing" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pricing
            </Link>
          </nav>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
            <Coins className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">{coins}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full hover:ring-2 hover:ring-ring hover:ring-offset-2 transition-all cursor-pointer outline-none">
                <Avatar className="h-8 w-8">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="User avatar" />}
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="cursor-pointer"
              >
                {mounted && theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/billing" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/contact" className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
