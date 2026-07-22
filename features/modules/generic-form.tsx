"use client"

import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/shared/page-header"
import { Panel } from "@/components/shared/panel"
import { Button } from "@/components/ui/button"
import { Field, FormGrid, inputClass } from "@/features/modules/form-fields"
import type { DataRecord, ModuleConfig } from "@/lib/elog/types"

export function GenericForm({ config, record, onBack }: { config: ModuleConfig; record?: DataRecord; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <PageHeader
        title={record ? `Edit ${record.title}` : `Create ${config.entityLabel}`}
        description="Mock CRUD form with validation-ready fields and confirmation flow."
        action={<Button variant="outline" onClick={onBack}><ChevronLeft /> Back</Button>}
      />
      <Panel title={`${config.entityLabel} Information`}>
        <FormGrid>
          {config.columns.slice(0, 8).map((column) => (
            <Field key={column.key} label={column.label}>
              <input className={inputClass} defaultValue={String(record?.[column.key] ?? "")} placeholder={column.label} required />
            </Field>
          ))}
        </FormGrid>
      </Panel>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>Cancel</Button>
        <Button onClick={() => { toast.success(`${config.entityLabel} saved in mock UI`); onBack() }}>Save</Button>
      </div>
    </div>
  )
}
