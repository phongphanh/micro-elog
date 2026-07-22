import { redirect } from "next/navigation"

import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { moduleRoutes } from "@/lib/elog/constants"
import type { ModuleKey } from "@/lib/elog/types"

export default async function Page({ searchParams }: { searchParams: Promise<{ module?: string }> }) {
  const { module } = await searchParams
  if (module && module in moduleRoutes) {
    redirect(moduleRoutes[module as ModuleKey])
  }

  return <DashboardPage />
}
