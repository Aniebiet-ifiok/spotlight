'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Video, LogIn, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">


        <Card className="border border-white/10 shadow-2xl bg-white/0 backdrop-blur-md shadow-lg shadow-white/10">
          <CardHeader className="space-y-1 pb-3">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="border border-none  backdrop-blur-md shadow-lg shadow-green/7"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto px-0 font-normal text-xs text-primary"
                    asChild
                  >
                    <Link href="/forgot-password">
                      Forgot password?
                    </Link>
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="border border-none  backdrop-blur-md shadow-lg shadow-green/7 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-foreground hover:cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button className="w-full gap-2 text-background cursor-pointer hover:bg-input hover:text-white norder border-input" size="lg">
                Sign in
              </Button>
            </form>

            {/* Optional: add social auth or SSO later */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Google</Button>
              <Button variant="outline">GitHub</Button>
            </div> */}

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:text-primary/50 hover:text-underline transition-colors"
              >
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} SalesPaddi. All rights reserved.
        </p>
      </div>
    </div>
  )
}