"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, Ship, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { menuGroups, moduleRoutes } from "@/lib/elog/constants"
import type { ModuleKey } from "@/lib/elog/types"
import { cn } from "@/lib/utils"

export function Sidebar({
  activeKey,
  collapsed,
  mobileOpen,
  onClose,
  onCollapse,
}: {
  activeKey: ModuleKey
  collapsed: boolean
  mobileOpen: boolean
  onClose: () => void
  onCollapse: () => void
}) {
  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-black/40 lg:hidden", mobileOpen ? "block" : "hidden")} onClick={onClose} />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-all duration-200 lg:translate-x-0 lg:shadow-none",
          collapsed ? "w-[84px]" : "w-[280px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-16 items-center gap-3 border-b px-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Ship className="size-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-lg font-semibold">eLog</div>
                <div className="text-xs text-muted-foreground">Enterprise logistics</div>
              </div>
            )}
            <Button variant="ghost" size="icon-sm" className="ml-auto lg:hidden" onClick={onClose} aria-label="Close sidebar">
              <X />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {menuGroups.map((group) => (
              <div key={group.label} className="mb-5">
                {!collapsed && <div className="mb-2 px-2 text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</div>}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = activeKey === item.key
                    return (
                      <Link
                        key={item.key}
                        href={moduleRoutes[item.key]}
                        onClick={onClose}
                        className={cn(
                          "flex h-9 w-full items-center gap-3 rounded-lg px-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                          active ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          collapsed && "justify-center"
                        )}
                        aria-label={item.label}
                      >
                        <Icon className="size-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="border-t p-3">
            <Button variant="ghost" size={collapsed ? "icon" : "default"} className="mb-3 w-full justify-center lg:flex" onClick={onCollapse} aria-label="Collapse sidebar">
              {collapsed ? <ChevronRight /> : <><ChevronLeft /> Collapse</>}
            </Button>
            <div className={cn("flex items-center gap-3 rounded-lg bg-muted/60 p-2", collapsed && "justify-center")}>
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-sm font-semibold text-white">LP</div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">Linh Pham</div>
                  <div className="truncate text-xs text-muted-foreground">Operations Manager</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
