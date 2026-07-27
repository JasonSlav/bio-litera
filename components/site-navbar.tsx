"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  Leaf,
  Menu,
  X,
  BookOpen,
  Gamepad2,
  FolderKanban,
  Globe2,
  BarChart3,
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { label: "Materi IPA", href: "/materi", icon: BookOpen },
  { label: "Aktivitas Interaktif", href: "/aktivitas", icon: Gamepad2 },
  { label: "Proyek", href: "/proyek", icon: FolderKanban },
  { label: "SDGs", href: "/sdgs", icon: Globe2 },
  { label: "Literasi Sains", href: "/literasi-sains", icon: BarChart3 },
]

export function SiteNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isActive = (href: string) => pathname.startsWith(href)

  function handleLogout() {
    logout()
    router.replace("/login")
  }

  const initial = user?.name?.charAt(0) ?? "?"

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/materi" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-heading text-lg font-bold text-foreground">
            Bio-Litera
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-muted"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                {initial}
              </span>
              <span className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {user?.name ?? "User"}
                </p>
                <p className="text-xs capitalize text-muted-foreground leading-tight">
                  {user?.role ?? ""}
                </p>
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card p-2 shadow-lg">
                <div className="flex items-center gap-3 border-b border-border px-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                    {initial}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                {user?.classCode && (
                  <div className="border-b border-border px-3 py-2">
                    <p className="text-xs text-muted-foreground">Kode Kelas</p>
                    <p className="text-sm font-bold text-foreground tracking-wider">
                      {user.classCode}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Buka menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 pb-4 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                isActive(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <hr className="my-2 border-border" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </nav>
      )}
    </header>
  )
}
