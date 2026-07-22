"use client"

import * as React from "react"

import type { DataRecord, ModuleConfig } from "@/lib/elog/types"

class MockRepository {
  async list(config: ModuleConfig, query: string) {
    await new Promise((resolve) => window.setTimeout(resolve, 360 + Math.random() * 420))
    if (query.toLowerCase() === "error") {
      throw new Error("Mock API error: the service rejected this search.")
    }
    const normalized = query.toLowerCase()
    return config.records.filter((record) =>
      Object.values(record).some((value) => String(value ?? "").toLowerCase().includes(normalized))
    )
  }
}

export const repository = new MockRepository()

export function useModuleRecords(config: ModuleConfig, query: string) {
  const [records, setRecords] = React.useState<DataRecord[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [reloadToken, setReloadToken] = React.useState(0)

  React.useEffect(() => {
    let alive = true

    async function loadRecords() {
      setLoading(true)
      setError(null)
      try {
        const items = await repository.list(config, query)
        if (alive) setRecords(items)
      } catch (reason: unknown) {
        if (alive) setError(reason instanceof Error ? reason.message : "Unable to load records")
      } finally {
        if (alive) setLoading(false)
      }
    }

    void loadRecords()

    return () => {
      alive = false
    }
  }, [config, query, reloadToken])

  return {
    records,
    loading,
    error,
    refresh: () => setReloadToken((value) => value + 1),
  }
}
