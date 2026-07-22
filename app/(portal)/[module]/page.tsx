import { notFound } from "next/navigation"

import { ModulePage } from "@/features/modules/module-page"
import { moduleRoutes, routeToModule } from "@/lib/elog/constants"

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(moduleRoutes)
    .filter((route) => route !== "/")
    .map((route) => ({ module: route.replace("/", "") }))
}

export default async function Page({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params
  const moduleKey = routeToModule[module]

  if (!moduleKey || moduleKey === "dashboard") {
    notFound()
  }

  return <ModulePage moduleKey={moduleKey} />
}
