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
    function syncContext() {
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
