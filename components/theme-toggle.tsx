"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 rounded-lg shadow-lg transition-all hover:scale-110 border-2 border-primary/30 hover:border-primary bg-card/80 backdrop-blur-sm animate-glow-pulse"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-transform rotate-0 text-primary" />
      ) : (
        <Sun className="h-5 w-5 transition-transform rotate-0 text-accent" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
