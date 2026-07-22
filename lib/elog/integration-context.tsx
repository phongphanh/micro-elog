"use client"

import * as React from "react"

export type MiniAppNavItem = {
  key: string
  label: string
  path: string
  icon?: string
}

export type ShellBridge = {
  setNavItems: (appCode: string, navItems: MiniAppNavItem[]) => void
  clearNavItems: (appCode: string) => void
}

export type ShellIntegrationContext = {
  appCode?: "elog"
  layoutContext?: {
    navigationOwner?: "shell"
    sidebarMode?: "host-rendered"
  }
  shellBridge?: ShellBridge
  userContext?: {
    userId: string
    orgId: string
    roles: string[]
  }
  token?: string
  correlationId?: string
  returnUrl?: string
}

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean
    __ELOG_INTEGRATION_CONTEXT__?: ShellIntegrationContext
  }
}

const IntegrationContext = React.createContext<ShellIntegrationContext>({})

export const ElogIntegrationContextProvider = IntegrationContext.Provider

export function useElogIntegrationContext() {
  return React.useContext(IntegrationContext)
}

export function useGlobalIntegrationContext() {
  const [context, setContext] = React.useState<ShellIntegrationContext>(() => getWindowIntegrationContext())

  React.useEffect(() => {
    persistQiankunModeFromLocation()

    function syncContext() {
      persistQiankunModeFromLocation()
      setContext(getWindowIntegrationContext())
    }

    syncContext()
    window.addEventListener("elog:integration-context", syncContext)

    return () => {
      window.removeEventListener("elog:integration-context", syncContext)
    }
  }, [])

  return context
}

export function isHostRenderedNavigation(context: ShellIntegrationContext) {
  if (typeof window === "undefined") {
    return context.layoutContext?.sidebarMode === "host-rendered"
  }

  return (
    Boolean(window.__POWERED_BY_QIANKUN__) ||
    hasQiankunModeFlag() ||
    context.layoutContext?.sidebarMode === "host-rendered" ||
    context.layoutContext?.navigationOwner === "shell"
  )
}

export function getStandalonePath(path: string) {
  if (path === "/apps/elog") {
    return "/"
  }

  if (path.startsWith("/apps/elog/")) {
    return path.replace("/apps/elog", "") || "/"
  }

  return path
}

export function getHostPath(path: string) {
  if (path === "/") {
    return "/apps/elog"
  }

  return path.startsWith("/apps/elog") ? path : `/apps/elog${path}`
}

function getWindowIntegrationContext() {
  if (typeof window === "undefined") {
    return {}
  }

  return window.__ELOG_INTEGRATION_CONTEXT__ ?? {}
}

function persistQiankunModeFromLocation() {
  if (typeof window === "undefined") {
    return
  }

  if (new URLSearchParams(window.location.search).get("__qiankun") === "1") {
    window.sessionStorage.setItem("elog:qiankun-mode", "1")
  }
}

function hasQiankunModeFlag() {
  try {
    return (
      new URLSearchParams(window.location.search).get("__qiankun") === "1" ||
      window.sessionStorage.getItem("elog:qiankun-mode") === "1"
    )
  } catch {
    return false
  }
}
