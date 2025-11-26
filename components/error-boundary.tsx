"use client"

import type { ReactNode } from "react"
import React from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  message?: string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", {
      component: this.props.componentName ?? "Unknown component",
      error,
      info,
    })
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-center">
            <p className="text-sm font-semibold text-destructive">Something went wrong.</p>
            {this.state.message ? (
              <p className="text-xs text-muted-foreground">{this.state.message}</p>
            ) : null}
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
