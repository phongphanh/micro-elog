"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertTriangle, CircleDollarSign, ClipboardList, Container, Gauge, Plus, Ship, Truck } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { PageHeader } from "@/components/shared/page-header"
import { Panel } from "@/components/shared/panel"
import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Timeline } from "@/components/shared/timeline"
import { Button } from "@/components/ui/button"
import { moduleRoutes } from "@/lib/elog/constants"
import { dashboardData } from "@/lib/elog/mock-data"
import type { ModuleKey } from "@/lib/elog/types"
import { cn } from "@/lib/utils"

const kpiIcons = [Ship, ClipboardList, Container, Truck, CircleDollarSign, Gauge]

export function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    const legacyModule = searchParams.get("module")
    if (legacyModule && legacyModule in moduleRoutes) {
      router.replace(moduleRoutes[legacyModule as ModuleKey])
    }
  }, [router, searchParams])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Real-time operational overview across bookings, shipments, containers, truck appointments and finance."
        action={<Button><Link className="inline-flex items-center gap-1.5" href="/bookings?view=create"><Plus className="size-4" /> New booking</Link></Button>}
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
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Revenue Overview">
          <ChartBox compact>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.shipmentVolume}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="var(--success)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
        <Panel title="On-time vs Delayed">
          <ChartBox compact>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.shipmentVolume.map((item, index) => ({ ...item, onTime: 92 + index, delayed: 8 - index / 2 }))}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="onTime" stroke="var(--success)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="delayed" stroke="var(--destructive)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
        <Panel title="Container Status">
          <div className="grid gap-2">
            {["In Transit", "Gate In", "Customs Hold", "Ready for Pickup", "Returned"].map((label, index) => (
              <div key={label} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>{label}</span>
                <span className="font-semibold">{[426, 184, 19, 93, 141][index]}</span>
              </div>
            ))}
          </div>
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

function ChartBox({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return <div className={cn("w-full", compact ? "h-[220px]" : "h-[320px]")}>{children}</div>
}
