import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="border-primary/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-mono text-primary">&gt; SUCCESS_</CardTitle>
            <CardDescription className="font-mono text-muted-foreground">
              // Account created successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-mono text-sm text-muted-foreground">
              Please check your email to verify your account. Once verified, you can{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                log in
              </Link>
              .
            </p>
            <div className="pt-4 border-t border-primary/20">
              <p className="font-mono text-xs text-muted-foreground">
                // NOTE: Check your spam folder if you don't see the email
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
