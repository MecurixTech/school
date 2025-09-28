"use client"

import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  className?: string
}

export function LoadingOverlay({ isLoading, message = "Loading...", className }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/20 backdrop-blur-md",
        "animate-in fade-in-0 duration-200",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-muted animate-spin">
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
              style={{ animationDuration: "1s" }}
            />
          </div>
          <div
            className="absolute inset-2 w-12 h-12 rounded-full border-4 border-muted animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          >
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-b-primary animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            />
          </div>
          <div className="absolute inset-6 w-4 h-4 rounded-full bg-primary animate-pulse" />
        </div>
        <p className="text-sm font-medium text-foreground animate-pulse">{message}</p>
      </div>
    </div>
  )
}
