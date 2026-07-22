"use client"

import { Plus, Shield } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { PageHeader } from "@/components/shared/page-header"
import { Panel } from "@/components/shared/panel"
import { ErrorState, PermissionDenied, SkeletonTable } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { BookingForm } from "@/features/modules/booking-form"
import { DataTable } from "@/features/modules/data-table"
import { DetailPage } from "@/features/modules/detail-page"
import { GenericForm } from "@/features/modules/generic-form"
import { ModuleExtras } from "@/features/modules/module-extras"
import { modules } from "@/lib/elog/mock-data"
import { useModuleRecords } from "@/lib/elog/mock-service"
import type { ModuleKey, ViewMode } from "@/lib/elog/types"

export function ModulePage({ moduleKey }: { moduleKey: ModuleKey }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeConfig = modules[moduleKey]
  const config = routeConfig ?? modules.bookings
  const query = searchParams.get("q") ?? ""
  const view = (searchParams.get("view") as ViewMode | null) ?? "list"
  const selectedId = searchParams.get("id")
  const permission = searchParams.get("permission") === "denied"
  const { records, loading, error, refresh } = useModuleRecords(config, query)
  const selectedRecord = records.find((record) => record.id === selectedId) ?? config.records[0]

  if (!routeConfig) {
    return <ErrorState message="Unknown eLog module route." onRetry={() => router.replace("/")} />
  }

  function navigate(nextView: ViewMode = "list", id?: string, permissionDenied = permission) {
    const params = new URLSearchParams()
    if (nextView !== "list") params.set("view", nextView)
    if (id) params.set("id", id)
    if (permissionDenied) params.set("permission", "denied")
    router.replace(`${config.route}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  if (view === "create" || view === "edit") {
    if (config.key === "bookings") {
      return <BookingForm record={view === "edit" ? selectedRecord : undefined} onBack={() => navigate()} />
    }
    return <GenericForm config={config} record={view === "edit" ? selectedRecord : undefined} onBack={() => navigate()} />
  }

  if (view === "detail" && selectedRecord) {
    return <DetailPage config={config} record={selectedRecord} onBack={() => navigate()} onEdit={() => navigate("edit", selectedRecord.id)} />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("list", undefined, !permission)}><Shield /> Permission</Button>
            <Button onClick={() => navigate("create")}><Plus /> {config.primaryAction ?? `Create ${config.entityLabel}`}</Button>
          </div>
        }
      />
      {permission && <PermissionDenied />}
      <ModuleExtras moduleKey={config.key} />
      <Panel title={`${config.entityLabel} List`}>
        {loading ? (
          <SkeletonTable />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { refresh(); toast.success("Retrying mock API") }} />
        ) : (
          <DataTable
            config={config}
            data={records}
            onDetail={(record) => navigate("detail", record.id)}
            onEdit={(record) => navigate("edit", record.id)}
            onRefresh={() => { refresh(); toast.success("Data refreshed from mock API") }}
          />
        )}
      </Panel>
    </div>
  )
}
