import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const inputClass = "h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
}

export function Field({
  label,
  error,
  children,
  wide,
}: {
  label: string
  error?: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <label className={cn("grid gap-1.5 text-sm", wide && "md:col-span-2 xl:col-span-3")}>
      <span className="font-medium">{label}</span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
