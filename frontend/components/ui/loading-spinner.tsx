"use client"

import { Loader2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <div
          className={cn(
            "gradient-primary rounded-full flex items-center justify-center animate-pulse-subtle shadow-lg",
            size === "sm" ? "w-8 h-8" : size === "md" ? "w-16 h-16" : "w-20 h-20",
          )}
        >
          <Zap className={cn("text-white", sizeClasses[size])} />
        </div>
        <Loader2
          className={cn(
            "absolute inset-0 animate-spin text-primary/30",
            size === "sm" ? "w-8 h-8" : size === "md" ? "w-16 h-16" : "w-20 h-20",
          )}
        />
      </div>
      {text && <p className="mt-4 text-muted-foreground animate-fade-in">{text}</p>}
    </div>
  )
}
