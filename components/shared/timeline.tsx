import type { TimelineItem } from "@/lib/elog/types"

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="flex gap-3">
          <div className="mt-1 size-2 rounded-full bg-primary ring-4 ring-primary/10" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">{item.title}</div>
              <div className="whitespace-nowrap text-xs text-muted-foreground">{item.time}</div>
            </div>
            <div className="text-sm text-muted-foreground">{item.description}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}
