import { statusToneMap } from "@/lib/elog/constants"
import type { StatusTone } from "@/lib/elog/types"
import { cn } from "@/lib/utils"

export const toneClasses: Record<StatusTone, string> = {
  blue: "bg-blue-500/12 text-blue-700 dark:text-blue-300",
  green: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  red: "bg-red-500/12 text-red-700 dark:text-red-300",
  neutral: "bg-muted text-muted-foreground",
  violet: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
  cyan: "bg-cyan-500/12 text-cyan-700 dark:text-cyan-300",
}

export function StatusBadge({ status }: { status: string }) {
  const tone = statusToneMap[status] ?? (status === "High" ? "red" : status === "Medium" ? "amber" : "neutral")
  return <span className={cn("inline-flex h-6 items-center rounded-md px-2 text-xs font-medium", toneClasses[tone])}>{status}</span>
}
