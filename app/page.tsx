"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import { login } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function HomePage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const remember = formData.get("remember") === "on"

    try {
      const response = await login({ email, password })

      // Store the token
      if (remember) {
        localStorage.setItem("authToken", response.token)
      } else {
        sessionStorage.setItem("authToken", response.token)
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to login. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background flex flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 p-3 rounded-full bg-accent w-fit">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Login to access MediceusAI</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="doctor@hospital.com"
                type="email"
                autoComplete="email"
                required
                aria-invalid={error ? "true" : "false"}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  aria-invalid={error ? "true" : "false"}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" name="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

