"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Edit, MoreHorizontal, RefreshCcw, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog, type ConfirmState } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/states"
import { Progress } from "@/components/shared/progress"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import type { DataRecord, ModuleConfig } from "@/lib/elog/types"

export function DataTable({
  config,
  data,
  onDetail,
  onEdit,
  onRefresh,
}: {
  config: ModuleConfig
  data: DataRecord[]
  onDetail: (record: DataRecord) => void
  onEdit: (record: DataRecord) => void
  onRefresh: () => void
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [confirm, setConfirm] = React.useState<ConfirmState | null>(null)
  const [globalFilter, setGlobalFilter] = React.useState("")

  const columns = React.useMemo<ColumnDef<DataRecord>[]>(() => {
    const generated = config.columns.map<ColumnDef<DataRecord>>((column) => ({
      accessorKey: column.key,
      header: column.label,
      cell: ({ row }) => {
        const value = row.original[column.key]
        if (column.key === "status") return <StatusBadge status={String(value)} />
        if (column.key === "progress") return <Progress value={Number(String(value).replace("%", ""))} />
        return <span className="whitespace-nowrap">{String(value ?? "-")}</span>
      },
    }))

    return [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)}
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(event) => row.toggleSelected(event.target.checked)}
            aria-label={`Select ${row.original.title}`}
          />
        ),
      },
      ...generated,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="View detail" onClick={() => onDetail(row.original)}>
              <MoreHorizontal />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => onEdit(row.original)}>
              <Edit />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete"
              onClick={() =>
                setConfirm({
                  title: `Delete ${row.original.title}?`,
                  body: `This mock action requires confirming the exact record ${row.original.title}.`,
                  onConfirm: () => toast.success(`${row.original.title} deleted in mock UI`),
                })
              }
            >
              <Trash2 />
            </Button>
          </div>
        ),
      },
    ]
  }, [config.columns, onDetail, onEdit])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={`Search ${config.entityLabel.toLowerCase()}...`}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {config.filters.map((filter) => (
            <select
              key={filter.key}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={(table.getColumn(filter.key)?.getFilterValue() as string | undefined) ?? ""}
              onChange={(event) => table.getColumn(filter.key)?.setFilterValue(event.target.value)}
              aria-label={filter.label}
            >
              <option value="">All {filter.label}</option>
              {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ))}
          <Button variant="outline" onClick={onRefresh}><RefreshCcw /> Refresh</Button>
          <Button variant="outline" onClick={() => toast.success("CSV export prepared with mock data")}><Download /> Export CSV</Button>
        </div>
      </div>
      {selectedCount > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg border bg-muted/60 p-3 text-sm">
          <span>{selectedCount} row(s) selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success(`${selectedCount} records approved in mock UI`)}>Bulk approve</Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setConfirm({
                  title: `Delete ${selectedCount} records?`,
                  body: `Bulk delete requires confirming ${selectedCount} selected records.`,
                  onConfirm: () => toast.success(`${selectedCount} records deleted in mock UI`),
                })
              }
            >
              Bulk delete
            </Button>
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/70">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-10 whitespace-nowrap px-3 text-left align-middle font-semibold">
                      {header.isPlaceholder ? null : (
                        <button className="inline-flex items-center gap-1" onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() ? <ChevronDown className="size-3" /> : null}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-muted/40">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="h-12 px-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-56">
                    <EmptyState title={`No ${config.entityLabel.toLowerCase()} found`} description="Adjust filters or create a new record to continue." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="icon-sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} aria-label="First page"><ChevronsLeft /></Button>
          <Button variant="outline" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page"><ChevronLeft /></Button>
          <Button variant="outline" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page"><ChevronRight /></Button>
          <Button variant="outline" size="icon-sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} aria-label="Last page"><ChevronsRight /></Button>
        </div>
      </div>
      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </>
  )
}
