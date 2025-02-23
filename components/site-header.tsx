"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { History, DoorClosed, LogOut } from "lucide-react"
import { useState, useEffect } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return // Zapobiega błędom SSR

    const userEmail = sessionStorage.getItem("userEmail")

    if (pathname.includes("/dashboard")) {
      if (userEmail) {
        setUser({ email: userEmail })
      } else {
        router.push("/login")
      }
    }

    // Usuwanie sesji przy zamknięciu okna / odświeżeniu strony
    const clearSession = () => sessionStorage.clear()
    window.addEventListener("beforeunload", clearSession)

    // Można dodać obsługę przejścia w tło (np. po 5 minutach usuwać sesję)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTimeout(() => {
          sessionStorage.clear()
          setUser(null)
        }, 5 * 60 * 1000) // 5 minut
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("beforeunload", clearSession)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pathname, router])

  const handleLogout = () => {
    sessionStorage.clear()
    setUser(null)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
            <span className="text-xl font-bold text-blue-900">MediceusAI</span>
          </Link>

          {user && (
            <nav className="flex items-center space-x-8 text-sm font-medium">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-2 ${
                  pathname.includes("/dashboard") && !pathname.includes("/history")
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <DoorClosed className="h-4 w-4" />
                <span>Operation Rooms</span>
              </Link>
              <Link
                href="/dashboard/history"
                className={`flex items-center space-x-2 ${
                  pathname.includes("/history") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </Link>
            </nav>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">{user.email}</span>
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs">Doctor</span>
            </div>
            <Button variant="ghost" className="text-gray-500 hover:text-blue-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
