import { notFound } from "next/navigation"

import { ModulePage } from "@/features/modules/module-page"
import { routeToModule } from "@/lib/elog/constants"

export default async function Page({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params
  const moduleKey = routeToModule[module]

  if (!moduleKey || moduleKey === "dashboard") {
    notFound()
  }

  return <ModulePage moduleKey={moduleKey} />
}
