"use client"

import { toast } from "sonner"

import { FileUploader } from "@/components/shared/file-uploader"
import { Panel } from "@/components/shared/panel"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import type { ModuleKey } from "@/lib/elog/types"
import { AlertTriangle, CircleDollarSign, Ship } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModuleExtras({ moduleKey }: { moduleKey: ModuleKey }) {
  return (
    <>
      {moduleKey === "appointments" && <AppointmentCalendar />}
      {moduleKey === "documents" && <FileUploader />}
      {moduleKey === "reports" && <ReportsShowcase />}
      {moduleKey === "roles" && <PermissionMatrix />}
      {moduleKey === "settings" && <SettingsTabs />}
    </>
  )
}

export function AppointmentCalendar() {
  return (
    <Panel title="Appointment Calendar">
      <div className="mb-3 flex gap-2">
        {["Day", "Week", "Month"].map((view) => <Button key={view} variant={view === "Week" ? "default" : "outline"} size="sm">{view}</Button>)}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
        {Array.from({ length: 16 }, (_, index) => (
          <button key={index} className={cn("rounded-lg border p-3 text-left text-sm hover:bg-muted", index % 5 === 0 && "border-destructive/40 bg-destructive/5")} onClick={() => toast.success(`Selected ${8 + (index % 8)}:00 slot`)}>
            <div className="font-medium">{8 + (index % 8)}:00</div>
            <div className="text-xs text-muted-foreground">{index % 5 === 0 ? "Full slot" : `${4 - (index % 4)} slots open`}</div>
          </button>
        ))}
      </div>
    </Panel>
  )
}

export function ReportsShowcase() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <StatCard label="Shipment Summary" value="486" delta="+12%" comparison="current range" icon={Ship} tone="blue" />
      <StatCard label="Revenue Report" value="$438K" delta="+9%" comparison="month to date" icon={CircleDollarSign} tone="green" />
      <StatCard label="Delayed Shipments" value="27" delta="-6%" comparison="improved weekly" icon={AlertTriangle} tone="amber" />
    </div>
  )
}

export function PermissionMatrix() {
  const groups = ["Dashboard", "Bookings", "Shipments", "Containers", "Truck Appointments", "Vehicles", "Drivers", "Documents", "Invoices", "Payments", "Customers", "Reports", "Users", "Roles", "Settings"]
  const actions = ["View", "Create", "Update", "Delete", "Approve", "Export"]
  return (
    <Panel title="Permission Matrix">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr>{["Module", ...actions].map((label) => <th key={label} className="px-3 py-2 text-left">{label}</th>)}</tr></thead>
          <tbody>
            {groups.map((group, index) => (
              <tr key={group} className="border-t">
                <td className="px-3 py-2 font-medium">{group}</td>
                {actions.map((action, actionIndex) => <td key={action} className="px-3 py-2"><input type="checkbox" defaultChecked={(index + actionIndex) % 4 !== 0} aria-label={`${group} ${action}`} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

export function SettingsTabs() {
  const tabs = ["General Settings", "Organization Profile", "Branding", "Notification Settings", "Booking Configuration", "Shipment Configuration", "Invoice Configuration", "Integration Settings", "Security Settings"]
  return (
    <Panel title="Settings Tabs">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => <Button key={tab} variant={index === 0 ? "default" : "outline"} size="sm">{tab}</Button>)}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {["REST API", "EDI", "Customs", "ERP", "Banking", "GPS", "Email", "SMS"].map((integration) => (
          <div key={integration} className="rounded-lg border p-3">
            <div className="font-medium">{integration}</div>
            <div className="mt-1 text-sm text-muted-foreground">Mock integration configured</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function RouteMap() {
  return (
    <Panel title="Visual Route">
      <div className="relative h-56 overflow-hidden rounded-lg border bg-[linear-gradient(135deg,rgba(14,165,233,.12),rgba(16,185,129,.10))]">
        <div className="absolute left-[12%] top-[58%] size-4 rounded-full bg-primary ring-8 ring-primary/15" />
        <div className="absolute right-[14%] top-[28%] size-4 rounded-full bg-success ring-8 ring-success/15" />
        <div className="absolute left-[15%] right-[17%] top-[48%] h-1 -rotate-12 rounded-full bg-primary/55" />
        <div className="absolute bottom-4 left-4 text-sm font-medium">Cat Lai Terminal</div>
        <div className="absolute right-4 top-4 text-sm font-medium">Singapore Port</div>
      </div>
    </Panel>
  )
}
