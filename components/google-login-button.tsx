"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface GoogleLoginButtonProps {
  className?: string
  redirectTo?: string
}

export function GoogleLoginButton({ className, redirectTo }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl: redirectTo ?? "/dashboard" })
    } catch (error) {
      console.error("Google sign-in failed", error)
      toast.error("Unable to start Google sign-in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full justify-center gap-2", className)}
      onClick={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
    </Button>
  )
}
