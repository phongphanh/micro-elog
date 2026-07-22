"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { Header } from "@/components/portal/header"
import { Sidebar } from "@/components/portal/sidebar"
import { modules } from "@/lib/elog/mock-data"
import { routeToModule } from "@/lib/elog/constants"
import {
  ElogIntegrationContextProvider,
  getStandalonePath,
  isHostRenderedNavigation,
  useGlobalIntegrationContext,
} from "@/lib/elog/integration-context"
import type { ModuleKey } from "@/lib/elog/types"
import { cn } from "@/lib/utils"

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const integrationContext = useGlobalIntegrationContext()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const hostRenderedNavigation = isHostRenderedNavigation(integrationContext)
  const standalonePathname = getStandalonePath(pathname)
  const segment = standalonePathname.split("/").filter(Boolean)[0] ?? "dashboard"
  const activeKey = routeToModule[segment] ?? "dashboard"
  const config = modules[activeKey as ModuleKey]

  return (
    <ElogIntegrationContextProvider value={integrationContext}>
      <div className="min-h-svh bg-muted/35 text-foreground">
        <div className="flex min-h-svh">
          {!hostRenderedNavigation && (
            <Sidebar
              activeKey={activeKey}
              collapsed={collapsed}
              mobileOpen={mobileOpen}
              onClose={() => setMobileOpen(false)}
              onCollapse={() => setCollapsed((value) => !value)}
            />
          )}
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col transition-[padding] duration-200",
              !hostRenderedNavigation && (collapsed ? "lg:pl-[84px]" : "lg:pl-[280px]")
            )}
          >
            {!hostRenderedNavigation && <Header config={config} onMenu={() => setMobileOpen(true)} />}
            <main className={cn("flex-1", hostRenderedNavigation ? "p-0" : "p-4 sm:p-5 lg:p-6")}>{children}</main>
          </div>
        </div>
      </div>
    </ElogIntegrationContextProvider>
  )
}
