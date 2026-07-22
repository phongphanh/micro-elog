import type { ElementType } from "react"

import { toneClasses } from "@/components/shared/status-badge"
import type { StatusTone } from "@/lib/elog/types"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  delta,
  comparison,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  delta: string
  comparison: string
  icon: ElementType
  tone: StatusTone
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={cn("grid size-9 place-items-center rounded-lg", toneClasses[tone])}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-4 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">
        <span className={delta.startsWith("+") ? "text-success" : "text-destructive"}>{delta}</span> {comparison}
      </div>
    </div>
  )
}
