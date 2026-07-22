import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { AlertTriangle, CircleDollarSign, ClipboardList, Container, Gauge, Plus, Ship, Truck } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { toast } from "sonner"

import { AppToaster } from "@/components/app-toaster"
import { PageHeader } from "@/components/shared/page-header"
import { Panel } from "@/components/shared/panel"
import { StatusBadge } from "@/components/shared/status-badge"
import { StatCard } from "@/components/shared/stat-card"
import { ErrorState, PermissionDenied, SkeletonTable } from "@/components/shared/states"
import { Timeline } from "@/components/shared/timeline"
import { Button } from "@/components/ui/button"
import { BookingForm } from "@/features/modules/booking-form"
import { DataTable } from "@/features/modules/data-table"
import { DetailPage } from "@/features/modules/detail-page"
import { GenericForm } from "@/features/modules/generic-form"
import { ModuleExtras } from "@/features/modules/module-extras"
import { ELOG_APP_CODE, ELOG_HOST_BASEPATH, elogNavItems, moduleRoutes, routeToModule } from "@/lib/elog/constants"
import type { MiniAppNavItem, ShellIntegrationContext } from "@/lib/elog/integration-context"
import { ElogIntegrationContextProvider, getHostPath, getStandalonePath } from "@/lib/elog/integration-context"
import { dashboardData, modules } from "@/lib/elog/mock-data"
import { useModuleRecords } from "@/lib/elog/mock-service"
import type { DataRecord, ModuleKey, ViewMode } from "@/lib/elog/types"
import { cn } from "@/lib/utils"

type QiankunMountProps = ShellIntegrationContext & {
  container?: Element | DocumentFragment
}

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean
    __ELOG_INTEGRATION_CONTEXT__?: ShellIntegrationContext
    bootstrap?: (props?: QiankunMountProps) => Promise<void>
    mount?: (props?: QiankunMountProps) => Promise<void>
    unmount?: (props?: QiankunMountProps) => Promise<void>
    elogApp?: {
      bootstrap: (props?: QiankunMountProps) => Promise<void>
      mount: (props?: QiankunMountProps) => Promise<void>
      unmount: (props?: QiankunMountProps) => Promise<void>
    }
  }
}

const kpiIcons = [Ship, ClipboardList, Container, Truck, CircleDollarSign, Gauge]
let reactRoot: Root | null = null
let rootElement: HTMLDivElement | null = null

function getContainerElement(container?: Element | DocumentFragment) {
  if (container?.querySelector) {
    return container.querySelector("#subapp-container") ?? container
  }

  return document.querySelector("#subapp-container") ?? document.body
}

function getOrCreateRootElement(container?: Element | DocumentFragment) {
  const host = getContainerElement(container)
  const existingRoot = host.querySelector?.("#elog-qiankun-root")

  if (existingRoot instanceof HTMLDivElement) {
    return existingRoot
  }

  const nextRoot = document.createElement("div")

  nextRoot.id = "elog-qiankun-root"
  nextRoot.className = "elog-qiankun-root"
  host.appendChild(nextRoot)

  return nextRoot
}

function normalizeProps(props: QiankunMountProps = {}): ShellIntegrationContext {
  return {
    appCode: "elog",
    layoutContext: props.layoutContext ?? {
      navigationOwner: "shell",
      sidebarMode: "host-rendered",
    },
    shellBridge: props.shellBridge,
    userContext: props.userContext,
    token: props.token,
    correlationId: props.correlationId,
    returnUrl: props.returnUrl,
  }
}

function publishIntegrationContext(props: QiankunMountProps) {
  window.__ELOG_INTEGRATION_CONTEXT__ = normalizeProps(props)
  window.sessionStorage.setItem("elog:qiankun-mode", "1")
  window.dispatchEvent(new CustomEvent("elog:integration-context"))
}

function getCurrentModuleKey(pathname = window.location.pathname): ModuleKey {
  const standalonePath = getStandalonePath(pathname)
  const segment = standalonePath.split("/").filter(Boolean)[0] ?? "dashboard"

  return routeToModule[segment] ?? "dashboard"
}

function getCurrentView(): ViewMode {
  const params = new URLSearchParams(window.location.search)
  return (params.get("view") as ViewMode | null) ?? "list"
}

function getSelectedId() {
  return new URLSearchParams(window.location.search).get("id")
}

function getQuery() {
  return new URLSearchParams(window.location.search).get("q") ?? ""
}

function pushShellPath(path: string) {
  window.history.pushState({}, "", path)
  window.dispatchEvent(new PopStateEvent("popstate"))
}

function replaceShellPath(path: string) {
  window.history.replaceState({}, "", path)
  window.dispatchEvent(new PopStateEvent("popstate"))
}

function QiankunELogApp({ integrationContext }: { integrationContext: ShellIntegrationContext }) {
  const [locationKey, setLocationKey] = React.useState(() => `${window.location.pathname}${window.location.search}`)

  React.useEffect(() => {
    function onPopState() {
      setLocationKey(`${window.location.pathname}${window.location.search}`)
    }

    window.addEventListener("popstate", onPopState)

    return () => {
      window.removeEventListener("popstate", onPopState)
    }
  }, [])

  const moduleKey = getCurrentModuleKey()

  React.useEffect(() => {
    if (window.location.pathname === "/" || !window.location.pathname.startsWith(ELOG_HOST_BASEPATH)) {
      replaceShellPath(ELOG_HOST_BASEPATH)
    }
  }, [locationKey])

  return (
    <ElogIntegrationContextProvider value={integrationContext}>
      <div className="min-h-svh bg-muted/35 p-4 text-foreground sm:p-5 lg:p-6">
        {moduleKey === "dashboard" ? <QiankunDashboard /> : <QiankunModulePage moduleKey={moduleKey} />}
        <AppToaster />
      </div>
    </ElogIntegrationContextProvider>
  )
}

function QiankunDashboard() {
  const bookingCreatePath = `${getHostPath(moduleRoutes.bookings)}?view=create`

  React.useEffect(() => {
    const legacyModule = new URLSearchParams(window.location.search).get("module")
    if (legacyModule && legacyModule in moduleRoutes) {
      replaceShellPath(getHostPath(moduleRoutes[legacyModule as ModuleKey]))
    }
  }, [])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Real-time operational overview across bookings, shipments, containers, truck appointments and finance."
        action={<Button onClick={() => pushShellPath(bookingCreatePath)}><Plus /> New booking</Button>}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {dashboardData.kpis.map((kpi, index) => <StatCard key={kpi.label} {...kpi} icon={kpiIcons[index] ?? Gauge} />)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Shipment Volume">
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.shipmentVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="shipments" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.16} />
                <Area type="monotone" dataKey="bookings" stroke="var(--info)" fill="var(--info)" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
        <Panel title="Booking Status Distribution">
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dashboardData.distribution} dataKey="value" nameKey="name" innerRadius={54} outerRadius={86} paddingAngle={3}>
                  {dashboardData.distribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Recent Activities">
          <Timeline items={dashboardData.activities} />
        </Panel>
        <Panel title="Operational Alerts">
          <div className="space-y-2">
            {dashboardData.alerts.map(([title, description, priority]) => (
              <div key={title} className="flex gap-3 rounded-lg border p-3">
                <AlertTriangle className={cn("mt-0.5 size-4", priority === "High" ? "text-destructive" : "text-warning")} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{title}</div>
                    <StatusBadge status={priority} />
                  </div>
                  <div className="text-sm text-muted-foreground">{description}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function QiankunModulePage({ moduleKey }: { moduleKey: ModuleKey }) {
  const config = modules[moduleKey]
  const query = getQuery()
  const view = getCurrentView()
  const selectedId = getSelectedId()
  const permission = new URLSearchParams(window.location.search).get("permission") === "denied"
  const { records, loading, error, refresh } = useModuleRecords(config, query)
  const selectedRecord = records.find((record) => record.id === selectedId) ?? config.records[0]

  function navigate(nextView: ViewMode = "list", id?: string, permissionDenied = permission) {
    const params = new URLSearchParams()
    if (nextView !== "list") params.set("view", nextView)
    if (id) params.set("id", id)
    if (permissionDenied) params.set("permission", "denied")
    const route = getHostPath(config.route)
    pushShellPath(`${route}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  if (view === "create" || view === "edit") {
    if (config.key === "bookings") {
      return <BookingForm record={view === "edit" ? selectedRecord : undefined} onBack={() => navigate()} />
    }

    return <GenericForm config={config} record={view === "edit" ? selectedRecord : undefined} onBack={() => navigate()} />
  }

  if (view === "detail" && selectedRecord) {
    return <DetailPage config={config} record={selectedRecord} onBack={() => navigate()} onEdit={() => navigate("edit", selectedRecord.id)} />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("list", undefined, !permission)}>Permission</Button>
            <Button onClick={() => navigate("create")}><Plus /> {config.primaryAction ?? `Create ${config.entityLabel}`}</Button>
          </div>
        }
      />
      {permission && <PermissionDenied />}
      <ModuleExtras moduleKey={config.key} />
      <Panel title={`${config.entityLabel} List`}>
        {loading ? (
          <SkeletonTable />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { refresh(); toast.success("Retrying mock API") }} />
        ) : (
          <DataTable
            config={config}
            data={records}
            onDetail={(record: DataRecord) => navigate("detail", record.id)}
            onEdit={(record: DataRecord) => navigate("edit", record.id)}
            onRefresh={() => { refresh(); toast.success("Data refreshed from mock API") }}
          />
        )}
      </Panel>
    </div>
  )
}

function ChartBox({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return <div className={cn("w-full", compact ? "h-[220px]" : "h-[320px]")}>{children}</div>
}

export async function bootstrap() {
  console.info("[eLog] bootstrap")
}

export async function mount(props: QiankunMountProps = {}) {
  const integrationContext = normalizeProps(props)

  publishIntegrationContext(props)
  props.shellBridge?.setNavItems(ELOG_APP_CODE, elogNavItems as MiniAppNavItem[])

  rootElement = getOrCreateRootElement(props.container)
  reactRoot?.unmount()
  reactRoot = createRoot(rootElement)
  reactRoot.render(<QiankunELogApp integrationContext={integrationContext} />)

  console.info("[eLog] mounted", {
    appCode: ELOG_APP_CODE,
    correlationId: props.correlationId,
    sidebarMode: props.layoutContext?.sidebarMode,
    userId: props.userContext?.userId,
    orgId: props.userContext?.orgId,
  })
}

export async function unmount(props: QiankunMountProps = {}) {
  props.shellBridge?.clearNavItems(ELOG_APP_CODE)
  toast.dismiss()
  reactRoot?.unmount()
  reactRoot = null

  if (rootElement) {
    rootElement.remove()
    rootElement = null
  }

  window.__ELOG_INTEGRATION_CONTEXT__ = {}
  window.dispatchEvent(new CustomEvent("elog:integration-context"))
  console.info("[eLog] unmounted")
}

const lifeCycles = { bootstrap, mount, unmount }

Object.assign(window, lifeCycles)
window.elogApp = lifeCycles
