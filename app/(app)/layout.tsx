"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { SiteNavbar } from "@/components/site-navbar"

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
      <SiteNavbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div key={pathname} className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
