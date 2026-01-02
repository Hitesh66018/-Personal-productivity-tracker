"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <Card className="border-primary/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-mono text-primary">&gt; LOGIN_</CardTitle>
            <CardDescription className="font-mono text-muted-foreground">
              // Access your personal tracker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-mono text-primary">
                    [ EMAIL ]
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-mono border-primary/30 focus:border-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-mono text-primary">
                    [ PASSWORD ]
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-mono border-primary/30 focus:border-primary"
                  />
                </div>
                {error && <p className="text-sm text-red-500 font-mono">// ERROR: {error}</p>}
                <Button type="submit" className="w-full font-mono" disabled={isLoading}>
                  {isLoading ? "// LOGGING IN..." : "&gt; LOGIN"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm font-mono">
                <span className="text-muted-foreground">// New user? </span>
                <Link href="/auth/sign-up" className="text-primary hover:underline">
                  SIGN UP
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
