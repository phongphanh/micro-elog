"use client"

import { format, subDays } from "date-fns"
import { ChevronLeft, Edit } from "lucide-react"
import { toast } from "sonner"

import { FileUploader } from "@/components/shared/file-uploader"
import { PageHeader } from "@/components/shared/page-header"
import { Panel } from "@/components/shared/panel"
import { Progress } from "@/components/shared/progress"
import { StatusBadge } from "@/components/shared/status-badge"
import { Timeline } from "@/components/shared/timeline"
import { Button } from "@/components/ui/button"
import { DetailSection } from "@/features/modules/detail-section"
import { PermissionMatrix, RouteMap } from "@/features/modules/module-extras"
import type { DataRecord, ModuleConfig } from "@/lib/elog/types"

export function DetailPage({
  config,
  record,
  onBack,
  onEdit,
}: {
  config: ModuleConfig
  record: DataRecord
  onBack: () => void
  onEdit: () => void
}) {
  return (
    <div className="space-y-5">
      <PageHeader
        title={String(record.title)}
        description={`${config.entityLabel} detail view with summary, timeline, documents, notes and action buttons.`}
        action={<div className="flex gap-2"><Button variant="outline" onClick={onBack}><ChevronLeft /> Back</Button><Button onClick={onEdit}><Edit /> Edit</Button></div>}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {config.detailSections.map((section) => <DetailSection key={section.title} title={section.title} record={record} fields={section.fields} />)}
          {config.key === "containers" && <RouteMap />}
          {config.key === "roles" && <PermissionMatrix />}
          {config.key === "documents" && <FileUploader />}
          <Panel title="Milestone Timeline">
            <Timeline
              items={["Booking confirmed", "Cargo picked up", "Gate in", "Loaded on vessel", "Vessel departed", "Vessel arrived", "Customs cleared", "Gate out", "Delivered"].map((title, index) => ({
                title,
                description: index < 5 ? "Completed by operations team" : "Pending milestone confirmation",
                time: format(subDays(new Date(2026, 6, 22), 8 - index), "MMM dd"),
              }))}
            />
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel title="Current Status">
            <div className="space-y-4">
              <StatusBadge status={String(record.status ?? "Active")} />
              <Progress value={Number(String(record.progress ?? "68").replace("%", "")) || 68} />
              <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
                Internal notes, exception alerts, related documents and recent activity are available in this MVP detail panel.
              </div>
            </div>
          </Panel>
          <Panel title="Action Buttons">
            <div className="grid gap-2">
              {["Approve", "Request revision", "Download PDF", "Archive"].map((action) => (
                <Button key={action} variant="outline" onClick={() => toast.success(`${action} completed in mock UI`)}>{action}</Button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
