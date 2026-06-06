import * as React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'work' | 'personal' | 'shopping' | 'learning' | 'wellness'
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
        {
          "border-transparent bg-primary text-primary-foreground shadow":
            variant === "default",
          "border-transparent bg-secondary text-secondary-foreground":
            variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground shadow":
            variant === "destructive",
          "text-foreground border-border bg-background": variant === "outline",
          
          // Category-specific high-contrast subtle badges
          "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20": 
            variant === "work",
          "border-transparent bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20": 
            variant === "personal",
          "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20": 
            variant === "shopping",
          "border-transparent bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20": 
            variant === "learning",
          "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20": 
            variant === "wellness",
        },
        className
      )}
      {...props}
    />
  )
}
