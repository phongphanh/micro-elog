import { Panel } from "@/components/shared/panel"
import type { DataRecord } from "@/lib/elog/types"

export function DetailSection({ title, record, fields }: { title: string; record: DataRecord; fields: string[] }) {
  const visible = fields.filter((field) => record[field] !== undefined)
  return (
    <Panel title={title}>
      <dl className="grid gap-3 sm:grid-cols-2">
        {visible.map((field) => (
          <div key={field} className="rounded-lg border bg-muted/35 p-3">
            <dt className="text-xs font-medium uppercase text-muted-foreground">{field.replace(/([A-Z])/g, " $1")}</dt>
            <dd className="mt-1 text-sm font-medium">{String(record[field])}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}
