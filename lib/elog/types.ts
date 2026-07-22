import type { ElementType } from "react"

export type StatusTone = "blue" | "green" | "amber" | "red" | "neutral" | "violet" | "cyan"

export type RecordValue = string | number | boolean | null | undefined

export type DataRecord = {
  id: string
  status?: string
  title?: string
  [key: string]: RecordValue
}

export type ModuleKey =
  | "dashboard"
  | "bookings"
  | "shipments"
  | "containers"
  | "appointments"
  | "vehicles"
  | "drivers"
  | "documents"
  | "invoices"
  | "payments"
  | "customers"
  | "partners"
  | "reports"
  | "notifications"
  | "users"
  | "roles"
  | "master-data"
  | "settings"

export type ViewMode = "list" | "detail" | "create" | "edit"

export type ModuleConfig = {
  key: ModuleKey
  route: string
  title: string
  description: string
  entityLabel: string
  icon: ElementType
  primaryAction?: string
  columns: Array<{ key: string; label: string }>
  filters: Array<{ key: string; label: string; options: string[] }>
  records: DataRecord[]
  detailSections: Array<{ title: string; fields: string[] }>
}

export type TimelineItem = {
  title: string
  description: string
  time: string
}
