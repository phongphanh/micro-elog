import {
  Bell,
  Building2,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Container,
  CreditCard,
  Database,
  FileText,
  Gauge,
  Globe2,
  LayoutDashboard,
  Settings,
  Shield,
  Ship,
  Truck,
  Users,
} from "lucide-react"

import type { ModuleKey, StatusTone } from "@/lib/elog/types"
import type { MiniAppNavItem } from "@/lib/elog/integration-context"

export const moduleRoutes: Record<ModuleKey, string> = {
  dashboard: "/",
  bookings: "/bookings",
  shipments: "/shipments",
  containers: "/containers",
  appointments: "/appointments",
  vehicles: "/vehicles",
  drivers: "/drivers",
  documents: "/documents",
  invoices: "/invoices",
  payments: "/payments",
  customers: "/customers",
  partners: "/partners",
  reports: "/reports",
  notifications: "/notifications",
  users: "/users",
  roles: "/roles",
  "master-data": "/master-data",
  settings: "/settings",
}

export const routeToModule = Object.fromEntries(
  Object.entries(moduleRoutes).map(([key, route]) => [route.replace("/", "") || "dashboard", key])
) as Record<string, ModuleKey>

export const ports = [
  "Port of Hai Phong",
  "Cat Lai Terminal",
  "Cai Mep Terminal",
  "Port Klang",
  "Singapore Port",
  "Laem Chabang Port",
]

export const customers = ["An Phat Export", "Viet Dragon Foods", "Lotus Retail", "Mekong Furniture", "Pacific Electronics"]

export const shippingLines = ["Maersk", "MSC", "CMA CGM", "ONE", "Evergreen", "Hapag-Lloyd"]

export const statusToneMap: Record<string, StatusTone> = {
  Draft: "neutral",
  Submitted: "blue",
  "Under Review": "amber",
  Approved: "green",
  Rejected: "red",
  "In Progress": "blue",
  Completed: "green",
  Cancelled: "red",
  Planned: "neutral",
  "Awaiting Pickup": "amber",
  "Picked Up": "blue",
  "At Origin Port": "cyan",
  Loaded: "blue",
  "In Transit": "blue",
  "At Destination Port": "cyan",
  "Customs Clearance": "amber",
  "Out for Delivery": "blue",
  Delivered: "green",
  Delayed: "red",
  Empty: "neutral",
  Booked: "blue",
  "Gate In": "cyan",
  "In Yard": "amber",
  Discharged: "cyan",
  "Customs Hold": "red",
  "Ready for Pickup": "green",
  "Gate Out": "green",
  Returned: "green",
  Scheduled: "blue",
  Confirmed: "green",
  "Checked In": "cyan",
  "At Gate": "amber",
  Available: "green",
  Assigned: "blue",
  Maintenance: "amber",
  Inactive: "neutral",
  "Pending Review": "amber",
  Expired: "red",
  Archived: "neutral",
  Issued: "blue",
  "Partially Paid": "amber",
  Paid: "green",
  Overdue: "red",
  Active: "green",
  Invited: "blue",
  Suspended: "red",
  Unread: "blue",
  Read: "neutral",
}

export const menuGroups = [
  { label: "Main", items: [{ key: "dashboard" as ModuleKey, label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Operations",
    items: [
      { key: "bookings" as ModuleKey, label: "Bookings", icon: ClipboardList },
      { key: "shipments" as ModuleKey, label: "Shipments", icon: Ship },
      { key: "containers" as ModuleKey, label: "Containers", icon: Container },
      { key: "appointments" as ModuleKey, label: "Truck Appointments", icon: CalendarDays },
    ],
  },
  {
    label: "Transportation",
    items: [
      { key: "vehicles" as ModuleKey, label: "Vehicles", icon: Truck },
      { key: "drivers" as ModuleKey, label: "Drivers", icon: Users },
    ],
  },
  {
    label: "Business",
    items: [
      { key: "documents" as ModuleKey, label: "Documents", icon: FileText },
      { key: "invoices" as ModuleKey, label: "Invoices", icon: CircleDollarSign },
      { key: "payments" as ModuleKey, label: "Payments", icon: CreditCard },
      { key: "customers" as ModuleKey, label: "Customers", icon: Building2 },
      { key: "partners" as ModuleKey, label: "Partners", icon: Globe2 },
      { key: "reports" as ModuleKey, label: "Reports", icon: Gauge },
      { key: "notifications" as ModuleKey, label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Administration",
    items: [
      { key: "users" as ModuleKey, label: "Users", icon: Users },
      { key: "roles" as ModuleKey, label: "Roles", icon: Shield },
      { key: "master-data" as ModuleKey, label: "Master Data", icon: Database },
      { key: "settings" as ModuleKey, label: "Settings", icon: Settings },
    ],
  },
]

export const ELOG_APP_CODE = "elog"
export const ELOG_HOST_BASEPATH = "/apps/elog"

export const elogNavItems: MiniAppNavItem[] = menuGroups.flatMap((group) =>
  group.items.map((item) => ({
    key: `elog-${item.key}`,
    label: item.label,
    path: item.key === "dashboard" ? ELOG_HOST_BASEPATH : `${ELOG_HOST_BASEPATH}${moduleRoutes[item.key]}`,
    icon: item.label.charAt(0),
  }))
)
