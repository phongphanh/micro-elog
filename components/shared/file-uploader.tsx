"use client"

import { Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function FileUploader() {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
      <Upload className="mx-auto size-8 text-muted-foreground" />
      <div className="mt-3 font-medium">Drop files here or browse</div>
      <div className="text-sm text-muted-foreground">Mock upload supports preview, replace, archive, delete and download actions.</div>
      <div className="mt-4 flex justify-center gap-2">
        <Button variant="outline" onClick={() => toast.success("Document uploaded to mock document center")}>Upload file</Button>
        <Button variant="outline" onClick={() => toast.success("Preview opened in mock viewer")}>Preview</Button>
      </div>
    </div>
  )
}
