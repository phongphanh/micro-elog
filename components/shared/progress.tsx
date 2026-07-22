export function Progress({ value }: { value: number }) {
  const normalized = Math.max(0, Math.min(100, value))
  return (
    <div className="flex min-w-28 items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${normalized}%` }} />
      </div>
      <span className="w-9 text-xs text-muted-foreground">{normalized}%</span>
    </div>
  )
}
