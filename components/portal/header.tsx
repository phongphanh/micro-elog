"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Bell, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { moduleRoutes } from "@/lib/elog/constants"
import type { ModuleConfig } from "@/lib/elog/types"

export function Header({
  config,
  onMenu,
}: {
  config: ModuleConfig
  onMenu: () => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTheme, resolvedTheme, theme } = useTheme()
  const query = searchParams.get("q") ?? ""

  function setSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("q", value)
    else params.delete("q")
    router.replace(`${config.route}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-5 lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open sidebar">
          <Menu />
        </Button>
        <div className="hidden min-w-0 text-sm sm:block">
          <Link className="text-muted-foreground hover:text-foreground" href="/">eLog</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="font-medium">{config.title}</span>
        </div>
        <div className="relative ml-auto hidden w-full max-w-md md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings, shipments, containers..."
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            aria-label="Global search"
          />
        </div>
        <select className="hidden h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:block" aria-label="Organization switcher">
          <option>eLog Vietnam</option>
          <option>North Branch</option>
          <option>South Branch</option>
        </select>
        <Link
          href={moduleRoutes.notifications}
          className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => {
            if (theme === "system") setTheme(resolvedTheme === "dark" ? "light" : "dark")
            else setTheme(theme === "dark" ? "light" : "dark")
          }}
        >
          {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        </Button>
        <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-2 text-sm">
          <div className="grid size-6 place-items-center rounded-md bg-primary text-[0.7rem] font-semibold text-primary-foreground">LP</div>
          <ChevronDown className="size-3 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}
