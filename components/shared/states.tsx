import { AlertTriangle, Database } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid h-full place-items-center p-8 text-center">
      <div>
        <Database className="mx-auto size-9 text-muted-foreground" />
        <div className="mt-3 font-medium">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-center gap-2 font-medium text-destructive">
        <AlertTriangle className="size-4" /> Unable to load data
      </div>
      <div className="text-sm text-muted-foreground">{message}</div>
      <Button variant="outline" onClick={onRetry}>Retry</Button>
    </div>
  )
}

export function PermissionDenied() {
  return (
    <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 text-sm">
      <div className="font-medium text-amber-700 dark:text-amber-300">Permission denied state</div>
      <div className="mt-1 text-muted-foreground">This role can view records but cannot approve, export, or delete sensitive finance data.</div>
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-10 animate-pulse rounded-lg bg-muted" />)}
    </div>
  )
}
