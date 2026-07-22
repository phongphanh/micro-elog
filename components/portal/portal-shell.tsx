"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { Header } from "@/components/portal/header"
import { Sidebar } from "@/components/portal/sidebar"
import { modules } from "@/lib/elog/mock-data"
import { routeToModule } from "@/lib/elog/constants"
import type { ModuleKey } from "@/lib/elog/types"
import { cn } from "@/lib/utils"

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard"
  const activeKey = routeToModule[segment] ?? "dashboard"
  const config = modules[activeKey as ModuleKey]

  return (
    <div className="min-h-svh bg-muted/35 text-foreground">
      <div className="flex min-h-svh">
        <Sidebar
          activeKey={activeKey}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onCollapse={() => setCollapsed((value) => !value)}
        />
        <div className={cn("flex min-w-0 flex-1 flex-col transition-[padding] duration-200", collapsed ? "lg:pl-[84px]" : "lg:pl-[280px]")}>
          <Header config={config} onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 sm:p-5 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
