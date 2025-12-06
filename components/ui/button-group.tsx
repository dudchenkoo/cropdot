import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div className={cn("inline-flex rounded-lg border border-border bg-secondary overflow-hidden", className)}>
      {children}
    </div>
  )
}

interface ButtonGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean
  children: React.ReactNode
}

export function ButtonGroupItem({ 
  isSelected = false, 
  children, 
  className,
  ...props 
}: ButtonGroupItemProps) {
  return (
    <button
      className={cn(
        "px-4 py-2.5 text-sm capitalize transition-all border-r border-border last:border-r-0",
        "first:rounded-l-lg last:rounded-r-lg",
        isSelected
          ? "bg-accent/20 text-white font-medium"
          : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      aria-pressed={isSelected}
      {...props}
    >
      {children}
    </button>
  )
}

